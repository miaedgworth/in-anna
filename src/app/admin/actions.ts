"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { settingDefinitions } from "@/lib/settings";
import { slugify, uniqueSlug } from "@/lib/slug";

export type ActionState = { status: "idle" | "success" | "error"; message?: string };

const ok = (message: string): ActionState => ({ status: "success", message });
const fail = (message: string): ActionState => ({ status: "error", message });

function refresh(...tags: string[]) {
  for (const tag of tags) revalidateTag(tag);
  revalidatePath("/", "layout");
}

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}

/** Runs an action with auth + a uniform error shape so forms never explode. */
async function guarded(run: () => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    return await run();
  } catch (error) {
    console.error("[admin] action failed:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return fail(message);
  }
}

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v));

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || /^https?:\/\/\S+$/i.test(v), "Website links must start with http:// or https://");

/* ------------------------------------------------------------------ brands */

const brandSchema = z.object({
  name: z.string().trim().min(1, "A brand needs a name.").max(120),
  description: optionalText,
  imageUrl: optionalText,
  imageAlt: optionalText,
  websiteUrl: optionalUrl,
  visible: z.boolean(),
});

function readBrand(formData: FormData) {
  return brandSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
    visible: formData.get("visible") === "on" || formData.get("visible") === "true",
  });
}

export async function createBrand(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = readBrand(formData);
    if (!parsed.success) return fail(firstIssue(parsed.error));

    const existing = await prisma.brand.findMany({ select: { slug: true } });
    const slug = uniqueSlug(slugify(parsed.data.name), new Set(existing.map((b) => b.slug)));
    const last = await prisma.brand.aggregate({ _max: { sortOrder: true } });

    await prisma.brand.create({
      data: { ...parsed.data, slug, sortOrder: (last._max.sortOrder ?? 0) + 1 },
    });

    refresh(CACHE_TAGS.brands);
    return ok(`“${parsed.data.name}” added.`);
  });
}

export async function updateBrand(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("Missing brand id.");

    const parsed = readBrand(formData);
    if (!parsed.success) return fail(firstIssue(parsed.error));

    await prisma.brand.update({ where: { id }, data: parsed.data });
    refresh(CACHE_TAGS.brands, CACHE_TAGS.newIn);
    return ok("Saved.");
  });
}

export async function deleteBrand(formData: FormData): Promise<void> {
  await guarded(async () => {
    const id = String(formData.get("id") ?? "");
    if (id) await prisma.brand.delete({ where: { id } });
    refresh(CACHE_TAGS.brands, CACHE_TAGS.newIn);
    return ok("Deleted.");
  });
}

export async function toggleBrandVisible(formData: FormData): Promise<void> {
  await guarded(async () => {
    const id = String(formData.get("id") ?? "");
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (brand) {
      await prisma.brand.update({ where: { id }, data: { visible: !brand.visible } });
    }
    refresh(CACHE_TAGS.brands);
    return ok("Updated.");
  });
}

/* ------------------------------------------------------------------ new in */

const newInSchema = z.object({
  title: z.string().trim().min(1, "Give the piece a title.").max(160),
  brandId: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v)),
  imageUrl: z.string().trim().min(1, "A photograph is required."),
  imageAlt: optionalText,
  price: optionalText,
  note: optionalText,
});

function readNewIn(formData: FormData) {
  return newInSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    brandId: String(formData.get("brandId") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageAlt: String(formData.get("imageAlt") ?? ""),
    price: String(formData.get("price") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
}

export async function createNewInItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = readNewIn(formData);
    if (!parsed.success) return fail(firstIssue(parsed.error));

    // New arrivals belong at the top of the list.
    const first = await prisma.newInItem.aggregate({ _min: { sortOrder: true } });
    await prisma.newInItem.create({
      data: { ...parsed.data, sortOrder: (first._min.sortOrder ?? 0) - 1 },
    });

    refresh(CACHE_TAGS.newIn);
    return ok(`“${parsed.data.title}” added.`);
  });
}

export async function updateNewInItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("Missing item id.");

    const parsed = readNewIn(formData);
    if (!parsed.success) return fail(firstIssue(parsed.error));

    await prisma.newInItem.update({ where: { id }, data: parsed.data });
    refresh(CACHE_TAGS.newIn);
    return ok("Saved.");
  });
}

