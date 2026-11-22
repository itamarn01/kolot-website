import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import InternationalPage from "./InternationalPage";
import { COPY, INTL_ROUTES } from "@/lib/international";
import { SITE_URL } from "@/lib/site";
import type { Lang } from "@/lib/types";

export function intlMetadata(lang: Lang): Metadata {
  const t = COPY[lang];
  const url = SITE_URL + INTL_ROUTES[lang];
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    alternates: { canonical: url, languages: { "en-US": SITE_URL + INTL_ROUTES.en, "he-IL": SITE_URL + INTL_ROUTES.he, "x-default": SITE_URL + INTL_ROUTES.en } },
    openGraph: {
      type: "website",
      url,
      title: t.metaTitle,
      description: t.metaDesc,
      siteName: "KOLOT – קולות",
      locale: lang === "he" ? "he_IL" : "en_US",
      images: [{ url: "/media/gallery/kolot-401.jpg", width: 800, height: 533 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function IntlRoute({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader lang={lang} alt={INTL_ROUTES[lang === "he" ? "en" : "he"]} />
      <InternationalPage lang={lang} />
      <SiteFooter lang={lang} worldwide />
    </>
  );
}
