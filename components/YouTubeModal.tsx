"use client";

import { useEffect, useRef } from "react";

/** Lightbox player. Uses youtube-nocookie.com so nothing is set until the visitor presses play. */
export default function YouTubeModal({ id, onClose, lang }: { id: string; onClose: () => void; lang: "he" | "en" }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);
  return (
    <div className="yt-modal" role="dialog" aria-modal="true" aria-label="YouTube" onClick={onClose}>
      <button ref={closeRef} className="yt-modal__close" type="button" onClick={onClose} aria-label={lang === "he" ? "סגירה" : "Close"}>
        ×
      </button>
      <div className="yt-modal__frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title="YouTube video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
