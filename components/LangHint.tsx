"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";

/**
 * A small pill that suggests the other language for 5 seconds, then fades away. It never redirects.
 *  - Hebrew page, browser with no Hebrew in its languages → "View this page in English?"
 *  - English page, browser whose first language is Hebrew → "לעבור לעברית?"
 * Many Israelis run their phone in English but still list Hebrew, so any Hebrew in the list keeps them in Hebrew.
 * Only on the page the visitor lands on: never after moving around the site, and never again for
 * someone who picked a language themselves (any language link they click is remembered).
 * Shown once a week at most; hovering or focusing it keeps it on screen.
 */

const KEY = "kolot_lang_hint";
const CHOSE = "kolot_lang_chosen"; // the visitor switched language themselves: never suggest again
const SEEN = "kolot_seen"; // this tab already showed a page of the site
const WEEK = 7 * 24 * 60 * 60 * 1000;
const SHOW_MS = 5000;

const isHe = (l: string) => /^(he|iw)\b/i.test(l);

/** Worked out once per page load (effects can run twice), then the tab is marked as seen. */
let landedCache: boolean | null = null;
function landedNow(): boolean {
  if (landedCache !== null) return landedCache;
  // the first page of the visit, and not reached from another page of the site
  const internal = !!document.referrer && new URL(document.referrer).host === location.host;
  landedCache = !sessionStorage.getItem(SEEN) && !internal;
  sessionStorage.setItem(SEEN, "1");
  return landedCache;
}

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

  // A click on any language link (header, menu, this pill) means they chose: remember it.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[hreflang]");
      if (!a) return;
      try {
        localStorage.setItem(CHOSE, "1");
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    // a couple's /r/<id> page is already in the language of their own review
    if (/^\/(en\/)?r\//.test(location.pathname)) return;
    try {
      if (!landedNow() || localStorage.getItem(CHOSE)) return;
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
