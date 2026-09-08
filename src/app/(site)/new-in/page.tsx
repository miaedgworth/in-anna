import type { Metadata } from "next";
import { EmptyState } from "@/components/site/EmptyState";
import { NewInCard } from "@/components/site/NewInCard";
import { PageHeader } from "@/components/site/PageHeader";
import { getNewInItems } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "New In",
    description: settings.newInIntro,
    alternates: { canonical: "/new-in" },
    openGraph: { title: "New In — Inanna Boutique", description: settings.newInIntro, url: "/new-in" },
  };
}

export default async function NewInPage() {
  const [settings, items] = await Promise.all([getSettings(), getNewInItems()]);

  return (
    <>
      <PageHeader eyebrow="Just arrived" title="New in" intro={settings.newInIntro} />

      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-10">
        {items.length === 0 ? (
          <EmptyState>
            There is nothing listed here at the moment. New pieces are added from the shop as they
            arrive — do ring us if you are looking for something in particular.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-3">
            {items.map((item, index) => (
              <NewInCard
                key={item.id}
                item={item}
                priority={index < 3}
                headingLevel={2}
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 30vw, 45vw"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
