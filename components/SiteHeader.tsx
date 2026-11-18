"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { NAV, UI, type NavItem } from "@/lib/site";
import type { Lang } from "@/lib/types";
import { CaretDown, AngleDown, FlagIL, FlagUS, MenuLines } from "./icons";

function LangSwitch({ lang, alt, className = "lang-switch" }: { lang: Lang; alt: string; className?: string }) {
  const t = UI[lang];
  return (
    <a className={className} href={alt} hrefLang={lang === "he" ? "en" : "he"} lang={lang === "he" ? "en" : "he"} aria-label={t.langLabel}>
      <span>{t.langShort}</span>
      {lang === "he" ? <FlagUS /> : <FlagIL />}
    </a>
  );
}

export { LangSwitch };

export default function SiteHeader({ lang, alt }: { lang: Lang; alt: string }) {
  const t = UI[lang];
  const nav = NAV[lang];
  const pathname = usePathname();
  const home = lang === "he" ? "/" : "/en/";

  // ---------- desktop: trapezoid nav revealed by the 3-line icon
  const [deskOpen, setDeskOpen] = useState(false);
  const [deskSub, setDeskSub] = useState(false);
  const deskRef = useRef<HTMLElement>(null);
  const deskTl = useRef<gsap.core.Timeline | null>(null);

  // ---------- mobile: full overlay (same GSAP timeline as the WP site)
  const [mobOpen, setMobOpen] = useState(false);
  const [mobSub, setMobSub] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobTl = useRef<gsap.core.Timeline | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desk = deskRef.current;
    const ov = overlayRef.current;
    if (!desk || !ov) return;
    const ctx = gsap.context(() => {
      const items = desk.querySelectorAll(":scope > ul > li");
      gsap.set(items, { y: -30, opacity: 0, rotateX: -60 });
      deskTl.current = gsap
        .timeline({ paused: true })
        .to(items, { y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: { each: 0.07, from: "start" }, ease: "power3.out" });

      const list = ov.querySelectorAll(".list-item");
      gsap.set(list, { y: 30, opacity: 0 });
      gsap.set(ov, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
      mobTl.current = gsap
        .timeline({ paused: true, onReverseComplete: () => gsap.set(ov, { visibility: "hidden" }) })
        .set(ov, { visibility: "visible" })
        .to(ov, { duration: 1.1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "power1.inOut" })
        .to(list, { duration: 0.8, y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" }, "-=0.7");
    });
    return () => ctx.revert();
  }, []);

  const toggleDesk = useCallback((open: boolean) => {
    setDeskOpen(open);
    if (!open) setDeskSub(false);
    if (open) deskTl.current?.play();
    else deskTl.current?.reverse();
  }, []);

  const toggleMob = useCallback((open: boolean) => {
    setMobOpen(open);
    if (open) mobTl.current?.play();
    else {
      mobTl.current?.reverse();
      setMobSub(false);
    }
  }, []);

  // close menus on navigation & Escape
  useEffect(() => {
    toggleDesk(false);
    toggleMob(false);
  }, [pathname, toggleDesk, toggleMob]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mobOpen) {
        toggleMob(false);
        burgerRef.current?.focus();
      }
      if (deskOpen) toggleDesk(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobOpen, deskOpen, toggleMob, toggleDesk]);

  const isCurrent = (href: string) => {
    const clean = href.split("#")[0];
    return clean !== "" && clean !== home && decodeURI(pathname) === clean;
  };

  const renderDesk = (item: NavItem) =>
    item.children ? (
      <li key={item.label} onMouseLeave={() => setDeskSub(false)}>
        <button
          type="button"
          className="tz"
          aria-expanded={deskSub}
          aria-controls="desk-sub"
          onClick={() => setDeskSub((v) => !v)}
          onMouseEnter={() => setDeskSub(true)}
          tabIndex={deskOpen ? 0 : -1}
        >
          <CaretDown />
          <span>{item.label}</span>
        </button>
        <ul id="desk-sub" className={`submenu${deskSub ? " is-open" : ""}`}>
          {item.children.map((c) => (
            <li key={c.href}>
              <a className={`tz${isCurrent(c.href) ? " is-current" : ""}`} href={c.href} tabIndex={deskOpen ? 0 : -1} aria-current={isCurrent(c.href) ? "page" : undefined}>
                <span>{c.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </li>
    ) : (
      <li key={item.label}>
        <a className={`tz${item.highlight ? " tz--gold" : ""}${isCurrent(item.href) ? " is-current" : ""}`} href={item.href} tabIndex={deskOpen ? 0 : -1} onClick={() => toggleDesk(false)}>
          <span>{item.label}</span>
        </a>
      </li>
    );

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="site-header__logo" href={home} aria-label={lang === "he" ? "קולות – לדף הבית" : "KOLOT – home"}>
        <img src="/media/kolot-logo-03.svg" alt="KOLOT" width={240} height={144} />
      </a>

      <button
        type="button"
        className="burger-desk"
        aria-label={deskOpen ? t.closeMenu : t.openMenu}
        aria-expanded={deskOpen}
        aria-controls="desk-nav"
        onClick={() => toggleDesk(!deskOpen)}
      >
        <MenuLines />
      </button>

      <nav id="desk-nav" ref={deskRef} className={`desk-nav${deskOpen ? " is-open" : ""}`} aria-label={t.menu} style={{ perspective: 600 }}>
        <ul>{nav.map(renderDesk)}</ul>
      </nav>

      <LangSwitch lang={lang} alt={alt} />

      {/* ---------- mobile ---------- */}
      <button
        ref={burgerRef}
        type="button"
        className={`burger${mobOpen ? " is-active" : ""}`}
        aria-label={mobOpen ? t.closeMenu : t.openMenu}
        aria-expanded={mobOpen}
        aria-controls="mob-overlay"
        onClick={() => toggleMob(!mobOpen)}
      >
        <span />
      </button>

      <div id="mob-overlay" ref={overlayRef} className="mob-overlay" aria-hidden={!mobOpen}>
        <nav aria-label={t.menu}>
          <ul>
            {nav.map((item) =>
              item.children ? (
                <li key={item.label} className="list-item">
                  <button type="button" className="tz" aria-expanded={mobSub} onClick={() => setMobSub((v) => !v)} tabIndex={mobOpen ? 0 : -1}>
                    <span>{item.label}</span>
                    <AngleDown />
                  </button>
                  <ul className={`submenu${mobSub ? " is-open" : ""}`}>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <a className="tz" href={c.href} tabIndex={mobOpen ? 0 : -1}>
                          <span>{c.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label} className="list-item">
                  <a className={`tz${item.highlight ? " tz--gold" : ""}`} href={item.href} onClick={() => toggleMob(false)} tabIndex={mobOpen ? 0 : -1}>
                    <span>{item.label}</span>
                  </a>
                </li>
              ),
            )}
            <li className="list-item">
              <LangSwitch lang={lang} alt={alt} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
