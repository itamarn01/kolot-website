"use client";

import { useEffect, useRef, useState } from "react";
import { ZOOGLOT_FORM } from "@/lib/site";
import type { Lang } from "@/lib/types";

/** The lead form lives in the Zooglot app; we embed it and load it only when it gets near the viewport. */
export default function ZooglotForm({ lang, form }: { lang: Lang; form?: { src: string; title: string } | null }) {
  const f = form ?? ZOOGLOT_FORM[lang];
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (location.hash === "#contact-us" || !("IntersectionObserver" in window)) {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver((e) => e[0].isIntersecting && (setLoad(true), io.disconnect()), { rootMargin: "800px 0px" });
    io.observe(el);
    const onHash = () => location.hash === "#contact-us" && setLoad(true);
    window.addEventListener("hashchange", onHash);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return (
    <div ref={ref} className="contact__form" data-reveal="up">
      {load ? (
        <iframe src={f.src} title={f.title} loading="lazy" style={{ width: "100%", minHeight: 640, border: 0, borderRadius: 12 }} />
      ) : (
        <div style={{ minHeight: 640, borderRadius: 12, background: "#0e1b20" }} aria-hidden />
      )}
    </div>
  );
}
