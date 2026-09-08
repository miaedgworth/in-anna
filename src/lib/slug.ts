export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Appends -2, -3 … until the slug is not already taken. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const stem = base || "brand";
  if (!taken.has(stem)) return stem;
  let n = 2;
  while (taken.has(`${stem}-${n}`)) n += 1;
  return `${stem}-${n}`;
}
