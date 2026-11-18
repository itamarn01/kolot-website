import localFont from "next/font/local";

/** Headings – "barlev" by AlefAlefAlef (commercial font, self-hosted exactly as on the WordPress site). */
export const barlev = localFont({
  src: "./fonts/barlev.woff2",
  variable: "--font-barlev",
  display: "swap",
  fallback: ["Karantina", "Arial Narrow", "sans-serif"],
});

/** Body text – Assistant (Google Fonts, OFL), variable weight 200–800. */
export const assistant = localFont({
  src: [
    { path: "./fonts/assistant-hebrew.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/assistant-latin.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/assistant-latin-ext.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-assistant",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

/** Secondary display font from the Elementor kit – Karantina (Google Fonts, OFL). */
export const karantina = localFont({
  src: [
    { path: "./fonts/karantina-300-hebrew.woff2", weight: "300" },
    { path: "./fonts/karantina-300-latin.woff2", weight: "300" },
    { path: "./fonts/karantina-400-hebrew.woff2", weight: "400" },
    { path: "./fonts/karantina-400-latin.woff2", weight: "400" },
    { path: "./fonts/karantina-700-hebrew.woff2", weight: "700" },
    { path: "./fonts/karantina-700-latin.woff2", weight: "700" },
  ],
  variable: "--font-karantina",
  display: "swap",
});

/** "ADAM.CG PRO" – used for the contact line on the packages pages (Latin only). */
export const adam = localFont({
  src: "./fonts/adam-cg-pro.woff2",
  variable: "--font-adam",
  display: "swap",
});

export const fontVars = [barlev.variable, assistant.variable, karantina.variable, adam.variable].join(" ");
