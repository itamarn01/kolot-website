"use client";

import { useState, useLayoutEffect, useRef } from "react";
import type { Section } from "@/lib/types";
import { Inst } from "./Packages";

type Full = Extract<Section, { type: "packagesFull" }>;
const fmt = (n: number) => "₪" + new Intl.NumberFormat("en-US").format(n);

/** Full price list (packages / ppackages / energy-packages pages). */
export default function PackagesFull({ section, lang }: { section: Full; lang: "he" | "en" }) {
  const { packages } = section;
  const [sel, setSel] = useState<number | null>(null);
  const [bump, setBump] = useState(0);
  const base = section.calculatorBase ?? 24500;
  const ref = useRef<HTMLElement>(null);

  // Same as the WP "adjustCenterHeight" script: middle column = average of the two outer ones
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const cols = el.querySelectorAll<HTMLElement>(".pk-full__box");
      if (cols.length !== 3) return;
      cols[1].style.minHeight = "";
      if (window.innerWidth <= 900) return;
      const a = cols[0].offsetHeight;
      const c = cols[2].offsetHeight;
      cols[1].style.minHeight = `${Math.max(cols[1].offsetHeight, (a + c) / 2)}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section ref={ref} className="pk-full" aria-label={lang === "he" ? "החבילות שלנו" : "Our packages"}>
      {packages.map((p, k) => {
        const price = p.calculator ? fmt(base + (sel !== null ? p.calculator[sel].value : 0)) : p.price;
        return (
          <article key={k} className={`pk-full__col c-${p.color}`} data-reveal="up" style={{ ["--reveal-delay" as string]: `${k * 0.15}s` }}>
            <div className="pk-full__logo">
              <img src={p.logo} alt={p.logo.split("/").pop()?.replace(/(-svg-1)?\.svg$/, "").toUpperCase()} />
            </div>
            <div className="pk-full__box">
              <div className="pk-full__desc" dangerouslySetInnerHTML={{ __html: p.desc }} />
              <h2 className="pk-full__list-title" dangerouslySetInnerHTML={{ __html: p.listTitle }} />
              <div className="pk-full__list" dangerouslySetInnerHTML={{ __html: p.list }} />
              <ul className="inst-row" style={{ listStyle: "none", margin: "14px 0 0", padding: 0 }}>
                {p.instruments.map((it, i) => (
                  <Inst key={i} it={it} />
                ))}
              </ul>
              {p.extraTitle && <span className="pk-extra-title" dangerouslySetInnerHTML={{ __html: p.extraTitle }} />}
              {p.extras && (
                <ul className="inst-row" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {p.extras.map((it, i) => (
                    <Inst key={i} it={it} />
                  ))}
                </ul>
              )}
              {p.calculator && (
                <fieldset className="calc" style={{ border: 0, padding: 0, margin: "8px 0 0" }}>
                  <legend className="visually-hidden">{lang === "he" ? "בחירת הרכב קבלת פנים" : "Choose a reception ensemble"}</legend>
                  {p.calculator.map((o, i) => (
                    <label key={o.label}>
                      <input
                        type="checkbox"
                        checked={sel === i}
                        onChange={(e) => {
                          setSel(e.target.checked ? i : null);
                          setBump((b) => b + 1);
                        }}
                      />
                      <img src={o.icon} alt="" />
                      <span>{o.label}</span>
                      <b>{sel === i ? section.includedLabel : "+" + fmt(o.value)}</b>
                    </label>
                  ))}
                </fieldset>
              )}
            </div>
            <div className="pk-full__price">
              <span key={p.calculator ? bump : 0} className={p.calculator && bump ? "is-bump" : ""} aria-live={p.calculator ? "polite" : undefined}>
                {price}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
