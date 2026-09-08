import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { AddressBlock, HoursTable, MapEmbed } from "@/components/site/VisitDetails";
import { business } from "@/lib/business";
import { getSettings } from "@/lib/settings";

export function generateMetadata(): Metadata {
  const description = `Find Inanna Boutique at ${business.street}, ${business.locality}, ${business.region} ${business.postalCode}. Open Monday to Saturday, 9:30am to 5:30pm. Call ${business.phoneDisplay}.`;
  return {
    title: "Visit Us",
    description,
    alternates: { canonical: "/visit" },
    openGraph: { title: "Visit Us — Inanna Boutique", description, url: "/visit" },
    other: { "geo.position": `${business.geo.latitude};${business.geo.longitude}` },
  };
}

export default async function VisitPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader eyebrow="Where to find us" title="Visit us" intro={settings.visitIntro} />

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <section>
              <h2 className="eyebrow">The shop</h2>
              <div className="mt-4 text-lg">
                <AddressBlock />
              </div>
              <p className="mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    business.mapsLinkQuery,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-gold pb-0.5 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors hover:text-rose-dark"
                >
                  Open in Google Maps
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </section>

            <section className="mt-14">
              <h2 className="eyebrow">Opening hours</h2>
              <div className="mt-4 max-w-md">
                <HoursTable />
              </div>
            </section>

            <section className="mt-14 border-t border-line pt-10">
              <h2 className="eyebrow">Get in touch</h2>
              <p className="mt-4 max-w-md text-charcoal-muted">
                Looking for a size, a particular label, or want to arrange a time to come in? Email
                us and we will come back to you — or ring the shop during opening hours and we will
                have a proper look for you.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex min-h-12 items-center justify-center bg-charcoal px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-rose-dark"
                >
                  Email the shop
                </a>
                <a
                  href={`tel:${business.phone}`}
                  className="inline-flex min-h-12 items-center justify-center border border-line px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-rose-dark"
                >
                  {business.phoneDisplay}
                </a>
              </div>

              <p className="mt-5 text-sm text-charcoal-muted">
                Or write to us directly at{" "}
                <a
                  href={`mailto:${business.email}`}
                  className="border-b border-gold pb-px transition-colors hover:text-rose-dark"
                >
                  {business.email}
                </a>
                .
              </p>
            </section>
          </div>

          <div className="min-h-[24rem] overflow-hidden border border-line bg-blush lg:min-h-full">
            <MapEmbed />
          </div>
        </div>
      </div>
    </>
  );
}
