import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/wedding-band-he/", "/bar-mitzva-he/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
