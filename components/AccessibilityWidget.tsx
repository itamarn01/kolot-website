"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import { A11yIcon } from "./icons";

const KEY = "kolot-a11y-v1";
const FLAGS = ["contrast", "grayscale", "links", "readable", "no-motion", "cursor", "headings", "spacing"] as const;
type Flag = (typeof FLAGS)[number];
type State = { scale: number } & Record<Flag, boolean>;
const DEFAULT: State = { scale: 1, contrast: false, grayscale: false, links: false, readable: false, "no-motion": false, cursor: false, headings: false, spacing: false };

const T = {
  he: {
    open: "תפריט נגישות",
    title: "נגישות",
    close: "סגירה",
    size: "גודל טקסט",
    bigger: "הגדלת טקסט",
    smaller: "הקטנת טקסט",
    reset: "איפוס",
    statement: "הצהרת נגישות",
    statementHref: "/accessibility-statement/",
    flags: {
      contrast: "ניגודיות גבוהה",
      grayscale: "גווני אפור",
      links: "הדגשת קישורים",
      readable: "גופן קריא",
      "no-motion": "עצירת אנימציות",
      cursor: "סמן גדול",
      headings: "הדגשת כותרות",
      spacing: "ריווח טקסט",
    },
  },
  en: {
    open: "Accessibility menu",
    title: "Accessibility",
    close: "Close",
    size: "Text size",
    bigger: "Increase text",
    smaller: "Decrease text",
    reset: "Reset",
    statement: "Accessibility statement",
    statementHref: "/en/accessibility-statement/",
    flags: {
      contrast: "High contrast",
      grayscale: "Grayscale",
      links: "Highlight links",
      readable: "Readable font",
      "no-motion": "Stop animations",
      cursor: "Big cursor",
      headings: "Highlight headings",
      spacing: "Text spacing",
    },
  },
};

const ICONS: Record<Flag, string> = {
  contrast: "M12 2a10 10 0 1 0 0 20V2z",
  grayscale: "M4 4h16v16H4z",
  links: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  readable: "M5 20 11 4h2l6 16M8 13h8",
  "no-motion": "M8 5v14M16 5v14",
  cursor: "M5 3l14 8-6 1.5L16 20l-3 1-3-7.5L5 18z",
  headings: "M5 4v16M19 4v16M5 12h14",
  spacing: "M3 7h18M3 12h18M3 17h18",
};

function apply(s: State) {
  const h = document.documentElement;
  FLAGS.forEach((f) => h.classList.toggle(`a11y-${f}`, s[f]));
  h.style.setProperty("--a11y-scale", String(s.scale));
}

export default function AccessibilityWidget({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<State>(DEFAULT);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    apply(s);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  }, [s]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const setScale = (d: number) => setS((v) => ({ ...v, scale: Math.min(1.6, Math.max(0.9, Math.round((v.scale + d) * 10) / 10)) }));

  return (
    <>
      <button ref={btn} type="button" className="a11y-btn" aria-label={t.open} aria-expanded={open} aria-controls="a11y-panel" onClick={() => setOpen((v) => !v)}>
        <A11yIcon />
      </button>
      {open && (
        <div id="a11y-panel" ref={panel} className="a11y-panel" role="dialog" aria-label={t.title} lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
          <h2>
            {t.title}
            <button type="button" aria-label={t.close} onClick={() => setOpen(false)}>
              ×
            </button>
          </h2>
          <div className="a11y-grid">
            <div className="a11y-size">
              <button type="button" aria-label={t.smaller} onClick={() => setScale(-0.1)}>
                A-
              </button>
              <span aria-live="polite">
                {t.size} {Math.round(s.scale * 100)}%
              </span>
              <button type="button" aria-label={t.bigger} onClick={() => setScale(0.1)}>
                A+
              </button>
            </div>
            {FLAGS.map((f) => (
              <button key={f} type="button" className="a11y-opt" aria-pressed={s[f]} onClick={() => setS((v) => ({ ...v, [f]: !v[f] }))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d={ICONS[f]} fill={f === "contrast" || f === "cursor" ? "currentColor" : "none"} />
                </svg>
                {t.flags[f]}
              </button>
            ))}
          </div>
          <div className="a11y-foot">
            <a href={t.statementHref}>{t.statement}</a>
            <button type="button" onClick={() => setS(DEFAULT)}>
              {t.reset}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
