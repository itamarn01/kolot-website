"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import YouTubeModal from "@/components/YouTubeModal";
import type { Lang } from "@/lib/types";
import type { InstaPost } from "@/lib/instagram";
import { COPY, type Clip } from "./copy";

/** A carousel card: the quote word for word, and who sent it. */
export type ReviewCard = { id: string; quote: string; who: string; lang: Lang };

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ icons */

export function PlayRing({ size = 40 }: { size?: number }) {
  return (
    <svg className="kh-playring" width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 16.5v15l12-7.5z" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------- availability buttons */

/** Header / hero CTAs: scroll down to the availability section (#contact), where the form opens. */
export function InquireButton({ children, className = "kh-btn kh-btn--primary", href = "#contact" }: { children: ReactNode; className?: string; href?: string }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        // On the homepage, glide to the form; on other pages, go to the homepage form.
        const form = document.getElementById("contact");
        if (!form) return;
        e.preventDefault();
        form.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------- header */

export function HeaderShell({ children }: { children: ReactNode }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <header className={`kh-header${solid ? " is-solid" : ""}`}>{children}</header>;
}

/**
 * Full-screen menu on phones. It fades in softly and the links rise one after another; closing fades it out.
 * The panel is rendered next to the header, not inside it: once the page scrolls the header gets a blur,
 * and a blurred parent would shrink a fixed child to the header's own strip.
 */
export function MobileMenu({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [mounted, setMounted] = useState(false); // in the DOM (not hidden)
  const [open, setOpen] = useState(false); // animated to the open state
  const [host, setHost] = useState<HTMLElement | null>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // the page wrapper (.kh) carries the colours, fonts and direction the menu needs
  useEffect(() => setHost((burger.current?.closest(".kh") as HTMLElement | null) ?? document.body), []);

  const show = () => {
    clearTimeout(closeTimer.current);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };
  const hide = () => {
    setOpen(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMounted(false), 400);
  };

  useEffect(() => {
    document.documentElement.style.overflow = mounted ? "hidden" : "";
    // the accessibility button hides while the menu is open (CSS: html.kh-menu-open)
    document.documentElement.classList.toggle("kh-menu-open", mounted);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [mounted]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const panel = (
    <nav id="kh-menu" className={`kh-menu${open ? " is-open" : ""}`} aria-label={c.menu} hidden={!mounted}>
      <ul style={{ "--n": c.nav.length } as CSSProperties}>
        {c.nav.map((n, i) => (
          <li key={n.href} style={{ "--i": i } as CSSProperties}>
            <a href={n.href} onClick={hide}>
              <span className="kh-menu__n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              {n.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="kh-label kh-menu__tag" dir="ltr" aria-hidden>
        TURN IT UP.
      </p>
    </nav>
  );

  return (
    <>
      <button
        ref={burger}
        type="button"
        className={`kh-burger${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="kh-menu"
        aria-label={open ? c.close : c.menu}
        onClick={() => (open ? hide() : show())}
      >
        <span />
        <span />
      </button>
      {host && createPortal(panel, host)}
    </>
  );
}

/* --------------------------------------------------------------- hero */

const HERO_WATCH_EVENT = "kolot:hero-watch";

/**
 * Background loop (black & white, muted). "Watch the showreel" turns the hero into a full-screen colour
 * player with sound; the × button (or Esc, or the end of the video) brings the loop back.
 */
export function HeroVideo({ lang }: { lang: Lang }) {
  const loop = useRef<HTMLVideoElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    const v = loop.current;
    if (!v) return;
    if (reduced()) v.pause();
    else v.play().catch(() => {});
  }, []);

  const close = useCallback(() => {
    const f = full.current;
    f?.pause();
    setWatching(false);
    if (!reduced()) loop.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    const open = () => {
      const f = full.current;
      if (!f) return;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      // phones get a 720p encode (~2.4 Mbps, 17 MB): the 1080p file stalled on weak mobile connections
      const src = mobile ? "/media/showreel/showreel-mobile-color-720.mp4" : "/media/showreel/showreel-desktop-color.mp4";
      if (!f.src.endsWith(src)) f.src = src;
      f.currentTime = 0;
      f.muted = false;
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      setWatching(true);
      loop.current?.pause();
      f.play().catch(() => {
        // Browser refused sound: play muted rather than not at all.
        f.muted = true;
        f.play().catch(() => {});
      });
    };
    window.addEventListener(HERO_WATCH_EVENT, open);
    return () => window.removeEventListener(HERO_WATCH_EVENT, open);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("kh-watching", watching);
    if (!watching) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [watching, close]);

  return (
    <>
      <video ref={loop} className="kh-hero__video" muted loop playsInline autoPlay preload="metadata" poster="/media/home/hero-poster.webp" aria-hidden>
        <source src="/media/showreel/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/media/showreel/hero-desktop.mp4" type="video/mp4" />
      </video>
      {/* Clicking the dark area around the framed player closes it (the veil is the video's box-shadow, which isn't clickable). */}
      {watching && <div className="kh-hero__backdrop" onClick={close} aria-hidden />}
      <video
        ref={full}
        className={`kh-hero__full${watching ? " is-on" : ""}`}
        playsInline
        preload="none"
        controls={watching}
        onEnded={close}
        aria-hidden={!watching}
        tabIndex={watching ? 0 : -1}
      />
      {watching && (
        <button type="button" className="kh-hero__close" onClick={close} aria-label={COPY[lang].close} autoFocus>
          ×
        </button>
      )}
    </>
  );
}

const SHOWREEL_EVENT = "kolot:showreel";

export function WatchButton({ label, lang }: { label: string; lang: Lang }) {
  return (
    <button type="button" className="kh-btn kh-btn--watch" onClick={() => window.dispatchEvent(new Event(HERO_WATCH_EVENT))} data-lang={lang}>
      <PlayRing />
      <span>{label}</span>
    </button>
  );
}

/* ----------------------------------------------------------- showreel */

/** The big 16:9 player under "See us live": a YouTube video (poster first; the embed loads only on play). */
export function ShowreelPlayer({ lang, youtube, poster, tag }: { lang: Lang; youtube: string; poster: string; tag: string }) {
  const [playing, setPlaying] = useState(false);
  const start = useCallback(() => setPlaying(true), []);
  useEffect(() => {
    window.addEventListener(SHOWREEL_EVENT, start);
    return () => window.removeEventListener(SHOWREEL_EVENT, start);
  }, [start]);
  return (
    <div className={`kh-reel${playing ? " is-playing" : ""}`}>
      {playing ? (
        <iframe
          className="kh-reel__video"
          src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&playsinline=1`}
          title={tag}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <img className="kh-reel__video" src={poster} alt="" loading="lazy" />
          <button type="button" className="kh-reel__cover" onClick={start} aria-label={`${COPY[lang].play}: ${tag}`}>
            <PlayRing size={120} />
            <span className="kh-label kh-reel__tag">{tag}</span>
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------- horizontal track utils */

function useTrack() {
  const ref = useRef<HTMLDivElement>(null);
  /** dir: +1 = forward in reading order, -1 = back. */
  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "20") : el.clientWidth * 0.8;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: w * dir * (rtl ? -1 : 1), behavior: reduced() ? "auto" : "smooth" });
  };
  return { ref, step };
}

function Arrows({ lang, onPrev, onNext }: { lang: Lang; onPrev: () => void; onNext: () => void }) {
  const c = COPY[lang];
  // Arrows point in reading direction: in RTL "next" points left.
  const [prevGlyph, nextGlyph] = lang === "he" ? ["→", "←"] : ["←", "→"];
  return (
    <div className="kh-arrows">
      <button type="button" onClick={onPrev} aria-label={c.prev}>
        {prevGlyph}
      </button>
      <button type="button" onClick={onNext} aria-label={c.next}>
        {nextGlyph}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ reviews */

export function ReviewsCarousel({ lang, reviews }: { lang: Lang; reviews: ReviewCard[] }) {
  const { ref, step } = useTrack();
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);

  // Which card is current = the one closest to the reading-start edge.
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? Math.abs(el.scrollLeft) / max : 0;
    setIdx(Math.round(p * (reviews.length - 1)));
  };

  useEffect(() => {
    if (reduced()) return;
    const t = window.setInterval(() => {
      const el = ref.current;
      if (!el || paused.current) return;
      const atEnd = Math.abs(el.scrollLeft) >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else step(1);
    }, 6000);
    return () => window.clearInterval(t);
  }, [ref, step]);

  const pct = 100 / reviews.length;
  return (
    <div
      className="kh-reviews"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div ref={ref} className="kh-track kh-reviews__track" onScroll={onScroll} tabIndex={0} aria-roledescription="carousel">
        {reviews.map((r) => (
          <figure key={r.id} className="kh-review" lang={r.lang} dir={r.lang === "he" ? "rtl" : "ltr"}>
            <div>
              <div className="kh-label kh-accent" aria-label="5/5">
                ★★★★★
              </div>
              <blockquote className="kh-review__quote">“{r.quote}”</blockquote>
            </div>
            <figcaption>{r.who}</figcaption>
          </figure>
        ))}
      </div>
      <div className="kh-progress" aria-hidden>
        <span style={{ width: `${pct}%`, insetInlineStart: `${idx * pct}%` }} />
      </div>
      <div className="kh-reviews__foot">
        <span className="kh-label kh-muted" dir="ltr">
          {String(idx + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
        </span>
        <Arrows lang={lang} onPrev={() => step(-1)} onNext={() => step(1)} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- clips */

function ClipCard({ clip, lang }: { clip: Clip; lang: Lang }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [yt, setYt] = useState<string | null>(null);
  const title = clip.title[lang];
  const inner = (
    <>
      <img src={clip.poster} alt="" loading="lazy" />
      {clip.video && (
        <video ref={ref} src={clip.video} playsInline preload="none" controls={playing} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
      )}
      {!playing && (
        <>
          <span className="kh-clip__shade" />
          <span className="kh-clip__play">
            <PlayRing size={44} />
          </span>
          <span className="kh-clip__title">{title}</span>
          {clip.time && <span className="kh-label kh-accent kh-clip__time">{clip.time}</span>}
        </>
      )}
    </>
  );
  if (clip.youtube) {
    const id = clip.youtube;
    return (
      <>
        <button type="button" className="kh-clip" aria-label={`${COPY[lang].play}: ${title}`} onClick={() => setYt(id)}>
          {inner}
        </button>
        {yt && <YouTubeModal id={yt} lang={lang} onClose={() => setYt(null)} />}
      </>
    );
  }
  if (clip.video) {
    return (
      <button type="button" className="kh-clip" aria-label={`${COPY[lang].play}: ${title}`} onClick={() => ref.current?.play()}>
        {inner}
      </button>
    );
  }
  // No clip file yet: the card plays the main showreel.
  return (
    <a className="kh-clip" href="#showreel" aria-label={`${COPY[lang].play}: ${title}`} onClick={() => window.setTimeout(() => window.dispatchEvent(new Event(SHOWREEL_EVENT)), 500)}>
      {inner}
    </a>
  );
}

export function ClipTrack({ lang, clips, eyebrow }: { lang: Lang; clips: Clip[]; eyebrow: string }) {
  const { ref, step } = useTrack();
  return (
    <>
      <div className="kh-clips__head kh-wrap">
        <span className="kh-label kh-muted">{eyebrow}</span>
        <Arrows lang={lang} onPrev={() => step(-1)} onNext={() => step(1)} />
      </div>
      <div ref={ref} className="kh-track kh-clips">
        {clips.map((c, i) => (
          <ClipCard key={i} clip={c} lang={lang} />
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------- full-screen colour player */

/**
 * A "watch" button that opens a video full screen, in colour and with sound, on top of the page.
 * × / Esc / the end of the video closes it and returns to the page where it was.
 */
export function FullscreenWatch({ lang, label, src, poster }: { lang: Lang; label: string; src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const close = useCallback(() => {
    ref.current?.pause();
    setOpen(false);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("kh-watching", open);
    if (!open) return;
    const v = ref.current;
    if (v) {
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, close]);
  return (
    <>
      <button type="button" className="kh-btn kh-btn--watch" onClick={() => setOpen(true)}>
        <PlayRing />
        <span>{label}</span>
      </button>
      {mounted &&
        // Portal to <body>: an animated ancestor (data-reveal transform) would otherwise trap position: fixed inside the section.
        createPortal(
          <div className="kh" dir={lang === "he" ? "rtl" : "ltr"}>
            <div className={`kh-fs${open ? " is-on" : ""}`} aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && close()}>
              <video ref={ref} src={open ? src : undefined} poster={poster} playsInline preload="none" controls={open} onEnded={close} />
              {open && (
                <button type="button" className="kh-hero__close" onClick={close} aria-label={COPY[lang].close} autoFocus>
                  ×
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/* ------------------------------------------------- muted autoplay loops */

/** Plays a muted loop only while it is on screen. */
export function LoopVideo({ src, poster, className }: { src?: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || !src || reduced()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  if (!src) return <img className={className} src={poster} alt="" loading="lazy" />;
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden />;
}

/* ------------------------------------------------------------ instagram */

const IG_TEXT = {
  he: { open: "פתיחת הפוסט", view: "לצפייה באינסטגרם", prev: "הפוסט הקודם", next: "הפוסט הבא", close: "סגירה", label: "פוסט מאינסטגרם", likes: "לייקים", comments: "תגובות" },
  en: { open: "Open post", view: "View on Instagram", prev: "Previous post", next: "Next post", close: "Close", label: "Instagram post", likes: "likes", comments: "comments" },
};

function InstaCard({ post, lang, onOpen }: { post: InstaPost; lang: Lang; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Desktop: a reel previews silently while hovered.
  const hover = (on: boolean) => {
    const v = ref.current;
    if (!v || reduced()) return;
    if (on) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  };
  return (
    <a
      className="kh-insta"
      href={post.permalink}
      aria-label={`${IG_TEXT[lang].open}${post.caption ? `: ${post.caption.slice(0, 80)}` : ""}`}
      onClick={(e) => {
        // Ctrl/Cmd/middle-click still opens Instagram in a new tab; a plain click opens the lightbox.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onOpen();
      }}
      onMouseEnter={() => hover(true)}
      onMouseLeave={() => hover(false)}
    >
      <img src={post.image} alt="" loading="lazy" />
      {post.video && <video ref={ref} src={post.video} muted loop playsInline preload="none" aria-hidden />}
      <span className="kh-reelcard__shade" />
      {post.isVideo && (
        <span className="kh-reelcard__play">
          <PlayRing />
        </span>
      )}
      {post.caption && (
        <span className="kh-insta__caption" dir="auto">
          {post.caption}
        </span>
      )}
    </a>
  );
}

function InstaLightbox({ lang, posts, index, onIndex, onClose }: { lang: Lang; posts: InstaPost[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const t = IG_TEXT[lang];
  const post = posts[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const go = useCallback((d: 1 | -1) => onIndex((index + d + posts.length) % posts.length), [index, onIndex, posts.length]);
  useEffect(() => setSlide(0), [index]);

  // Carousel: track the visible item and pause any video that scrolled out of view.
  const onMediaScroll = () => {
    const el = mediaRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i === slide) return;
    setSlide(i);
    [...el.children].forEach((c, k) => k !== i && c instanceof HTMLVideoElement && c.pause());
  };
  const slideTo = (i: number) => mediaRef.current?.scrollTo({ left: i * mediaRef.current.clientWidth, behavior: reduced() ? "auto" : "smooth" });

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Arrow keys follow reading direction: in Hebrew, ← is "next".
      else if (e.key === "ArrowLeft") go(lang === "he" ? 1 : -1);
      else if (e.key === "ArrowRight") go(lang === "he" ? -1 : 1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go, lang, onClose]);

  const [prevGlyph, nextGlyph] = lang === "he" ? ["→", "←"] : ["←", "→"];
  return createPortal(
    <div className="kh" dir={lang === "he" ? "rtl" : "ltr"}>
      <div className="kh-ig" role="dialog" aria-modal="true" aria-label={t.label} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <button ref={closeRef} type="button" className="kh-hero__close kh-ig__close" onClick={onClose} aria-label={t.close}>
          ×
        </button>
        <button type="button" className="kh-ig__nav kh-ig__nav--prev" onClick={() => go(-1)} aria-label={t.prev}>
          {prevGlyph}
        </button>
        <div className="kh-ig__box" key={post.id}>
          <div className="kh-ig__media" dir="ltr" ref={mediaRef} onScroll={onMediaScroll}>
            {post.media.map((m, i) =>
              m.type === "video" ? (
                <video key={i} src={m.src} poster={m.poster} controls playsInline loop autoPlay={i === 0} />
              ) : (
                <img key={i} src={m.src} alt="" loading={i === 0 ? "eager" : "lazy"} />
              ),
            )}
          </div>
          {post.media.length > 1 && (
            <div className="kh-ig__count" dir="ltr">
              <button type="button" onClick={() => slideTo(Math.max(0, slide - 1))} disabled={slide === 0} aria-label="‹">
                ‹
              </button>
              <span className="kh-label kh-muted">
                {slide + 1} / {post.media.length}
              </span>
              <button type="button" onClick={() => slideTo(Math.min(post.media.length - 1, slide + 1))} disabled={slide === post.media.length - 1} aria-label="›">
                ›
              </button>
            </div>
          )}
          <div className="kh-ig__side">
            {/* Text runs in <bdi> so English and Hebrew comments both line up with the page's reading side. */}
            <div className="kh-ig__head">
              <span className="kh-ig__avatar kh-ig__avatar--band" aria-hidden>
                <img src="/media/home/logo-header.svg" alt="" />
              </span>
              <span className="kh-ig__user">kolotband</span>
            </div>
            {post.caption && (
              <p className="kh-ig__caption">
                <bdi>{post.caption}</bdi>
              </p>
            )}
            {post.comments.length > 0 && (
              <ul className="kh-ig__comments">
                {post.comments.map((c, i) => (
                  <li key={i}>
                    <span className="kh-ig__avatar" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="9" r="4" />
                        <path d="M4.5 20c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
                      </svg>
                    </span>
                    <bdi>{c}</bdi>
                  </li>
                ))}
              </ul>
            )}
            <div className="kh-ig__foot">
              <div className="kh-ig__stats">
                {post.likes !== undefined && (
                  <span>
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.7 3.2 5 6.8 5c2 0 3.4 1.1 4.2 2.4h2C13.8 6.1 15.2 5 17.2 5c3.6 0 5.6 3.7 4.3 6.8C19.5 16.4 12 21 12 21z" />
                    </svg>
                    {post.likes.toLocaleString(lang === "he" ? "he-IL" : "en-US")} {t.likes}
                  </span>
                )}
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" />
                  </svg>
                  {post.commentsCount.toLocaleString(lang === "he" ? "he-IL" : "en-US")} {t.comments}
                </span>
              </div>
              <a className="kh-ig__link" href={post.permalink} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1" className="kh-ig__dot" />
                </svg>
                <span>{t.view}</span>
              </a>
            </div>
          </div>
        </div>
        <button type="button" className="kh-ig__nav kh-ig__nav--next" onClick={() => go(1)} aria-label={t.next}>
          {nextGlyph}
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function InstaTrack({ lang, posts }: { lang: Lang; posts: InstaPost[] }) {
  const { ref, step } = useTrack();
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <div className="kh-wrap kh-insta__nav">
        <Arrows lang={lang} onPrev={() => step(-1)} onNext={() => step(1)} />
      </div>
      <div ref={ref} className="kh-track kh-reels__track">
        {posts.map((p, i) => (
          <InstaCard key={p.id} post={p} lang={lang} onOpen={() => setOpen(i)} />
        ))}
      </div>
      {open !== null && <InstaLightbox lang={lang} posts={posts} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}
