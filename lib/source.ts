/**
 * Where a lead came from ("origin" on the monday board).
 *
 * Put it in the link: kolotband.co.il/contact/?src=ig  (utm_source=instagram works too).
 * The browser remembers it for 30 days, so a visitor who arrives from Instagram, browses and only
 * fills the form later still counts as "ig". Without a tag in the link, a visit from Instagram or
 * Facebook still counts as "ig" / "fb"; every other lead from the site is "website".
 */

const KEY = "kolot_src";
const TTL = 30 * 24 * 60 * 60 * 1000;

const ALIASES: Record<string, string> = {
  ig: "ig",
  instagram: "ig",
  insta: "ig",
  fb: "fb",
  facebook: "fb",
  google: "google",
  tiktok: "tiktok",
  tt: "tiktok",
  yt: "youtube",
  youtube: "youtube",
  wa: "whatsapp",
  whatsapp: "whatsapp",
};

/** "Instagram" → "ig"; anything else is kept as short lowercase text. */
export function normalizeSource(raw: unknown): string {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\-.]/g, "")
    .slice(0, 40);
  return ALIASES[s] || s;
}

function fromReferrer(ref: string): string {
  let host = "";
  try {
    host = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
  if (!host || host === location.hostname.replace(/^www\./, "") || host.endsWith("kolotband.co.il")) return "";
  if (/(^|\.)instagram\.com$/.test(host)) return "ig";
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host)) return "fb";
  return ""; // Google, other sites, direct visits: "website"
}

/** Runs on every page load: a tag in the link always wins; a referrer only fills an empty slot. */
export function captureSource() {
  try {
    const p = new URLSearchParams(location.search);
    const tagged = normalizeSource(p.get("src") || p.get("utm_source") || "");
    const now = Date.now();
    const saved = readSaved();
    if (tagged) {
      localStorage.setItem(KEY, JSON.stringify({ v: tagged, t: now }));
    } else if (!saved) {
      const ref = fromReferrer(document.referrer);
      if (ref) localStorage.setItem(KEY, JSON.stringify({ v: ref, t: now }));
    }
  } catch {
    /* storage blocked: the form falls back to "website" */
  }
}

function readSaved(): string {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return "";
    const { v, t } = JSON.parse(raw) as { v: string; t: number };
    if (!v || Date.now() - t > TTL) return "";
    return v;
  } catch {
    return "";
  }
}

/** What the forms send with the lead. */
export function leadSource(): string {
  try {
    const p = new URLSearchParams(location.search);
    const tagged = normalizeSource(p.get("src") || p.get("utm_source") || "");
    if (tagged) return tagged;
  } catch {
    /* ignore */
  }
  return readSaved() || "website";
}
