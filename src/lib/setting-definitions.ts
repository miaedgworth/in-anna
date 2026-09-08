/**
 * The editable site copy, and what the site falls back to when the owner has
 * not set a value. Kept free of Next.js imports so scripts can read it too —
 * adding a key here is all that is needed for it to appear in the admin area.
 */
export const settingDefinitions = [
  {
    key: "tagline",
    label: "Hero tagline",
    help: "One line, shown over the hero photograph on the home page.",
    type: "text",
    fallback: "Considered womenswear in the heart of St Peter Port",
  },
  {
    key: "introHeading",
    label: "Introduction heading",
    help: "The heading above the introduction on the home page.",
    type: "text",
    fallback: "A small shop with a careful eye",
  },
  {
    key: "intro",
    label: "Introduction paragraph",
    help: "Two or three sentences introducing the boutique. Shown on the home page.",
    type: "textarea",
    fallback:
      "Inanna is an independent boutique on Le Pollet, stocking womenswear chosen piece by piece — quiet colour, good cloth and cuts made to be worn for years rather than a season. Everything is picked by hand, in small numbers, and we are always happy to take the time to help you find the right thing.",
  },
  {
    key: "hoursText",
    label: "Opening hours (display text)",
    help: "How the hours read in the footer. The structured hours used by search engines are set in code.",
    type: "textarea",
    fallback: "Monday – Saturday, 9:30am – 5:30pm\nSunday, closed",
  },
  {
    key: "visitIntro",
    label: "Visit Us introduction",
    help: "A short paragraph at the top of the Visit Us page.",
    type: "textarea",
    fallback:
      "You will find us a few doors up Le Pollet, in the pink shopfront with the gold lettering. Do come in — there is always more in the shop than we can show here.",
  },
  {
    key: "newInIntro",
    label: "New In introduction",
    help: "A short paragraph at the top of the New In page.",
    type: "textarea",
    fallback:
      "The latest pieces to arrive in the shop. Everything here is in store now, in limited numbers.",
  },
  {
    key: "brandsIntro",
    label: "Brands introduction",
    help: "A short paragraph at the top of the Brands page.",
    type: "textarea",
    fallback:
      "The labels we return to season after season, alongside the occasional find. If you are looking for something in particular, please do ring the shop.",
  },
  {
    key: "galleryIntro",
    label: "Gallery introduction",
    help: "A short paragraph at the top of the Gallery page.",
    type: "textarea",
    fallback: "A look inside the shop, and a few of the pieces on the rails.",
  },
  {
    key: "instagramUrl",
    label: "Instagram URL",
    help: "Full link, e.g. https://www.instagram.com/yourhandle. Leave blank to hide the icon.",
    type: "text",
    fallback: "",
  },
  {
    key: "facebookUrl",
    label: "Facebook URL",
    help: "Full link, e.g. https://www.facebook.com/yourpage. Leave blank to hide the icon.",
    type: "text",
    fallback: "",
  },
  {
    key: "metaDescription",
    label: "Search engine description",
    help: "Roughly 150 characters, shown under the site name in search results.",
    type: "textarea",
    fallback:
      "Inanna is an independent women's fashion boutique at 22 Le Pollet, St Peter Port, Guernsey. Considered womenswear, chosen piece by piece.",
  },
] as const satisfies readonly {
  key: string;
  label: string;
  help: string;
  type: "text" | "textarea";
  fallback: string;
}[];

export type SettingKey = (typeof settingDefinitions)[number]["key"];
export type Settings = Record<SettingKey, string>;
