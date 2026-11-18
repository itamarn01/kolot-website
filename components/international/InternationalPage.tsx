"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Lang } from "@/lib/types";
import { COPY, DESTINATIONS, HERO_IMAGES, HERO_VIDEO, LUXURY, PARTNERS, type Story } from "@/lib/international";
import { InstagramIcon, PlayIcon } from "../icons";
import "./international.css";

gsap.registerPlugin(ScrollTrigger);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Video when the MP4 exists, otherwise the poster still; plays only while visible. */
function StoryMedia({ story, lang, eager }: { story: Story; lang: Lang; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className="st-media">
      {story.video ? (
        <video ref={ref} src={story.video} poster={story.poster} muted loop playsInline preload="metadata" aria-label={story.title[lang]} />
      ) : (
        <img src={story.poster} alt="" loading={eager ? "eager" : "lazy"} />
      )}
      <a className="st-ig" href={story.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${COPY[lang].watch}: ${story.title[lang]}`}>
        {story.video ? <InstagramIcon /> : <PlayIcon />}
        <span>{COPY[lang].watch}</span>
      </a>
    </div>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(value) + suffix;
      return;
    }
    const obj = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(obj, { n: value, duration: 2.2, ease: "power3.out", onUpdate: () => (el.textContent = fmt(obj.n) + suffix) }),
    });
    return () => st.kill();
  }, [value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function InternationalPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const root = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);

  // hero still-image crossfade (only when there is no hero video yet)
  useEffect(() => {
    if (HERO_VIDEO) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 6500);
    return () => clearInterval(id);
  }, []);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");
    const rtl = lang === "he";
    const ctx = gsap.context(() => {
      if (reduce) return;

      // ---- hero: word-by-word title, then the rest
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".ih-eyebrow", { y: 20, opacity: 0, duration: 0.8 })
        .from(".ih-word", { yPercent: 110, rotate: rtl ? -4 : 4, duration: 1.1, stagger: 0.07 }, "-=0.4")
        .from(".ih-sub", { y: 24, opacity: 0, duration: 0.9 }, "-=0.6")
        .from(".ih-cta > *", { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.5")
        .from(".ih-scroll", { opacity: 0, duration: 0.8 }, "-=0.2");
      // hero parallax on scroll
      gsap.to(".ih-bg", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".ih", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".ih-content", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: ".ih", start: "top top", end: "bottom top", scrub: true } });

      // ---- generic reveals
      gsap.utils.toArray<HTMLElement>(".i-reveal").forEach((node) => {
        gsap.from(node, { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: node, start: "top 88%" } });
      });
      gsap.utils.toArray<HTMLElement>(".i-stagger").forEach((group) => {
        gsap.from(group.children, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".i-line").forEach((line) => {
        gsap.from(line, { scaleX: 0, transformOrigin: rtl ? "right center" : "left center", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: line, start: "top 90%" } });
      });

      // ---- destinations: pinned horizontal scroll on large screens
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = el.querySelector<HTMLElement>(".dest-track");
        const section = el.querySelector<HTMLElement>(".dest");
        if (!track || !section) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => (rtl ? distance() : -distance()),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => gsap.set(".dest-progress span", { scaleX: self.progress }),
          },
        });
        // cards drift slightly for depth
        gsap.utils.toArray<HTMLElement>(".dest-card .st-media img, .dest-card .st-media video").forEach((m) => {
          gsap.fromTo(m, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        });
      });

      // ---- luxury: parallax columns
      gsap.utils.toArray<HTMLElement>(".lux-media").forEach((m, i) => {
        gsap.fromTo(m, { yPercent: i % 2 ? 12 : -4 }, { yPercent: i % 2 ? -8 : 6, ease: "none", scrollTrigger: { trigger: ".lux", start: "top bottom", end: "bottom top", scrub: true } });
      });

      // ---- process: the line draws as you scroll
      gsap.fromTo(
        ".proc-line span",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".proc-list", start: "top 70%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>(".proc-step").forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: "top 65%", onEnter: () => step.classList.add("is-active"), onLeaveBack: () => step.classList.remove("is-active") });
      });

      // ---- quote: words light up
      gsap.fromTo(
        ".quote-word",
        { opacity: 0.15 },
        { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".quote", start: "top 75%", end: "bottom 55%", scrub: true } },
      );
    }, el);
    // fonts/images change layout → recalc pins
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [lang]);

  const words = (s: string) =>
    s.split(" ").map((w, i) => (
      <span key={i}>
        <span className="ih-mask">
          <span className="ih-word">{w}</span>
        </span>{" "}
      </span>
    ));

  return (
    <main id="main" ref={root} className="intl" lang={lang} dir={lang === "en" ? "ltr" : "rtl"}>
      {/* ------------------------------------------------ HERO */}
      <section className="ih" aria-labelledby="ih-title">
        <div className="ih-bg" aria-hidden>
          {HERO_VIDEO ? (
            <video src={HERO_VIDEO} poster={HERO_IMAGES[0]} autoPlay muted loop playsInline />
          ) : (
            HERO_IMAGES.map((src, i) => <div key={src} className={`ih-slide${i === slide ? " is-on" : ""}`} style={{ backgroundImage: `url("${src}")` }} />)
          )}
        </div>
        <div className="ih-shade" aria-hidden />
        <div className="grain" aria-hidden />
        <div className="ih-content">
          <p className="ih-eyebrow">
            <span className="ih-dot" aria-hidden />
            {t.eyebrow}
          </p>
          <h1 id="ih-title" className="ih-title">
            {t.heroTitle.map((line, i) => (
              <span key={i} className={`ih-line${i === 1 ? " ih-line--accent" : ""}`}>
                {words(line)}
              </span>
            ))}
          </h1>
          <p className="ih-sub">{t.heroSub}</p>
          <div className="ih-cta">
            <a className="ibtn ibtn--gold" href="#contact-us">
              <span>{t.ctaPlan}</span>
            </a>
            <a className="ibtn ibtn--ghost" href="#destinations">
              <PlayIcon />
              <span>{t.ctaWatch}</span>
            </a>
          </div>
        </div>
        <a className="ih-scroll" href="#stats" aria-label={t.scroll}>
          <span>{t.scroll}</span>
          <i aria-hidden />
        </a>
      </section>

      {/* ------------------------------------------------ STATS */}
      <section id="stats" className="stats" aria-label="KOLOT in numbers">
        <div className="stats-grid i-stagger">
          {t.stats.map((s) => (
            <div key={s.label} className="stat">
              <strong>
                <Counter value={s.value} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="places i-reveal" aria-label="Destinations">
          {DESTINATIONS.map((d) => (
            <span key={d.key}>{d.place[lang]}</span>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ DESTINATIONS (pinned horizontal) */}
      <section id="destinations" className="dest" aria-labelledby="dest-title">
        <div className="dest-head">
          <p className="i-eyebrow">{t.destEyebrow}</p>
          <h2 id="dest-title" className="i-title">
            {t.destTitle}
          </h2>
          <p className="dest-hint" aria-hidden>
            {t.destHint} <span>→</span>
          </p>
          <div className="dest-progress" aria-hidden>
            <span />
          </div>
        </div>
        <div className="dest-track">
          {DESTINATIONS.map((d, i) => (
            <article key={d.key} className="dest-card">
              <StoryMedia story={d} lang={lang} eager={i === 0} />
              <div className="dest-info">
                <span className="dest-num">0{i + 1}</span>
                <h3 className="dest-place">{d.place[lang]}</h3>
                <p className="dest-country">{d.country[lang]}</p>
                <p className="dest-title">{d.title[lang]}</p>
                <p className="dest-text">{d.text[lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ EXPERIENCE */}
      <section className="exp" aria-labelledby="exp-title">
        <header className="i-head i-reveal">
          <p className="i-eyebrow">{t.expEyebrow}</p>
          <h2 id="exp-title" className="i-title">
            {t.expTitle}
          </h2>
          <div className="i-line" aria-hidden />
        </header>
        <div className="exp-grid i-stagger">
          {t.experience.map((e, i) => (
            <article key={e.title} className="exp-card">
              <span className="exp-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ LUXURY */}
      <section className="lux" aria-labelledby="lux-title">
        <div className="lux-text i-reveal">
          <p className="i-eyebrow i-eyebrow--gold">{t.luxEyebrow}</p>
          <h2 id="lux-title" className="i-title">
            {t.luxTitle}
          </h2>
          <p>{t.luxText}</p>
          <a className="ibtn ibtn--gold" href="#contact-us">
            <span>{t.ctaPlan}</span>
          </a>
        </div>
        <div className="lux-gallery">
          {LUXURY.map((s, i) => (
            <figure key={s.key} className={`lux-media lux-media--${i}`}>
              <StoryMedia story={s} lang={lang} />
              <figcaption>
                <strong>{s.place[lang]}</strong>
                <span>{s.title[lang]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ PARTNERS */}
      <section className="partners" aria-label={t.partnersTitle}>
        <p className="i-eyebrow i-reveal">{t.partnersTitle}</p>
        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {Array.from({ length: 4 }).flatMap((_, k) =>
              PARTNERS.concat(DESTINATIONS.map((d) => d.place.en.toUpperCase())).map((p, j) => (
                <span key={`${k}-${j}`}>
                  {p}
                  <i>✦</i>
                </span>
              )),
            )}
          </div>
        </div>
        <ul className="visually-hidden">
          {PARTNERS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ PROCESS */}
      <section className="proc" aria-labelledby="proc-title">
        <header className="i-head i-reveal">
          <p className="i-eyebrow">{t.processEyebrow}</p>
          <h2 id="proc-title" className="i-title">
            {t.processTitle}
          </h2>
        </header>
        <div className="proc-list">
          <div className="proc-line" aria-hidden>
            <span />
          </div>
          <ol>
          {t.process.map((p, i) => (
            <li key={p.title} className="proc-step">
              <span className="proc-dot">{i + 1}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ QUOTE */}
      <section className="quote" aria-label="Testimonial">
        <span className="quote-mark" aria-hidden>
          “
        </span>
        <blockquote dir="auto">
          <p>
            {t.quote.split(" ").map((w, i) => (
              <span key={i} className="quote-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <footer>— {t.quoteBy}</footer>
        </blockquote>
      </section>

      {/* ------------------------------------------------ FINAL CTA */}
      <section className="final" aria-labelledby="final-title">
        <div className="final-bg" aria-hidden style={{ backgroundImage: `url("${HERO_IMAGES[2]}")` }} />
        <div className="grain" aria-hidden />
        <div className="final-inner i-reveal">
          <h2 id="final-title" className="i-title">
            {t.finalTitle}
          </h2>
          <p>{t.finalText}</p>
          <a className="ibtn ibtn--gold ibtn--lg" href="#contact-us">
            <span>{t.finalCta}</span>
          </a>
        </div>
      </section>
    </main>
  );
}
