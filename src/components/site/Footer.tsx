import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";
import { addressLines, business } from "@/lib/business";
import { getSettings } from "@/lib/settings";

const socialIcons = {
  instagram: (
    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4ZM17.6 5.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
  ),
  facebook: (
    <path d="M13.5 22v-8.2h2.8l.42-3.2H13.5V8.55c0-.93.26-1.56 1.6-1.56h1.71V4.13A23 23 0 0 0 14.3 4c-2.47 0-4.16 1.5-4.16 4.26v2.38H7.3v3.2h2.84V22h3.36Z" />
  ),
};

export async function Footer() {
  const settings = await getSettings();
  const socials = [
    { name: "Instagram", url: settings.instagramUrl, icon: socialIcons.instagram },
    { name: "Facebook", url: settings.facebookUrl, icon: socialIcons.facebook },
  ].filter((s) => s.url);

  return (
    <footer className="mt-24 border-t border-line bg-blush">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10">
        <div>
          <Wordmark className="text-4xl leading-none" as="plain" />
          <p className="mt-4 max-w-xs text-sm text-charcoal-muted">
            An independent women&rsquo;s boutique in St Peter Port, Guernsey.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-charcoal-muted transition-colors hover:border-gold hover:text-rose-dark"
                  >
                    <span className="sr-only">{business.name} on {s.name}</span>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="eyebrow">Find us</h2>
          <address className="mt-4 not-italic text-sm leading-7 text-charcoal-muted">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-4 text-sm leading-7">
            <a className="transition-colors hover:text-rose-dark" href={`tel:${business.phone}`}>
              {business.phoneDisplay}
            </a>
            <br />
            <a className="transition-colors hover:text-rose-dark" href={`mailto:${business.email}`}>
              {business.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Opening hours</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-charcoal-muted">
            {settings.hoursText}
          </p>
          <Link
            href="/visit"
            className="mt-5 inline-block border-b border-gold pb-0.5 text-[0.8125rem] uppercase tracking-[0.18em] text-charcoal transition-colors hover:text-rose-dark"
          >
            Visit us
          </Link>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-charcoal-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <Link href="/admin" className="transition-colors hover:text-rose-dark">
            Shop login
          </Link>
        </div>
      </div>
    </footer>
  );
}
