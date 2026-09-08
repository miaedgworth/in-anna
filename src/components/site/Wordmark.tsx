import Link from "next/link";
import { business } from "@/lib/business";

type Props = {
  className?: string;
  as?: "link" | "plain";
  label?: string;
};

/**
 * The shop's name set the way it is on the shopfront: lowercase serif in
 * brushed gold. Rendered as live text rather than an image so it stays crisp
 * and readable to screen readers and search engines.
 */
export function Wordmark({ className = "", as = "link", label }: Props) {
  const text = <span className={`wordmark ${className}`}>{business.shortName}</span>;

  if (as === "plain") return text;

  return (
    <Link href="/" aria-label={label ?? `${business.name} — home`} className="inline-block">
      {text}
    </Link>
  );
}
