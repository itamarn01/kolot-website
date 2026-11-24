import type { Metadata } from "next";
import { fontVars } from "./fonts";
import NotFoundView from "@/components/home/NotFoundView";
import "./globals.css";

export const metadata: Metadata = { title: "404 – KOLOT", robots: { index: false } };

/** Any URL that matches no page (Hebrew, with a link to English). Pages that call notFound() use (he)/(en) not-found. */
export default function GlobalNotFound() {
  return (
    <html lang="he-IL" dir="rtl" className={fontVars}>
      <body style={{ background: "#0a0a0a" }}>
        <NotFoundView lang="he" />
      </body>
    </html>
  );
}
