import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHeader } from "@/components/site/PageHeader";
import { getVisibleBrands } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Brands",
    description: settings.brandsIntro,
    alternates: { canonical: "/brands" },
    openGraph: { title: "Brands — Inanna Boutique", description: settings.brandsIntro, url: "/brands" },
  };
}

export default async function BrandsPage() {
  const [settings, brands] = await Promise.all([getSettings(), getVisibleBrands()]);

  return (
    <>
      <PageHeader eyebrow="What we stock" title="Brands" intro={settings.brandsIntro} />

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-10">
        {brands.length === 0 ? (
          <EmptyState>The brand list is being put together. Please check back shortly.</EmptyState>
        ) : (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <li key={brand.id}>
                <article>
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-blush p-8">
                    {brand.imageUrl ? (
                      <Image
                        src={brand.imageUrl}
                        alt={brand.imageAlt || `${brand.name} logo`}
                        width={520}
                        height={390}
                        sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="wordmark text-center text-3xl">{brand.name}</span>
                    )}
                  </div>

                  <h2 className="mt-5 text-2xl">{brand.name}</h2>
                  {brand.description && (
                    <p className="mt-2 text-charcoal-muted">{brand.description}</p>
                  )}
                  {brand.websiteUrl && (
                    <p className="mt-3">
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-gold pb-0.5 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors hover:text-rose-dark"
                      >
                        Visit website
                        <span className="sr-only"> for {brand.name} (opens in a new tab)</span>
                      </a>
                    </p>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
