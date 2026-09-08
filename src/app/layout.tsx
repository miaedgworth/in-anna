import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { business, siteUrl } from "@/lib/business";
import { getSettings } from "@/lib/settings";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = siteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: `${business.name} — Women's fashion in St Peter Port, Guernsey`,
      template: `%s — ${business.name}`,
    },
    description: settings.metaDescription,
    applicationName: business.name,
    keywords: [
      "Inanna",
      "Inanna Boutique",
      "womenswear Guernsey",
      "boutique St Peter Port",
      "Le Pollet",
      "women's fashion Guernsey",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: business.name,
      locale: "en_GB",
      url,
      title: `${business.name} — Women's fashion in St Peter Port, Guernsey`,
      description: settings.metaDescription,
      images: [
        {
          url: "/brand/logo.jpg",
          width: 1320,
          height: 1319,
          alt: `${business.name} wordmark in gold on dusty rose`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} — Women's fashion in St Peter Port, Guernsey`,
      description: settings.metaDescription,
      images: ["/brand/logo.jpg"],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: "/brand/logo.jpg",
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4e9e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
