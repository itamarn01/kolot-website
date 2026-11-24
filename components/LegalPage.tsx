import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "./home/Shell";
import Motion from "./home/Motion";
import { LEGAL_PAGES, LEGAL_ROUTES, type LegalKey } from "@/lib/legal";
import { LEGAL } from "@/lib/site";
import { SITE_URL } from "@/lib/site";
import type { Lang } from "@/lib/types";
import "./home/home.css";

export function legalMetadata(key: LegalKey, lang: Lang): Metadata {
  const page = LEGAL_PAGES[key][lang];
  const r = LEGAL_ROUTES[key];
  return {
    title: `${page.title} – KOLOT`,
    alternates: { canonical: SITE_URL + r[lang], languages: { "he-IL": SITE_URL + r.he, "en-US": SITE_URL + r.en } },
  };
}

/** Privacy, cookies, accessibility and terms, in the new design (same header and footer as the homepage). */
export default function LegalPage({ k, lang }: { k: LegalKey; lang: Lang }) {
  const page = LEGAL_PAGES[k][lang];
  const other = LEGAL_ROUTES[k][lang === "he" ? "en" : "he"];
  const he = lang === "he";
  return (
    <div className="kh" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <SiteHeader lang={lang} alt={other} />
      <main id="main">
        <section className="kh-sec kh-legal">
          <div className="kh-wrap kh-legal__in">
            <p className="kh-label kh-accent">{he ? "מידע משפטי" : "LEGAL"}</p>
            <h1 className="kh-display-l kh-title">{page.title}</h1>
            <p className="kh-label kh-muted kh-legal__date">
              {he ? "עדכון אחרון" : "Last updated"}: {LEGAL.lastUpdated}
            </p>
            <div className="kh-legal__body">{page.body}</div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
      <Motion />
    </div>
  );
}
