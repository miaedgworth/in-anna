import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <Wordmark className="text-5xl leading-none" />
      <h1 className="mt-10 text-4xl sm:text-5xl">We couldn&rsquo;t find that page</h1>
      <p className="mt-4 max-w-md text-charcoal-muted">
        The page you were looking for may have moved. Everything in the shop is a click away below.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center bg-charcoal px-8 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-rose-dark"
      >
        Back to the home page
      </Link>
    </main>
  );
}
