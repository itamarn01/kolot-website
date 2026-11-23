import type { Lang } from "@/lib/types";
import { BENEFITS, CLIPS, COPY, MAIN_VIDEO, STATEMENT, INSTAGRAM, LINEUP, MARQUEE, PHONE, REELS, REVIEWS, WHATSAPP } from "./copy";
import {
  ClipTrack,
  FullscreenWatch,
  HeaderShell,
  HeroVideo,
  InquireButton,
  InquiryDialog,
  LoopVideo,
  MobileMenu,
  PlayRing,
  ReviewsCarousel,
  ShowreelPlayer,
  WatchButton,
} from "./Interactive";
import "./home.css";

const M = "/media/home";

function Eyebrow({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return <p className={`kh-label ${accent ? "kh-accent" : "kh-muted"}`}>{children}</p>;
}

function Arrow() {
  return (
    <svg className="kh-arrow" width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <path d="M22 6 6 22M6 10v12h12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MarqueeRow({ items, variant, reverse }: { items: readonly string[]; variant: "fill" | "outline"; reverse?: boolean }) {
  const run = (
    <span className="kh-marquee__run">
      {items.map((q, i) => (
        <span key={i}>
          <span className="kh-marquee__q">“{q}”</span>
          <span className="kh-marquee__dot">•</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`kh-marquee__row kh-marquee__row--${variant}${reverse ? " is-reverse" : ""}`} dir="ltr">
      <div className="kh-marquee__inner">
        {run}
        {run}
      </div>
    </div>
  );
}

export default function HomePage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const dir = lang === "he" ? "rtl" : "ltr";
  // English shows the cards in mirrored order, as in Figma.
  const reviews = lang === "he" ? REVIEWS : [...REVIEWS].reverse();
  const marqueeRows = lang === "he" ? ([MARQUEE.he, MARQUEE.en] as const) : ([MARQUEE.en, MARQUEE.he] as const);

  return (
    <div className="kh" dir={dir} lang={lang === "he" ? "he" : "en"}>
      {/* ---------------------------------------------------------- header */}
      <HeaderShell>
        <div className="kh-header__in kh-wrap">
          <a href={c.home} className="kh-header__logo" aria-label="KOLOT">
            <img src={`${M}/logo-header.svg`} alt="KOLOT" width={96} height={76} />
          </a>
          <nav className="kh-header__nav" aria-label="Main">
            {c.nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="kh-header__actions">
            <a className="kh-label kh-muted kh-lang" href={c.alt} hrefLang={lang === "he" ? "en" : "he"} aria-label={c.langLabel}>
              {c.langShort}
            </a>
            <InquireButton className="kh-btn kh-btn--primary kh-header__cta">{c.headerCta}</InquireButton>
            <MobileMenu lang={lang} />
          </div>
        </div>
      </HeaderShell>

      <main id="main">
        {/* ---------------------------------------------------------- hero */}
        <section className="kh-hero">
          <HeroVideo lang={lang} />
          <div className="kh-hero__overlay" aria-hidden />
          <div className="kh-hero__content">
            <h1 className="kh-hero__logo">
              <img src={`${M}/logo-hero.webp`} alt="KOLOT – Turn it up." width={250} height={247} />
            </h1>
            <p className="kh-label kh-hero__tag">
              <span className="kh-dot" aria-hidden />
              <span className="kh-desk">{c.liveTag}</span>
              <span className="kh-mob">{c.liveTagMobile}</span>
            </p>
            <p className="kh-hero__sub kh-desk">
              {c.sub[0]}
              <br />
              {c.sub[1]}
            </p>
            <p className="kh-hero__sub kh-mob">{c.subMobile}</p>
            <div className="kh-hero__ctas">
              <InquireButton>{c.check}</InquireButton>
              <WatchButton label={c.watch} lang={lang} />
            </div>
          </div>
          <div className="kh-hero__meta kh-wrap">
            <p>{c.meta.join("  ·  ")}</p>
          </div>
        </section>

        {/* ------------------------------------------------------- reviews */}
        <section className="kh-sec kh-reviews-sec" aria-label={c.reviewsEyebrow}>
          <div className="kh-wrap">
            <Eyebrow>{c.reviewsEyebrow}</Eyebrow>
          </div>
          <ReviewsCarousel lang={lang} reviews={reviews} />
        </section>

        {/* ----------------------------------------------------- statement */}
        <section className="kh-statement" id="about">
          <div className="kh-statement__clips" aria-hidden>
            <LoopVideo src={STATEMENT.loop} poster={STATEMENT.poster} className="kh-statement__clip" />
          </div>
          <div className="kh-statement__veil" aria-hidden />
          <div className="kh-wrap kh-statement__text" data-reveal="up">
            <Eyebrow>{c.statementEyebrow}</Eyebrow>
            <h2 className="kh-display-l">
              {c.statement[0]} <span className="kh-accent">{c.statement[1]}</span>
            </h2>
            <div className="kh-statement__watch">
              <FullscreenWatch lang={lang} label={c.statementWatch} src={STATEMENT.full} poster={STATEMENT.poster} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ showreel */}
        <section className="kh-sec kh-showreel" id="showreel">
          <div className="kh-wrap">
            <Eyebrow>{c.showreelEyebrow}</Eyebrow>
            <h2 className="kh-display-l kh-title">{c.showreelTitle}</h2>
            <ShowreelPlayer lang={lang} youtube={MAIN_VIDEO.youtube} poster={MAIN_VIDEO.poster} tag={c.showreelTag} />
          </div>
          <ClipTrack lang={lang} clips={CLIPS} eyebrow={c.clipsEyebrow} />
        </section>

        {/* ------------------------------------------------------- line-up */}
        <section className="kh-sec kh-lineup" id="lineup">
          <div className="kh-wrap">
            <Eyebrow>{c.lineupEyebrow}</Eyebrow>
            <h2 className="kh-display-l kh-title">{c.lineupTitle}</h2>
            <ol className="kh-lineup__list">
              {LINEUP.map((row, i) => {
                const r = row[lang];
                return (
                  <li key={r.href}>
                    <a className="kh-lineup__row" href={r.href}>
                      <span className="kh-label kh-muted kh-lineup__n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="kh-lineup__thumb">
                        <img src={row.thumb} alt="" loading="lazy" />
                      </span>
                      <span className="kh-display-m kh-lineup__title">{r.title}</span>
                      <span className="kh-label kh-muted kh-lineup__tag">{r.tag}</span>
                      <span className="kh-body kh-muted kh-lineup__text">{r.text}</span>
                      <Arrow />
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- marquee */}
        <section className="kh-marquee" aria-hidden>
          <MarqueeRow items={marqueeRows[0]} variant="fill" reverse={lang === "he"} />
          <MarqueeRow items={marqueeRows[1]} variant="outline" reverse={lang !== "he"} />
        </section>

        {/* --------------------------------------------------------- reels */}
        <section className="kh-sec kh-reels">
          <div className="kh-wrap">
            <div className="kh-reels__head">
              <div>
                <Eyebrow>{c.reelsEyebrow}</Eyebrow>
                <h2 className="kh-display-l kh-title">{c.reelsTitle}</h2>
              </div>
              <a className="kh-reels__ig" dir="ltr" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                @kolotband ↗
              </a>
            </div>
          </div>
          <div className="kh-track kh-reels__track">
            {REELS.map((r, i) => (
              <a key={i} className="kh-reelcard" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <LoopVideo poster={r.poster} src={r.video} />
                <span className="kh-reelcard__shade" />
                <span className="kh-reelcard__play">
                  <PlayRing />
                </span>
                <span className="kh-reelcard__title">{r.title[lang]}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- why */}
        <section className="kh-sec kh-why" id="why">
          <div className="kh-wrap">
            <Eyebrow accent>{c.whyEyebrow}</Eyebrow>
            <h2 className="kh-display-l kh-title">{c.whyTitle}</h2>
            <ul className="kh-why__grid">
              {BENEFITS.map((b) => {
                const [t, d] = b[lang];
                return (
                  <li key={b.icon} className="kh-benefit" data-reveal="up">
                    <img src={`${M}/icon-${b.icon}.svg`} alt="" width={36} height={36} />
                    <h3 className="kh-display-m">{t}</h3>
                    <p className="kh-body kh-muted">{d}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------- worldwide */}
        <section className="kh-ww">
          <img className="kh-ww__img" src={`${M}/worldwide.webp`} alt="" loading="lazy" />
          <div className="kh-ww__veil" aria-hidden />
          <div className="kh-wrap kh-ww__text" data-reveal="up">
            <p className="kh-label">{c.wwEyebrow}</p>
            <h2 className="kh-display-xl">
              {c.wwTitle[0]}
              <br />
              {c.wwTitle[1]}
            </h2>
            <p className="kh-body">{c.wwText}</p>
            <a className="kh-btn kh-btn--outline" href={c.wwHref}>
              {c.wwCta}
            </a>
          </div>
        </section>

        {/* ----------------------------------------------------- final CTA */}
        <section className="kh-cta" id="contact">
          <div className="kh-cta__glow" aria-hidden />
          <div className="kh-cta__beam" aria-hidden />
          <div className="kh-wrap kh-cta__in">
            <Eyebrow accent>{c.ctaEyebrow}</Eyebrow>
            <h2 className="kh-display-xl">{c.ctaTitle}</h2>
            <p className="kh-body-l kh-muted">{c.ctaText}</p>
            <div className="kh-cta__actions">
              <InquireButton>{c.available}</InquireButton>
              <a className="kh-btn kh-btn--outline" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {c.whatsapp}
              </a>
              <a className="kh-cta__phone" href={PHONE.href} dir="ltr">
                {PHONE[lang]}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer */}
      <footer className="kh-footer">
        <div className="kh-wrap kh-footer__in">
          <img src={`${M}/logo-footer.svg`} alt="KOLOT" width={72} height={57} />
          <nav className="kh-footer__nav" aria-label="Footer">
            {c.footerNav.map((n) => (
              <a key={n.label} href={n.href} {...(n.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="kh-footer__legal">
            <span>© 2026 KOLOT</span>
            {c.legal.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <p className="kh-label kh-footer__tag">TURN IT UP</p>
        </div>
      </footer>

      {/* ------------------------------------------------- mobile dock */}
      <div className="kh-dock">
        <InquireButton>{c.available}</InquireButton>
        <a className="kh-btn kh-btn--outline" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          {c.whatsapp}
        </a>
      </div>

      <InquiryDialog lang={lang} />
    </div>
  );
}
