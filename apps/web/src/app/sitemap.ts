import type { MetadataRoute } from "next";
import { getAllTools } from "@internet-utility/tools";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const categories = ["pdf", "image", "text", "developer", "calculator"];
  const learnPages = ["what-is-cagr", "how-emi-works", "what-is-jwt"];

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...categories.map((slug) => ({
      url: `${BASE_URL}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${BASE_URL}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...learnPages.map((slug) => ({
      url: `${BASE_URL}/learn/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
