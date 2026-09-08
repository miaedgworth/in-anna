import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/new-in`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/brands`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/visit`, lastModified, changeFrequency: "yearly", priority: 0.8 },
  ];
}
