"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";

/**
 * A small pill that suggests the other language for 5 seconds, then fades away. It never redirects.
 *  - Hebrew page, browser with no Hebrew in its languages → "View this page in English?"
 *  - English page, browser whose first language is Hebrew → "לעבור לעברית?"
 * Many Israelis run their phone in English but still list Hebrew, so any Hebrew in the list keeps them in Hebrew.
 * Shown once a week at most; hovering or focusing it keeps it on screen.
 */

const KEY = "kolot_lang_hint";
const WEEK = 7 * 24 * 60 * 60 * 1000;
const SHOW_MS = 5000;

const isHe = (l: string) => /^(he|iw)\b/i.test(l);

function otherVersion(target: Lang): string {
  const link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang^="${target}"]`);
  if (link?.href) {
    try {
      const u = new URL(link.href);
      return u.pathname + location.search + u.hash;
    } catch {
      /* fall through */
    }
  }
  return target === "en" ? "/en/" : "/";
}

export default function LangHint({ lang }: { lang: Lang }) {
  const [target, setTarget] = useState<Lang | null>(null);
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden");
  const hold = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(KEY)) || 0;
      if (Date.now() - last < WEEK) return;
    } catch {
      return; // no storage: skip rather than show it on every page
    }
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
    let want: Lang | null = null;
    if (lang === "he" && !langs.some(isHe)) want = "en";
    if (lang === "en" && isHe(langs[0] || "")) want = "he";
    if (!want) return;

    const start = setTimeout(() => {
      setTarget(want);
      setPhase("in");
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }, 1200);
    return () => clearTimeout(start);
  }, [lang]);

  const scheduleOut = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!hold.current) setPhase("out");
    }, SHOW_MS);
  };

  useEffect(() => {
    if (phase !== "in") return;
    scheduleOut();
    return () => clearTimeout(timer.current);
  }, [phase]);

  if (!target || phase === "hidden") return null;

  const keep = () => {
    hold.current = true;
    clearTimeout(timer.current);
  };
  const release = () => {
    hold.current = false;
    scheduleOut();
  };

  return (
    <div
      className={`lang-hint lang-hint--${phase}`}
      role="status"
      dir={target === "en" ? "ltr" : "rtl"}
      lang={target}
      onMouseEnter={keep}
      onMouseLeave={release}
      onFocus={keep}
      onBlur={release}
      onAnimationEnd={() => phase === "out" && setPhase("hidden")}
    >
      <a href={otherVersion(target)} hrefLang={target}>
        {target === "en" ? "View this page in English" : "לעבור לעברית"}
        <span aria-hidden> {target === "en" ? "→" : "←"}</span>
      </a>
      <button type="button" aria-label={target === "en" ? "Close" : "סגירה"} onClick={() => setPhase("out")}>
        ×
      </button>
    </div>
  );
}
