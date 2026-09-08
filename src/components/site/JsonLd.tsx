import { addressLines, business, siteUrl } from "@/lib/business";
import { getSettings } from "@/lib/settings";

/**
 * LocalBusiness structured data — this is what puts the address, hours and
 * phone number into Google's local results for the shop.
 */
export async function LocalBusinessJsonLd() {
  const settings = await getSettings();
  const url = siteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${url}/#shop`,
    name: business.name,
    alternateName: business.legalName,
    description: settings.metaDescription,
    url,
    image: `${url}/brand/logo.jpg`,
    logo: `${url}/brand/logo.jpg`,
    telephone: business.phoneDisplay,
    email: business.email,
    priceRange: "££",
    currenciesAccepted: "GBP",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.locality,
      addressRegion: business.region,
      postalCode: business.postalCode,
      addressCountry: business.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      business.mapsLinkQuery,
    )}`,
    openingHoursSpecification: business.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [settings.instagramUrl, settings.facebookUrl].filter(Boolean),
    areaServed: { "@type": "Place", name: `${business.region}, Channel Islands` },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: business.phoneDisplay,
      email: business.email,
      areaServed: business.region,
      availableLanguage: "English",
    },
    // Kept human-readable too, for anything that reads the raw markup.
    disambiguatingDescription: addressLines.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
