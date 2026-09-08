import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { NewInCard } from "@/components/site/NewInCard";
import { AddressBlock, HoursTable, MapEmbed } from "@/components/site/VisitDetails";
import { Wordmark } from "@/components/site/Wordmark";
import { business } from "@/lib/business";
import { getFeaturedNewIn, getVisibleBrands } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const [settings, newIn, brands] = await Promise.all([
    getSettings(),
    getFeaturedNewIn(),
    getVisibleBrands(),
  ]);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative flex w-full min-h-[32rem] items-center justify-center overflow-hidden sm:min-h-[calc(100svh-5.5rem)] lg:aspect-[1320/971] lg:min-h-[30rem] lg:max-h-[calc(100svh-5.5rem)]">
        {/* On wide screens the photograph is shown whole rather than cropped, so
            the bags on the lower rail stay in frame. A blurred copy fills
            whatever is left at the sides instead of flat letterbox bars. */}
        <Image
          src="/brand/interior.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={25}
          className="hidden scale-110 object-cover blur-2xl lg:block"
        />
        <Image
          src="/brand/interior.jpg"
          alt="Inside Inanna: rails of womenswear beneath pleated paper pendant lights"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={72}
          className="object-cover lg:object-contain"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-charcoal/45 via-charcoal/25 to-charcoal/55"
        />
        <div className="relative px-6 py-24 text-center sm:py-28">
          <h1>
            <span className="sr-only">{business.name}</span>
            <Wordmark
              as="plain"
              className="block text-[4.25rem] leading-none drop-shadow-[0_2px_18px_rgba(46,42,40,0.45)] sm:text-[7rem] lg:text-[9rem]"
            />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance font-serif text-xl text-cream drop-shadow-[0_1px_10px_rgba(46,42,40,0.6)] sm:text-2xl">
            {settings.tagline}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/new-in"
              className="inline-flex min-h-12 items-center bg-cream px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-charcoal transition-colors hover:bg-blush"
            >
              See what&rsquo;s new in
            </Link>
            <Link
              href="/visit"
              className="inline-flex min-h-12 items-center border border-cream/70 px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              Visit the shop
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- introduction */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="eyebrow">{business.locality}, {business.region}</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">{settings.introHeading}</h2>
        <p className="mt-7 whitespace-pre-line text-lg leading-relaxed text-charcoal-muted">
          {settings.intro}
        </p>
      </section>

      {/* ------------------------------------------------------- new in */}
      <section className="bg-blush py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Just arrived</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">New in</h2>
            </div>
            <Link
              href="/new-in"
              className="border-b border-gold pb-0.5 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors hover:text-rose-dark"
            >
              See everything
            </Link>
          </div>

          <div className="mt-12">
            {newIn.length === 0 ? (
              <EmptyState>
                New arrivals will appear here as soon as they are added in the admin area.
              </EmptyState>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                {newIn.map((item, index) => (
                  <NewInCard
                    key={item.id}
                    item={item}
                    priority={index < 2}
                    sizes="(min-width: 1024px) 18rem, (min-width: 640px) 30vw, 45vw"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- brands */}
      {brands.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="text-center">
            <p className="eyebrow">Stocking</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">The labels we love</h2>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {brands.slice(0, 12).map((brand) => (
              <li key={brand.id} className="bg-cream">
                <div className="flex aspect-[4/3] items-center justify-center p-5">
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt={brand.imageAlt || `${brand.name} logo`}
                      width={220}
                      height={130}
                      sizes="(min-width: 1024px) 10rem, (min-width: 640px) 20vw, 40vw"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-center font-serif text-xl leading-tight">
                      {brand.name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center">
            <Link
              href="/brands"
              className="border-b border-gold pb-0.5 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors hover:text-rose-dark"
            >
              All brands
            </Link>
          </p>
        </section>
      )}

      {/* ----------------------------------------------------- visit us */}
      <section className="border-t border-line bg-blush">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div>
            <p className="eyebrow">Come and see us</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Visit the shop</h2>
            <div className="mt-8 text-charcoal-muted">
              <AddressBlock />
            </div>
            <div className="mt-8 max-w-sm">
              <HoursTable />
            </div>
            <Link
              href="/visit"
              className="mt-8 inline-flex min-h-12 items-center bg-charcoal px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-rose-dark"
            >
              Directions &amp; contact
            </Link>
          </div>

          <div className="min-h-[22rem] overflow-hidden border border-line bg-cream lg:min-h-full">
            <MapEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
