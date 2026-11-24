import type { Lang } from "@/lib/types";
import { COPY } from "./copy";
import { WhatsAppFab } from "./Shell";
import AvailabilitySection from "./Funnel";
import "./home.css";

/**
 * /contact and /en/contact: only the contact form, for the Instagram bio and other links.
 * Tag the link with the source, e.g. kolotband.co.il/contact/?src=ig, and the lead's "origin" on monday says so.
 */
export default function ContactPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const he = lang === "he";
  return (
    <div className="kh kh-contact" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      {/* the showreel loop from the homepage hero, behind the whole page */}
      <video className="kh-contact__video" muted loop playsInline autoPlay preload="metadata" poster="/media/home/hero-poster.webp" aria-hidden>
        <source src="/media/showreel/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/media/showreel/hero-desktop.mp4" type="video/mp4" />
      </video>
      <div className="kh-contact__shade" aria-hidden />
      <header className="kh-contact__head">
        <a href={c.home} aria-label={he ? "קולות – לדף הבית" : "KOLOT – home"}>
          <img src="/media/home/logo-header.svg" alt="KOLOT" width={96} height={76} />
        </a>
        <a className="kh-label kh-muted kh-lang" href={he ? "/en/contact/" : "/contact/"} hrefLang={he ? "en" : "he"} aria-label={c.langLabel}>
          {c.langShort}
        </a>
      </header>

      <main id="main">
        <section className="kh-cta kh-contact__form" id="contact">
          <div className="kh-wrap kh-contact__intro">
            <p className="kh-label kh-accent">{c.ctaEyebrow}</p>
            <h1 className="kh-display-l">{c.ctaTitle}</h1>
          </div>
          <AvailabilitySection lang={lang} eyebrow={c.ctaEyebrow} title={c.ctaTitle} text={c.ctaText} cta={c.available} startOpen />
        </section>
      </main>

      <footer className="kh-contact__foot">
        <div className="kh-contact__legal">
          {c.legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
      <WhatsAppFab lang={lang} />
    </div>
  );
}
