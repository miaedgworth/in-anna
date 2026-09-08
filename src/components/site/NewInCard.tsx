import Image from "next/image";
import type { NewInWithBrand } from "@/lib/content";

type Props = {
  item: NewInWithBrand;
  priority?: boolean;
  sizes?: string;
  /** Keeps the document outline sequential: h2 on the New In page, h3 under
   *  the "New in" heading on the home page. */
  headingLevel?: 2 | 3;
};

export function NewInCard({ item, priority = false, sizes, headingLevel = 3 }: Props) {
  const Heading = `h${headingLevel}` as "h2" | "h3";

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-blush">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt || `${item.title}${item.brand ? ` by ${item.brand.name}` : ""}`}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-4">
        {item.brand && <p className="eyebrow">{item.brand.name}</p>}
        <Heading className="mt-1.5 text-2xl leading-snug">{item.title}</Heading>
        {item.note && <p className="mt-1.5 text-sm text-charcoal-muted">{item.note}</p>}
        {item.price && <p className="lining-nums mt-2 font-serif text-lg text-rose-dark">{item.price}</p>}
      </div>
    </article>
  );
}
