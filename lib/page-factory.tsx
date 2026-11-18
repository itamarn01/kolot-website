import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import { getPage } from "./content";
import { SITE_URL } from "./site";
import type { Page } from "./types";

const DEFAULT_DESC = {
  he: "KOLOT – קולות: להקה לחתונות ולאירועים. 15 שנה, מעל 1000 חתונות ואירועים, הרכבי קבלת פנים, דיג׳ייז, להקה לבר/בת מצווה ולאירועי חברה.",
  en: "KOLOT – world-class music for weddings and events. Wedding band, reception ensembles, DJs, bar/bat mitzva and corporate events in Israel.",
};

const enc = (route: string) => encodeURI(route);

export function buildMetadata(page: Page): Metadata {
  const url = SITE_URL + enc(page.route);
  const description = page.description ?? DEFAULT_DESC[page.lang];
  const he = page.lang === "he" ? page.route : page.alt;
  const en = page.lang === "en" ? page.route : page.alt;
  return {
    title: page.title,
    description,
    alternates: {
      canonical: url,
      languages: { "he-IL": SITE_URL + enc(he), "en-US": SITE_URL + enc(en), "x-default": SITE_URL + "/" },
    },
    openGraph: {
      type: "website",
      url,
      title: page.title,
      description,
      siteName: "KOLOT – קולות",
      locale: page.lang === "he" ? "he_IL" : "en_US",
      images: [{ url: "/media/kolot-bg.webp", width: 1600, height: 1049 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export function pageFor(file: string) {
  function Route() {
    return <PageRenderer page={getPage(file)} />;
  }
  return { Route, generateMetadata: (): Metadata => buildMetadata(getPage(file)) };
}