export async function deleteNewInItem(formData: FormData): Promise<void> {
  await guarded(async () => {
    const id = String(formData.get("id") ?? "");
    if (id) await prisma.newInItem.delete({ where: { id } });
    refresh(CACHE_TAGS.newIn);
    return ok("Deleted.");
  });
}

/* ----------------------------------------------------------------- gallery */

const gallerySchema = z.object({
  imageUrl: z.string().trim().min(1, "A photograph is required."),
  caption: optionalText,
  imageAlt: optionalText,
});

export async function addGalleryImages(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return guarded(async () => {
    const urls = formData.getAll("imageUrls").map(String).filter(Boolean);
    if (urls.length === 0) return fail("Add at least one photograph first.");

    const last = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } });
    let order = (last._max.sortOrder ?? 0) + 1;
    const caption = String(formData.get("caption") ?? "").trim() || null;

    await prisma.galleryImage.createMany({
      data: urls.map((imageUrl) => ({ imageUrl, caption, sortOrder: order++ })),
    });

    refresh(CACHE_TAGS.gallery);
    return ok(urls.length === 1 ? "Photograph added." : `${urls.length} photographs added.`);
  });
}

export async function updateGalleryImage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return guarded(async () => {
    const id = String(formData.get("id") ?? "");
    if (!id) return fail("Missing image id.");

    const parsed = gallerySchema.safeParse({
      imageUrl: String(formData.get("imageUrl") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      imageAlt: String(formData.get("imageAlt") ?? ""),
    });
    if (!parsed.success) return fail(firstIssue(parsed.error));

    await prisma.galleryImage.update({ where: { id }, data: parsed.data });
    refresh(CACHE_TAGS.gallery);
    return ok("Saved.");
  });
}

export async function deleteGalleryImage(formData: FormData): Promise<void> {
  await guarded(async () => {
    const id = String(formData.get("id") ?? "");
    if (id) await prisma.galleryImage.delete({ where: { id } });
    refresh(CACHE_TAGS.gallery);
    return ok("Deleted.");
  });
}

/* ---------------------------------------------------------------- ordering */

const KINDS = ["brand", "newIn", "gallery"] as const;
export type OrderKind = (typeof KINDS)[number];

const TAG_FOR: Record<OrderKind, string> = {
  brand: CACHE_TAGS.brands,
  newIn: CACHE_TAGS.newIn,
  gallery: CACHE_TAGS.gallery,
};

async function writeOrder(kind: OrderKind, ids: string[]) {
  const updates = ids.map((id, index) => {
    const data = { sortOrder: index };
    if (kind === "brand") return prisma.brand.update({ where: { id }, data });
    if (kind === "newIn") return prisma.newInItem.update({ where: { id }, data });
    return prisma.galleryImage.update({ where: { id }, data });
  });
  await prisma.$transaction(updates);
}

/** Called by the drag-and-drop list once a row has been dropped. */
export async function reorder(kind: OrderKind, ids: string[]): Promise<ActionState> {
  return guarded(async () => {
    if (!KINDS.includes(kind)) return fail("Unknown list.");
    await writeOrder(kind, ids);
    refresh(TAG_FOR[kind]);
    return ok("Order saved.");
  });
}

/* ---------------------------------------------------------------- settings */

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const entries = settingDefinitions.map((definition) => ({
      key: definition.key,
      value: String(formData.get(definition.key) ?? "").trim(),
    }));

    const badUrl = entries.find(
      (e) =>
        (e.key === "instagramUrl" || e.key === "facebookUrl") &&
        e.value !== "" &&
        !/^https?:\/\/\S+$/i.test(e.value),
    );
    if (badUrl) return fail("Social links must be full addresses starting with https://");

    await prisma.$transaction(
      entries.map((entry) =>
        prisma.siteSetting.upsert({
          where: { key: entry.key },
          update: { value: entry.value },
          create: entry,
        }),
      ),
    );

    refresh(CACHE_TAGS.settings);
    return ok("Site settings saved.");
  });
}

/* ------------------------------------------------------------------- auth */

export async function signOutAction(): Promise<void> {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/admin/login" });
}
