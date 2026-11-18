"use client";

import { useEffect, useState } from "react";

/** Full-bleed background slideshow (Elementor background slideshow, with a ken-burns zoom). */
export default function Hero({ images, anchor, label }: { images: string[]; anchor?: string | null; label: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);
  return (
    <section id={anchor ?? undefined} className="hero" role="img" aria-label={label}>
      {images.map((src, k) => (
        <div
          key={src}
          className={`hero__slide${k === i ? " is-active" : ""}`}
          style={{ backgroundImage: `url("${src}")` }}
          aria-hidden
        />
      ))}
    </section>
  );
}
