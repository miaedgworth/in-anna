import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const CACHE_TAGS = {
  brands: "brands",
  newIn: "new-in",
  gallery: "gallery",
  settings: "site-settings",
} as const;

/** Nothing on the public site should 500 because the database is briefly away. */
async function safely<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[content] database read failed:", error);
    return fallback;
  }
}

export const getVisibleBrands = unstable_cache(
  async () =>
    safely(
      () =>
        prisma.brand.findMany({
          where: { visible: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        }),
      [],
    ),
  ["brands-visible"],
  { tags: [CACHE_TAGS.brands], revalidate: 300 },
);

export const getNewInItems = unstable_cache(
  async () =>
    safely(
      () =>
        prisma.newInItem.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          include: { brand: { select: { name: true, slug: true } } },
        }),
      [],
    ),
  ["new-in-all"],
  { tags: [CACHE_TAGS.newIn, CACHE_TAGS.brands], revalidate: 300 },
);

export const getGalleryImages = unstable_cache(
  async () =>
    safely(
      () =>
        prisma.galleryImage.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
      [],
    ),
  ["gallery-all"],
  { tags: [CACHE_TAGS.gallery], revalidate: 300 },
);

/** The first few gallery photographs, for the strip on the home page. */
export const getHomeGallery = unstable_cache(
  async () =>
    safely(
      () =>
        prisma.galleryImage.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          take: 4,
        }),
      [],
    ),
  ["gallery-home"],
  { tags: [CACHE_TAGS.gallery], revalidate: 300 },
);

export type NewInWithBrand = Awaited<ReturnType<typeof getNewInItems>>[number];
export type BrandRecord = Awaited<ReturnType<typeof getVisibleBrands>>[number];
export type GalleryRecord = Awaited<ReturnType<typeof getGalleryImages>>[number];
