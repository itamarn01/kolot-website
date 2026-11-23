"use client";

import { useEffect, useRef } from "react";

/**
 * Homepage motion, all in one place:
 *  1. Section headings rise in line by line from behind a mask.
 *  2. Numbers in the hero line and the "why us" cards count up the first time they show.
 *  3. Background videos and photos scroll a little slower than the page (parallax).
 *  4. Cards in the horizontal tracks and line-up rows come in one after another.
 *  5. A thin yellow scroll-progress line along the top.
 *
 * Everything works by adding data-* attributes and CSS variables to the server-rendered markup,
 * so React never sees a changed class. Visitors who ask for reduced motion only get the progress line.
 */

const HEADINGS = ".kh-sec h2.kh-display-l, .kh-statement h2, .kh-ww h2, .kh-benefit h3";
const COUNTS = ".kh-hero__meta p, .kh-benefit h3, .kh-benefit p";
const STAGGER = ".kh-track, .kh-lineup__list";
const PARALLAX = ".kh-statement__clips, .kh-ww__img";

function splitWords(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parts = (node.textContent ?? "").split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const outer = document.createElement("span");
      outer.className = "kh-w";
      const inner = document.createElement("span");
      inner.className = "kh-w__i";
      inner.textContent = part;
      outer.append(inner);
      frag.append(outer);
    }
    node.replaceWith(frag);
  }
}

/** Gives every word its line number, so whole lines rise together. */
function numberLines(el: HTMLElement) {
  let line = -1;
  let top = -Infinity;
  el.querySelectorAll<HTMLElement>(".kh-w").forEach((w) => {
    const t = w.offsetTop;
    if (t > top + 4) {
      line++;
      top = t;
    }
    w.style.setProperty("--line", String(line));
  });
}

function wrapNumbers(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const text = node.textContent ?? "";
    if (!/\d{2,}/.test(text)) continue;
    const frag = document.createDocumentFragment();
    text.split(/(\d{2,})/).forEach((part, i) => {
      if (!part) return;
      if (i % 2) {
        const s = document.createElement("span");
        s.className = "kh-count";
        s.dataset.to = part;
        s.textContent = part;
        frag.append(s);
      } else frag.append(part);
    });
    node.replaceWith(frag);
  }
}

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.to);
  if (!to) return;
  // Keep the final width so the line doesn't jiggle while the digits change.
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  const dur = 1600;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = String(p < 1 ? Math.round(to * (1 - Math.pow(2, -10 * p))) : to);
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = "0";
  requestAnimationFrame(tick);
}

export default function Motion() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".kh");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // 5. Scroll progress (kept even with reduced motion: it doesn't move anything on its own).
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.current?.style.setProperty("--p", String(max > 0 ? scrollY / max : 0));
        if (!reduced) parallax();
      });
    };

    // 3. Parallax: hero loop drifts down as the hero scrolls away; the other backgrounds move against the page.
    const hero = root.querySelector<HTMLElement>(".kh-hero__video");
    const layers = Array.from(root.querySelectorAll<HTMLElement>(PARALLAX));
    function parallax() {
      if (hero && scrollY < innerHeight * 1.5) hero.style.setProperty("--py", `${Math.round(scrollY * 0.35)}px`);
      for (const el of layers) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) continue;
        const off = (box.top + box.height / 2 - innerHeight / 2) / (innerHeight + box.height);
        el.style.setProperty("--py", `${(off * 16).toFixed(2)}%`);
      }
    }

    if (!reduced) {
      root.dataset.motion = "on";
      [hero, ...layers].forEach((el) => el?.setAttribute("data-parallax", ""));

      // 1. Headings.
      const heads = Array.from(root.querySelectorAll<HTMLElement>(HEADINGS)).filter((h) => !h.closest(".kf"));
      heads.forEach((h) => {
        if (!h.hasAttribute("data-split")) splitWords(h);
        h.setAttribute("data-split", "");
      });
      const renumber = () => heads.forEach(numberLines);
      renumber();
      document.fonts?.ready.then(renumber);
      addEventListener("resize", renumber);
      cleanups.push(() => removeEventListener("resize", renumber));

      // 2. Numbers.
      root.querySelectorAll<HTMLElement>(COUNTS).forEach((el) => {
        if (!el.querySelector(".kh-count")) wrapNumbers(el);
      });
      const counts = Array.from(root.querySelectorAll<HTMLElement>(".kh-count"));

      // 4. Staggered children.
      const groups = Array.from(root.querySelectorAll<HTMLElement>(STAGGER));
      groups.forEach((g) => {
        g.setAttribute("data-stagger", "");
        Array.from(g.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--n", String(Math.min(i, 8))));
      });

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            io.unobserve(el);
            if (el.classList.contains("kh-count")) countUp(el);
            else el.setAttribute("data-in", "");
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      [...heads, ...groups, ...counts].forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());

    }

    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    cleanups.push(() => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  return <div ref={bar} className="kh-scrollbar" aria-hidden />;
}
