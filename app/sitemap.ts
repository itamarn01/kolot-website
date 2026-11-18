import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/content";
import { LEGAL_ROUTES } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages().map((p) => ({
    url: SITE_URL + encodeURI(p.route),
    changeFrequency: "monthly" as const,
    priority: p.route === "/" ? 1 : p.route === "/en/" ? 0.9 : 0.7,
  }));
  const legal = Object.values(LEGAL_ROUTES).flatMap((r) => [r.he, r.en]).map((u) => ({ url: SITE_URL + u, priority: 0.2 }));
  return [...pages, ...legal];
}
