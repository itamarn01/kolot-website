import { getInstagramPosts } from "@/lib/instagram";
import type { Lang } from "@/lib/types";
import { BENEFITS, CLIPS, COPY, MAIN_VIDEO, STATEMENT, INSTAGRAM, LINEUP, MARQUEE, PHONE, REELS, REVIEWS, WHATSAPP } from "./copy";
import {
  ClipTrack,
  FullscreenWatch,
  HeaderShell,
  HeroVideo,
  InquireButton,
  InquiryDialog,
  InstaTrack,
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

export default async function HomePage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const insta = await getInstagramPosts();
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
          {insta.length > 0 ? (
            <InstaTrack lang={lang} posts={insta} />
          ) : (
            // No Behold feed yet (or it is unreachable): the built-in reel cards, linking to the profile.
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
          )}
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
      {/* ---------------------------------------------- floating WhatsApp (mobile) */}
      <a className="kh-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label={c.whatsapp}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <InquiryDialog lang={lang} />
    </div>
  );
}
