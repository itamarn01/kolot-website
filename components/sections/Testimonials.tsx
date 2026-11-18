"use client";

import { useState } from "react";
import type { Lang, Testimonial } from "@/lib/types";
import { UI } from "@/lib/site";
import { AngleDown } from "../icons";

const PAGE = 4;

function Card({ t, isNew }: { t: Testimonial; isNew: boolean }) {
  return (
    <figure className={`review${isNew ? " is-new" : ""}`} style={{ margin: 0 }}>
      <blockquote className="review__text" dir="auto" style={{ margin: 0 }}>
        {t.text}
      </blockquote>
      <figcaption>
        <p className="review__sign" dir="auto">{t.signoff}</p>
        <p className="review__sign" dir="auto" style={{ marginBottom: 0 }}>{t.name}</p>
        <p className="review__meta">
          <span>{t.date},</span>
          <span>{t.venue}</span>
        </p>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({ items, lang }: { items: Testimonial[]; lang: Lang }) {
  const [count, setCount] = useState(PAGE);
  const shown = items.slice(0, count);
  // the WP loop grid lays items out row by row in two masonry columns
  const cols = [shown.filter((_, i) => i % 2 === 0), shown.filter((_, i) => i % 2 === 1)];
  return (
    <section className="section testimonials" aria-live="polite">
      <div className="testimonials__grid">
        {cols.map((col, c) => (
          <div key={c} className="testimonials__col">
            {col.map((t) => {
              const idx = items.indexOf(t);
              return (
                <div key={idx} data-reveal={idx < PAGE ? "up" : undefined} style={{ ["--reveal-delay" as string]: `${c * 0.12}s` }}>
                  <Card t={t} isNew={idx >= PAGE} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {count < items.length && (
        <div className="testimonials__more">
          <button type="button" className="btn" onClick={() => setCount((n) => n + PAGE)}>
            <AngleDown />
            <span>{UI[lang].moreReviews}</span>
          </button>
        </div>
      )}
    </section>
  );
}
