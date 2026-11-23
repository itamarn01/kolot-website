import data from "@/content/reviews.json";
import type { Lang } from "@/lib/types";

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
