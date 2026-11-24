import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Lang } from "@/lib/types";
import { REVIEWS, reviewWho } from "@/lib/reviews";
import { GOOGLE_REVIEW_URL } from "@/lib/site";
import GoogleReviewSteps, { type StepsCopy } from "./GoogleReviewSteps";
import "./home.css";

/**
 * /r/<id> and /en/r/<id>: the page a couple gets on WhatsApp after their review is on the site.
 * One button copies their own words and opens Google's review form; all that's left is stars, paste, post.
 * Google can't take pre-filled text or a review posted for someone else, so this is as short as it gets.
 */

const COPY: Record<Lang, StepsCopy & { title: string; eyebrow: string; text: string; yours: string; note: string; site: string; home: string }> = {
  he: {
    eyebrow: "תודה מכל הלהקה",
    title: "ההודעה שלכם ריגשה אותנו",
    text: "נשמח מאוד אם תפרסמו אותה גם בגוגל. זה עוזר לזוגות אחרים למצוא אותנו, והכול כבר מוכן: 20 שניות וזהו.",
    go: "העתיקו ופרסמו בגוגל",
    copied: "✓ הטקסט הועתק. עכשיו בחלון של גוגל:",
    failed: "לא הצלחנו להעתיק אוטומטית. סמנו את הטקסט למטה והעתיקו, ואז פרסמו בגוגל.",
    steps: ["לוחצים על הכפתור: הטקסט שלכם מועתק וגוגל נפתח", "בוחרים 5 כוכבים ★", "לחיצה ארוכה בתיבת הטקסט ← הדבק ← פרסם"],
    copyOnly: "רק להעתיק את הטקסט",
    yours: "ההודעה שלכם (זה מה שיועתק)",
    note: "אפשר לערוך את הטקסט בגוגל לפני הפרסום. צריך להיות מחוברים לחשבון גוגל.",
    site: "לאתר של קולות",
    home: "/",
  },
  en: {
    eyebrow: "Thank you from the whole band",
    title: "Your message moved us",
    text: "We'd love it if you posted it on Google too. It helps other couples find us, and it's all ready: 20 seconds and done.",
    go: "Copy & post on Google",
    copied: "✓ Copied. Now, in the Google window:",
    failed: "We couldn't copy it automatically. Select the text below, copy it, then post on Google.",
    steps: ["Tap the button: your text is copied and Google opens", "Pick 5 stars ★", "Long-press the text box → Paste → Post"],
    copyOnly: "Just copy the text",
    yours: "Your message (this is what gets copied)",
    note: "You can edit the text on Google before posting. You need to be signed in to a Google account.",
    site: "KOLOT website",
    home: "/en/",
  },
};

export const askParams = () => REVIEWS.map((r) => ({ id: r.id }));

export function askMetadata(lang: Lang): Metadata {
  const c = COPY[lang];
  const title = lang === "he" ? "פרסמו את ההמלצה שלכם בגוגל – KOLOT קולות" : "Post your review on Google – KOLOT";
  return {
    title,
    description: c.text,
    // personal pages: the quotes already live on /reviews, so keep these out of search
    robots: { index: false, follow: false },
    openGraph: { title, description: c.text, images: ["/media/iconkolot-300x300.jpg"] },
  };
}

export default async function ReviewAskPage({ lang, params }: { lang: Lang; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = REVIEWS.find((x) => x.id === id);
  if (!r) notFound();
  const c = COPY[lang];
  const he = lang === "he";
  return (
    <div className="kh kh-ask" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <header className="kh-ask__head">
        <a href={c.home} aria-label={c.site}>
          <img src="/media/home/logo-header.svg" alt="KOLOT" width={96} height={76} />
        </a>
      </header>

      <main id="main">
        <div className="kh-ask__intro">
          <p className="kh-label kh-accent">{c.eyebrow}</p>
          <h1 className="kh-display-l">{c.title}</h1>
          <p className="kh-body kh-muted">{c.text}</p>
        </div>

        <GoogleReviewSteps text={r.quote} href={GOOGLE_REVIEW_URL} t={c} />

        <figure className="kh-ask__quote" lang={r.lang} dir={r.lang === "he" ? "rtl" : "ltr"}>
          <p className="kh-label kh-muted">{c.yours}</p>
          <blockquote>{r.quote}</blockquote>
          {r.name && <figcaption>{reviewWho(r)}</figcaption>}
        </figure>

        <p className="kh-ask__note">{c.note}</p>
      </main>

      <footer className="kh-ask__foot">
        <a className="kh-muted" href={c.home}>
          {c.site}
        </a>
      </footer>
    </div>
  );
}
