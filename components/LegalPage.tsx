import type { Metadata } from "next";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { LEGAL_PAGES, LEGAL_ROUTES, type LegalKey } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import type { Lang } from "@/lib/types";

export function legalMetadata(key: LegalKey, lang: Lang): Metadata {
  const page = LEGAL_PAGES[key][lang];
  const r = LEGAL_ROUTES[key];
  return {
    title: `${page.title} – KOLOT`,
    alternates: { canonical: SITE_URL + r[lang], languages: { "he-IL": SITE_URL + r.he, "en-US": SITE_URL + r.en } },
  };
}

export default function LegalPage({ k, lang }: { k: LegalKey; lang: Lang }) {
  const page = LEGAL_PAGES[k][lang];
  const other = LEGAL_ROUTES[k][lang === "he" ? "en" : "he"];
  return (
    <>
      <SiteHeader lang={lang} alt={other} />
      <main id="main" className="legal" dir={lang === "he" ? "rtl" : "ltr"}>
        <h1>{page.title}</h1>
        {page.body}
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
