import type { Lang } from "@/lib/types";
import { REVIEWS, reviewWho } from "@/lib/reviews";
import { COPY, WHATSAPP } from "./copy";
import { InquireButton } from "./Interactive";
import Motion from "./Motion";
import { SiteFooter, SiteHeader } from "./Shell";
import "./home.css";

/** /reviews and /en/reviews: every review, word for word, in the homepage design. */
export default function ReviewsPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const he = lang === "he";
  return (
    <div className="kh" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <SiteHeader lang={lang} alt={he ? "/en/reviews/" : "/reviews/"} />
      <main id="main">
        <section className="kh-sec kh-rv-hero">
          <div className="kh-wrap">
            <p className="kh-label kh-accent">{c.reviewsEyebrow}</p>
            <h1 className="kh-display-l kh-title">{c.reviewsTitle}</h1>
            <p className="kh-body kh-muted kh-rv-hero__text">{c.reviewsText}</p>
            <p className="kh-label kh-muted kh-rv-hero__count">
              <span className="kh-accent">★★★★★</span> · {REVIEWS.length} {he ? "המלצות" : "reviews"}
            </p>
          </div>
        </section>

        <section className="kh-rv-sec" aria-label={c.reviewsTitle}>
          <div className="kh-wrap kh-rv-grid">
            {REVIEWS.map((r) => (
              <figure key={r.id} className="kh-rv" lang={r.lang} dir={r.lang === "he" ? "rtl" : "ltr"}>
                <div className="kh-label kh-accent" aria-label="5/5">
                  ★★★★★
                </div>
                <blockquote>“{r.quote}”</blockquote>
                {r.audio && <audio className="kh-rv__audio" controls preload="none" src={r.audio} />}
                <figcaption>{reviewWho(r)}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="kh-sec kh-rv-cta">
          <div className="kh-wrap">
            <h2 className="kh-display-l">{c.reviewsCta}</h2>
            <div className="kh-rv-cta__btns">
              <InquireButton href={`${c.home}#contact`}>{c.available}</InquireButton>
              <a className="kh-btn kh-btn--outline" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {c.whatsapp}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
      <Motion />
    </div>
  );
}
