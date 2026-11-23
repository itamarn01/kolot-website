"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import YouTubeModal from "@/components/YouTubeModal";
import LeadForm from "@/components/LeadForm";
import type { Lang } from "@/lib/types";
import type { InstaPost } from "@/lib/instagram";
import { COPY, type Clip, type Review } from "./copy";

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

/* ------------------------------------------------- inquiry (lead form) */

const OPEN_EVENT = "kolot:inquire";

/** Any primary CTA. Opens the multi-step lead form (components/LeadForm) in a dialog. */
export function InquireButton({ children, className = "kh-btn kh-btn--primary" }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {children}
    </button>
  );
}

export function InquiryDialog({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const open = () => {
      setLoaded(true);
      ref.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, open);
    if (location.hash === "#contact-us") open();
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);
  return (
    <dialog ref={ref} className="kh-dialog" aria-label={COPY[lang].formTitle} onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="kh-dialog__box">
        <button type="button" className="kh-dialog__close" onClick={() => ref.current?.close()} aria-label={COPY[lang].close}>
          ×
        </button>
        <div className="kh-dialog__scroll">{loaded && <LeadForm lang={lang} />}</div>
      </div>
    </dialog>
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

export function MobileMenu({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <>
      <button type="button" className={`kh-burger${open ? " is-open" : ""}`} aria-expanded={open} aria-controls="kh-menu" aria-label={open ? c.close : c.menu} onClick={() => setOpen(!open)}>
        <span />
        <span />
      </button>
      <nav id="kh-menu" className={`kh-menu${open ? " is-open" : ""}`} aria-label={c.menu} hidden={!open}>
        <ul>
          {c.nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
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
      const src = `/media/showreel/showreel-${mobile ? "mobile" : "desktop"}-color.mp4`;
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

export function ReviewsCarousel({ lang, reviews }: { lang: Lang; reviews: Review[] }) {
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
        {reviews.map((r, i) => (
          <figure key={i} className="kh-review" lang={r.lang} dir={r.lang === "he" ? "rtl" : "ltr"}>
            <div>
              <div className="kh-label kh-accent" aria-label="5/5">
                ★★★★★
              </div>
              <blockquote>“{r.quote}”</blockquote>
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
            <div className={`kh-fs${open ? " is-on" : ""}`} aria-hidden={!open}>
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

function InstaCard({ post, lang }: { post: InstaPost; lang: Lang }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Desktop: a reel previews silently while hovered. Every card opens the original post on Instagram.
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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.caption ? `Instagram: ${post.caption.slice(0, 80)}` : "Instagram"}
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
      <span className="visually-hidden">{lang === "he" ? "(נפתח באינסטגרם)" : "(opens on Instagram)"}</span>
    </a>
  );
}

export function InstaTrack({ lang, posts }: { lang: Lang; posts: InstaPost[] }) {
  const { ref, step } = useTrack();
  return (
    <>
      <div className="kh-wrap kh-insta__nav">
        <Arrows lang={lang} onPrev={() => step(-1)} onNext={() => step(1)} />
      </div>
      <div ref={ref} className="kh-track kh-reels__track">
        {posts.map((p) => (
          <InstaCard key={p.id} post={p} lang={lang} />
        ))}
      </div>
    </>
  );
}
