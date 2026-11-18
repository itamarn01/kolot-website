"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Lightbox player. Uses youtube-nocookie.com so nothing is set until the visitor presses play.
 * Rendered through a portal into <body>: the carousels move their slides with CSS transforms,
 * and a transformed ancestor would trap (and clip) a position:fixed overlay inside the carousel.
 */
export default function YouTubeModal({ id, onClose, lang }: { id: string; onClose: () => void; lang: "he" | "en" }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      prev?.focus();
    };
  }, [mounted, onClose]);

  if (!mounted) return null;
  return createPortal(
    <div className="yt-modal" role="dialog" aria-modal="true" aria-label="YouTube" onClick={onClose}>
      <div className="yt-modal__inner" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="yt-modal__close" type="button" onClick={onClose} aria-label={lang === "he" ? "סגירה" : "Close"}>
          ×
        </button>
        <div className="yt-modal__frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
            title="YouTube video"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
