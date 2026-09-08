"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { resizeImage } from "@/lib/resize-image";

type Uploaded = { key: string; url: string };

/**
 * Uploads several photographs at once, for the gallery. Each file is resized
 * in the browser and uploaded as it is chosen, so progress is visible.
 */
export function MultiImageField({ name = "imageUrls" }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Uploaded[]>([]);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setPending((n) => n + files.length);

    await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const prepared = await resizeImage(file);
          const body = new FormData();
          body.append("file", prepared);
          const response = await fetch("/api/upload", { method: "POST", body });
          const data = (await response.json()) as { url?: string; error?: string };
          if (!response.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
          setItems((current) => [...current, { key: `${Date.now()}-${file.name}`, url: data.url! }]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "One of the photos could not be uploaded.");
        } finally {
          setPending((n) => n - 1);
        }
      }),
    );
  }

  return (
    <div>
      <span className="admin-label">Photographs</span>

      {items.map((item) => (
        <input key={item.key} type="hidden" name={name} value={item.url} />
      ))}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`mt-1 rounded-lg border-2 border-dashed p-4 transition-colors ${
          dragging ? "border-slate-900 bg-slate-50" : "border-slate-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className="admin-button-secondary">
            Choose photos
          </button>
          {items.length > 0 && (
            <button type="button" onClick={() => setItems([])} className="admin-button-quiet">
              Clear
            </button>
          )}
          <span className="text-xs text-slate-500">
            {pending > 0
              ? `Uploading ${pending}…`
              : items.length > 0
                ? `${items.length} ready to add`
                : "Drag photos here, or tap to choose several at once."}
          </span>
        </div>

        {items.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {items.map((item) => (
              <li key={item.key} className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                <Image src={item.url} alt="" fill sizes="120px" className="object-cover" unoptimized />
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p role="alert" className="mt-2 text-xs text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
