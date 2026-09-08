"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type LightboxImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  imageAlt: string | null;
};

/**
 * A column-count masonry grid with a keyboard-navigable lightbox. Each tile is
 * a real button so the gallery works without a mouse.
 */
export function GalleryGrid({ images }: { images: LightboxImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setOpenIndex((current) => {
      if (current !== null) triggerRefs.current[current]?.focus();
      return null;
    });
  }, []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : images[openIndex];

  return (
    <>
      {/* A column layout will happily split a tile down the middle of a column
          break, leaving the photograph in one column and its caption block in
          the next — hence break-inside-avoid on every tile. */}
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            ref={(el) => {
              triggerRefs.current[index] = el;
            }}
            onClick={() => setOpenIndex(index)}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden bg-blush sm:mb-4"
          >
            <span className="sr-only">
              View larger: {image.caption || image.imageAlt || `photograph ${index + 1}`}
            </span>
            {/* No width/height attributes: photographs arrive in every shape and
                a fixed pair would give the browser a box to crop them into.
                Sizing from the image's own proportions keeps each one whole. */}
            <Image
              src={image.imageUrl}
              alt={image.imageAlt || image.caption || `Inside the shop, photograph ${index + 1}`}
              width={0}
              height={0}
              sizes="(min-width: 768px) 30vw, 45vw"
              className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {image.caption && (
              <span className="block px-1 pt-2 text-left text-xs text-charcoal-muted">
                {image.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || "Photograph"}
          tabIndex={-1}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal/92 p-4 sm:p-8"
        >
          <div className="relative flex max-h-[82vh] w-full max-w-4xl items-center justify-center">
            <Image
              key={current.id}
              src={current.imageUrl}
              alt={current.imageAlt || current.caption || "Photograph of the shop"}
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 56rem, 92vw"
              className="max-h-[82vh] w-auto max-w-full object-contain"
            />
          </div>

          {current.caption && (
            <p className="mt-4 max-w-xl text-center text-sm text-cream/85">{current.caption}</p>
          )}

          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-cream/80 transition-colors hover:text-cream sm:right-6 sm:top-6"
          >
            <span className="sr-only">Close</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream/70 transition-colors hover:text-cream sm:left-4"
              >
                <span className="sr-only">Previous photograph</span>
                <svg width="14" height="24" viewBox="0 0 14 24" aria-hidden="true" fill="none">
                  <path d="M12 2L2 12l10 10" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream/70 transition-colors hover:text-cream sm:right-4"
              >
                <span className="sr-only">Next photograph</span>
                <svg width="14" height="24" viewBox="0 0 14 24" aria-hidden="true" fill="none">
                  <path d="M2 2l10 10-10 10" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
