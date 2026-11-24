import data from "@/content/reviews.json";
import type { Lang } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

/**
 * Couples' reviews, kept word for word as they were sent (never translated).
 * content/reviews.json is the single source: newest first. The Telegram bot adds new ones to the top.
 * `name`/`venue` null = published anonymously. `pinned` puts a review at the front of the homepage carousel.
 */
export type Review = {
  id: string;
  date: string;
  lang: Lang;
  name: string | null;
  venue: string | null;
  quote: string;
  pinned?: boolean;
  audio?: string;
};

export const REVIEWS = data as Review[];

/** The line under the quote, in the review's own language. */
export function reviewWho(r: Review): string {
  const name = r.name ?? (r.lang === "he" ? "זוג מאושר" : "A happy couple");
  return r.venue ? `${name} · ${r.venue}` : name;
}

/** Homepage carousel: pinned first, then the newest named reviews. */
export function homeReviews(limit = 12): Review[] {
  const named = REVIEWS.filter((r) => r.name);
  return [...named.filter((r) => r.pinned), ...named.filter((r) => !r.pinned)].slice(0, limit);
}

/** The couple's own "post it on Google" page, in the language of their review. */
export function reviewAskUrl(r: Pick<Review, "id" | "lang">): string {
  return `${SITE_URL}${r.lang === "en" ? "/en" : ""}/r/${r.id}/`;
}

/** The WhatsApp message Netanel/Yaniv send a couple after their review is on the site. */
export function reviewAskMessage(r: Pick<Review, "id" | "lang">): string {
  const url = reviewAskUrl(r);
  return r.lang === "en"
    ? `Hi! Your message after the event really moved the whole band 🙏\nWould you post it on Google too? It helps other couples find us.\nIt's all ready for you, takes 20 seconds:\n${url}`
    : `היי! ההודעה ששלחתם לנו אחרי האירוע ריגשה את כל הלהקה 🙏\nנשמח מאוד אם תפרסמו אותה גם בגוגל, זה עוזר לזוגות אחרים למצוא אותנו.\nהכנו לכם הכול, זה לוקח 20 שניות:\n${url}`;
}

/** For clients who haven't written anything yet: the short link straight to Google's review form. */
export function googleAskMessage(lang: Lang): string {
  const url = `${SITE_URL}/google/`;
  return lang === "en"
    ? `Hi! We had a blast playing for you 🎶\nIf you have a minute, we'd love a few words about us on Google. It helps other couples find us:\n${url}`
    : `היי! היה לנו כיף גדול לנגן אצלכם 🎶\nאם יש לכם דקה, נשמח מאוד לכמה מילים עלינו בגוגל. זה עוזר לזוגות אחרים למצוא אותנו:\n${url}`;
}
