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

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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

  if (blobConfigured()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`inanna/${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Image uploads are not configured. Add BLOB_READ_WRITE_TOKEN to the environment.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}
