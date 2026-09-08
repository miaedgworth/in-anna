const MAX_EDGE = 2000;
const QUALITY = 0.85;

/**
 * Shrinks an image in the browser so nothing bigger than 2000px on its longest
 * side is ever uploaded. Anything the canvas cannot read (an exotic format, a
 * very old browser) is passed through untouched and handled server-side.
 */
export async function resizeImage(file: File): Promise<File> {
  if (typeof document === "undefined" || !file.type.startsWith("image/")) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

    // Already small enough and in a format the server accepts.
    if (scale === 1 && file.size < 2_000_000 && file.type !== "image/heic") {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${name}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}
