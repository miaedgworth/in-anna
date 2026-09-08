import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
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

            <div className="mt-12 h-72 overflow-hidden border border-line bg-blush sm:h-96">
              <MapEmbed />
            </div>
          </div>

          <section>
            <h2 className="eyebrow">Send us a message</h2>
            <p className="mt-4 max-w-md text-charcoal-muted">
              Looking for a size, a particular label, or want to arrange a time to come in? Write to
              us here and we will reply by email — or simply ring the shop during opening hours.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
