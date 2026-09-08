"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { resizeImage } from "@/lib/resize-image";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string | null;
  required?: boolean;
  help?: string;
};

/**
 * Drag-and-drop (or tap-to-choose) image field. The picture is resized in the
 * browser to at most 2000px on its longest side before being uploaded, so the
 * owner can shoot on a phone and upload straight from it.
 */
export function ImageField({ name, label = "Photograph", defaultValue, required, help }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      const prepared = await resizeImage(file);
      const body = new FormData();
      body.append("file", prepared);

      const response = await fetch("/api/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Upload failed.");

      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="admin-label" id={`${id}-label`}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>

      <input type="hidden" name={name} value={url} />

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
        className={`mt-1 flex items-center gap-4 rounded-lg border-2 border-dashed p-3 transition-colors ${
          dragging ? "border-slate-900 bg-slate-50" : "border-slate-300"
        }`}
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
          {url ? (
            <Image src={url} alt="" fill sizes="96px" className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-slate-400">
              No image
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-labelledby={`${id}-label`}
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="admin-button-secondary"
            >
              {busy ? "Uploading…" : url ? "Replace photo" : "Choose photo"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="admin-button-quiet"
                disabled={busy}
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {help ?? "Drag a photo here, or tap to choose one. Large photos are shrunk automatically."}
          </p>
          {error && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
