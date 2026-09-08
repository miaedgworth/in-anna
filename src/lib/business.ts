/**
 * Facts about the shop that identify the business itself. These are not
 * "content" the owner would tweak from the admin area — they are the legal
 * address, the phone number and the trading hours, and they also feed the
 * LocalBusiness structured data. Editable copy lives in SiteSetting instead.
 */
export const business = {
  name: "Inanna Boutique",
  shortName: "inanna",
  legalName: "Inanna",
  street: "22 Le Pollet",
  locality: "St Peter Port",
  region: "Guernsey",
  postalCode: "GY1 1WH",
  country: "GG",
  countryName: "Guernsey",
  phone: "+441481721826",
  phoneDisplay: "+44 1481 721826",
  email: "hello@inannaboutique.co.uk",
  /* St Peter Port, Guernsey. */
  geo: { latitude: 49.4566, longitude: -2.5359 },
  /* Structured hours — the source of truth for the schema.org markup. */
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "17:30" },
  ],
  closedDays: ["Sunday"],
  mapsEmbedQuery: "22+Le+Pollet,+St+Peter+Port,+Guernsey,+GY1+1WH",
  mapsLinkQuery: "22 Le Pollet, St Peter Port, Guernsey, GY1 1WH",
} as const;

export const addressLines = [
  business.street,
  business.locality,
  business.region,
  business.postalCode,
];

export const addressOneLine = addressLines.join(", ");

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
