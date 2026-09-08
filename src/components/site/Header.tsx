"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/site/Wordmark";

const links = [
  { href: "/", label: "Home" },
  { href: "/new-in", label: "New In" },
  { href: "/brands", label: "Brands" },
  { href: "/gallery", label: "Gallery" },
  { href: "/visit", label: "Visit Us" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-cream/95 backdrop-blur-sm"
          : "border-transparent bg-cream/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[calc(var(--header-h)-1px)] max-w-6xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Wordmark className="text-3xl leading-none sm:text-4xl" />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative py-1 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors ${
                    isActive(link.href)
                      ? "text-rose-dark"
                      : "text-charcoal-muted hover:text-charcoal"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${
                      isActive(link.href) ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-charcoal md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true" fill="none">
            <path
              d={open ? "M2 1 L20 13 M20 1 L2 13" : "M0 1h22M0 7h22M0 13h22"}
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!open}
        className="border-t border-line bg-cream md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
          {links.map((link) => (
            <li key={link.href} className="border-b border-line/60 last:border-0">
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block py-4 font-serif text-2xl ${
                  isActive(link.href) ? "text-rose-dark" : "text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
