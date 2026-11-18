import { COPY, INTL_ROUTES } from "@/lib/international";
import type { Lang } from "@/lib/types";
import "./international.css";

/** Home-page banner leading to the International & Luxury page. */
export default function WorldwideTeaser({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <a className="ww-teaser" href={INTL_ROUTES[lang]} dir={lang === "en" ? "ltr" : "rtl"} data-reveal="up">
      <span className="ww-teaser__bg" style={{ backgroundImage: 'url("/media/gallery/kolot-401.jpg")' }} aria-hidden />
      <span className="ww-teaser__inner">
        <span className="ww-teaser__eyebrow">{t.teaserEyebrow}</span>
        <span className="ww-teaser__title">{t.teaserTitle}</span>
        <span className="ww-teaser__text">{t.teaserText}</span>
        <span className="ww-teaser__cta">
          {t.teaserCta} <i aria-hidden>→</i>
        </span>
      </span>
    </a>
  );
}
