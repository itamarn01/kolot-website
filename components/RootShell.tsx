import type { ReactNode } from "react";
import { fontVars } from "@/app/fonts";
import { ConsentProvider } from "./consent";
import AccessibilityWidget from "./AccessibilityWidget";
import RevealObserver from "./Reveal";
import { UI } from "@/lib/site";
import type { Lang } from "@/lib/types";

/** Shared <html>/<body> for the Hebrew and English root layouts. */
export default function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    // The original site renders both languages with an RTL page structure; English text blocks set dir="ltr" themselves.
    <html lang={lang === "he" ? "he-IL" : "en-US"} dir="rtl" className={fontVars}>
      <body id="top">
        <a className="skip-link" href="#main">
          {UI[lang].skip}
        </a>
        <ConsentProvider lang={lang}>
          {children}
          <AccessibilityWidget lang={lang} />
        </ConsentProvider>
        <RevealObserver />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "KOLOT – קולות",
              url: "https://kolotband.co.il/",
              logo: "https://kolotband.co.il/media/kolot-logo-03.svg",
              email: "kolotmusic@gmail.com",
              telephone: "+972555081080",
              genre: ["Wedding band", "Hasidic", "Israeli", "Pop"],
              sameAs: ["https://www.facebook.com/kolotband", "https://www.instagram.com/kolotband/", "https://www.youtube.com/user/kolotMusic"],
            }),
          }}
        />
      </body>
    </html>
  );
}
