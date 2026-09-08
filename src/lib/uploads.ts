import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const TOKEN_SUFFIX = "BLOB_READ_WRITE_TOKEN";
const STORE_ID_SUFFIX = "BLOB_STORE_ID";

/**
 * Vercel Blob accepts either of two credentials, and which one you get depends
 * on when the store was made:
 *
 *  - a read/write token (BLOB_READ_WRITE_TOKEN), the original scheme; or
 *  - a store id (BLOB_STORE_ID) plus the OIDC token Vercel injects into every
 *    function at runtime, which is what newer stores are given.
 *
 * Connecting a store with an environment-variable prefix renames these to
 * PREFIX_BLOB_READ_WRITE_TOKEN / PREFIX_BLOB_STORE_ID, so match on the suffix.
 */
function envEndingWith(suffix: string): string | undefined {
  const direct = process.env[suffix];
  if (direct) return direct;

  for (const [key, value] of Object.entries(process.env)) {
    if (value && key.endsWith(suffix)) return value;
  }
  return undefined;
}

export function blobToken(): string | undefined {
  return envEndingWith(TOKEN_SUFFIX);
}

export function blobStoreId(): string | undefined {
  return envEndingWith(STORE_ID_SUFFIX);
}

export function blobConfigured(): boolean {
  return Boolean(blobToken() || blobStoreId());
}

/** Names only, never values — so a failed upload can say what the app can see. */
function visibleBlobVars(): string[] {
  return Object.keys(process.env)
    .filter((key) => key.toUpperCase().includes("BLOB"))
    .sort();
}

function safeStem(name: string): string {
  const stem = name.replace(/\.[^.]+$/, "");
  const slug = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "image";
}

/**
 * Stores an uploaded image and returns the URL to serve it from.
 *
 * In production this goes to Vercel Blob. Without a blob token — i.e. local
 * development — it is written to /public/uploads instead, which is enough to
 * work on the site offline but is not durable on a serverless host.
 */
export async function saveUpload(file: File): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP or AVIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That image is larger than 8MB. Please choose a smaller one.");
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeStem(file.name)}.${
    EXTENSIONS[file.type] ?? "jpg"
  }`;

  const token = blobToken();
  const storeId = blobStoreId();

  if (token || storeId) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`inanna/${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      // A token wins if there is one; otherwise the store id pairs with the
      // OIDC token Vercel provides at runtime.
      ...(token ? { token } : { storeId }),
    });
    return blob.url;
  }

  if (process.env.NODE_ENV === "production") {
    const seen = visibleBlobVars();
    throw new Error(
      "Image uploads are not configured — the site can see neither a Blob token nor a store id. " +
        (seen.length > 0
          ? `Blob variables it can see: ${seen.join(", ")}. Connect the Blob store to this project, then redeploy.`
          : "It can see no Blob variables at all, so either the store is not connected to this project or the site has not been redeployed since it was."),
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}
