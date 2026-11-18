import type { Metadata } from "next";
import { fontVars } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: "404 – KOLOT", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="he-IL" dir="rtl" className={fontVars}>
      <body>
        <main className="legal" style={{ textAlign: "center", paddingTop: 120 }}>
          <img src="/media/kolot-logo-03.svg" alt="KOLOT" width={240} height={144} style={{ margin: "0 auto 20px" }} />
          <h1>העמוד לא נמצא</h1>
          <p lang="en">Page not found</p>
          <p style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            <a className="btn btn--yellow" href="/" style={{ textDecoration: "none", color: "#000" }}>
              לדף הבית
            </a>
            <a className="btn" href="/en/" style={{ textDecoration: "none", color: "#000" }}>
              English
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
