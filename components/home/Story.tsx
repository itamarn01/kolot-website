"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/types";
import { STORY, STORY_PHOTOS, type StoryBlock } from "./copy";

/** **bright** and ==yellow== inside a line of story text. */
function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("==")) return <strong key={i} className="kh-accent">{part.slice(2, -2)}</strong>;
    return part;
  });
}

function Block({ b }: { b: StoryBlock }) {
  if ("h" in b) return <h3 className="kh-story__sub">{b.h}</h3>;
  if ("li" in b)
    return (
      <ul className="kh-story__list">
        {b.li.map((x, i) => (
          <li key={i}>{rich(x)}</li>
        ))}
      </ul>
    );
  return <p>{rich(b.p)}</p>;
}

function Heart() {
  return (
    <svg className="kh-story__heart" width="30" height="28" viewBox="0 0 24 22" aria-hidden>
      <path d="M12 21.6 10.3 20C4.2 14.5 0 10.8 0 6.2 0 2.7 2.7 0 6.2 0c2 0 3.9.9 5.1 2.4h1.4C14 .9 15.9 0 17.8 0 21.3 0 24 2.7 24 6.2c0 4.6-4.2 8.3-10.3 13.8L12 21.6z" fill="currentColor" />
    </svg>
  );
}

/**
 * "Our story": the band's text in one block beside two tilted photos.
 * The text starts folded with a fade and opens in place. All of it is in the page for search engines.
 * Photos straighten and turn to colour on hover; on touch screens they turn to colour once in view.
 */
export default function Story({ lang }: { lang: Lang }) {
  const s = STORY[lang];
  const id = useId();
  const sec = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState<number | null>(null);

  // Measure the full height so the fold can animate open and shut.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setFull(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.firstElementChild as Element);
    return () => ro.disconnect();
  }, []);

  // Touch screens have no hover: bring the colour in when the photos scroll into view.
  useEffect(() => {
    const el = sec.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-seen");
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el.querySelector(".kh-story__photos") as Element);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    if (open) sec.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(!open);
  };

  return (
    <section className={`kh-sec kh-story${open ? " is-open" : ""}`} id="story" ref={sec}>
      <div className="kh-wrap kh-story__grid">
        <div className="kh-story__photos">
          <figure className="kh-story__photo kh-story__photo--a">
            <img src={STORY_PHOTOS.early} alt={s.alts[0]} width={1100} height={734} loading="lazy" />
            <figcaption className="kh-label">{s.tags[0]}</figcaption>
          </figure>
          <figure className="kh-story__photo kh-story__photo--b">
            <img src={STORY_PHOTOS.today} alt={s.alts[1]} width={1100} height={733} loading="lazy" />
            <figcaption className="kh-label">{s.tags[1]}</figcaption>
          </figure>
        </div>

        <div className="kh-story__text">
          <p className="kh-label kh-accent">{s.eyebrow}</p>
          <h2 className="kh-display-l kh-title">{s.title}</h2>
          <div
            className="kh-story__fold"
            id={id}
            ref={body}
            style={open && full ? { maxHeight: full } : undefined}
          >
            <div className="kh-story__body">
              {s.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}
              <div className="kh-story__sign">
                <p>{s.signoff}</p>
                <p className="kh-story__name">
                  <span className="kh-display-m">{s.sign}</span>
                  <Heart />
                </p>
              </div>
            </div>
          </div>
          <button type="button" className="kh-btn kh-btn--outline kh-story__more" aria-expanded={open} aria-controls={id} onClick={toggle}>
            {open ? s.less : s.more}
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
