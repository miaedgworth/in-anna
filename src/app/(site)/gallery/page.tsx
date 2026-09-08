import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { GalleryGrid } from "@/components/site/Lightbox";
import { PageHeader } from "@/components/site/PageHeader";
import { getGalleryImages } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Gallery",
    description: settings.galleryIntro,
    alternates: { canonical: "/gallery" },
    openGraph: { title: "Gallery — Inanna Boutique", description: settings.galleryIntro, url: "/gallery" },
  };
}

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([getSettings(), getGalleryImages()]);

  return (
    <>
      <PageHeader eyebrow="Inside the shop" title="Gallery" intro={settings.galleryIntro} />

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-10">
        {images.length === 0 ? (
          <EmptyState>Photographs of the shop will appear here soon.</EmptyState>
        ) : (
          <GalleryGrid
            images={images.map((image) => ({
              id: image.id,
              imageUrl: image.imageUrl,
              caption: image.caption,
              imageAlt: image.imageAlt,
            }))}
          />
        )}
      </div>
    </>
  );
}
