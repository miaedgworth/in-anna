type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
};

export function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pt-20 lg:px-10">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 text-[2.75rem] leading-[1.05] sm:text-6xl">{title}</h1>
      {intro && (
        <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-charcoal-muted">
          {intro}
        </p>
      )}
    </div>
  );
}
