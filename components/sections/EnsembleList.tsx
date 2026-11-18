"use client";

import { useState, useCallback } from "react";
import type { Section, Lang } from "@/lib/types";
import { VideoCarousel } from "./Videos";
import YouTubeModal from "../YouTubeModal";
import { PlayIcon } from "../icons";
import { useConsent } from "../consent";

type S = Extract<Section, { type: "ensembleList" }>;

function YouTubeCard({ id, lang }: { id: string; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <div className="videos__main" style={{ borderColor: "var(--cyan)" }}>
      <button type="button" className="video-slide" style={{ backgroundImage: `url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")` }} onClick={() => setOpen(true)} aria-label={lang === "he" ? "ניגון הסרטון" : "Play video"}>
        <span className="play-btn">
          <PlayIcon />
        </span>
      </button>
      {open && <YouTubeModal id={id} onClose={close} lang={lang} />}
    </div>
  );
}

function Instagram({ url, lang }: { url: string; lang: Lang }) {
  const { consent, open } = useConsent();
  if (!consent?.marketing) {
    return (
      <div className="ig-embed" style={{ display: "grid", placeItems: "center", padding: 24, textAlign: "center", background: "#111", color: "#ddd", border: "1px solid var(--orange)" }}>
        <div>
          <p>{lang === "he" ? "הסרטון מוטמע מאינסטגרם, שעשויה לשמור עוגיות." : "This video is embedded from Instagram, which may set cookies."}</p>
          <p style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={open}>
              {lang === "he" ? "הגדרות עוגיות" : "Cookie settings"}
            </button>
            <a className="btn btn--yellow" href={url} target="_blank" rel="noopener noreferrer">
              {lang === "he" ? "צפייה באינסטגרם" : "Watch on Instagram"}
            </a>
          </p>
        </div>
      </div>
    );
  }
  return <iframe className="ig-embed" src={`${url.replace(/\/$/, "")}/embed`} title="Instagram" loading="lazy" allow="encrypted-media" />;
}

/** Reception ensembles (video + icon + text) and the DJ list. */
export default function EnsembleList({ items, lang }: { items: S["items"]; lang: Lang }) {
  const single = items.length === 1;
  return (
    <section className={`section ens-list${single ? " ens-list--single" : ""}`} style={{ marginTop: 40 }}>
      {items.map((it, k) => (
        <article key={k} className="ens-item" data-reveal="up" style={{ ["--reveal-delay" as string]: `${(k % 2) * 0.12}s` }}>
          <div className="ens-item__media">
            {it.media.kind === "youtube" && <YouTubeCard id={it.media.id} lang={lang} />}
            {it.media.kind === "carousel" && <VideoCarousel slides={it.media.slides} lang={lang} />}
            {it.media.kind === "instagram" && it.media.url && <Instagram url={it.media.url} lang={lang} />}
          </div>
          <div className="ens-item__head">
            {it.icon && <img className="ens-item__icon" src={it.icon} alt="" />}
            <div>
              <h3 className="ens-item__title" dir="auto">{it.title}</h3>
              <div className="ens-item__desc" dir={lang === "en" ? "ltr" : "rtl"} dangerouslySetInnerHTML={{ __html: it.desc }} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
