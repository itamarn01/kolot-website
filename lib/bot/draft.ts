/**
 * A review draft lives inside the bot's own Telegram message (no database): the bot writes it as plain
 * text, and reads it back from the message when a button is pressed or someone replies to it.
 */

export type Draft = {
  quote: string;
  name: string | null; // null = not set yet
  venue: string | null;
  anonymous: boolean;
  lang: "he" | "en";
  pinned: boolean;
  audioFileId: string | null;
};

const HEAD = "📝 טיוטת המלצה";
const SEP = "━━━━━━━━━━";
const EMPTY = "—";

export const isDraft = (text?: string) => !!text?.startsWith(HEAD);

export function renderDraft(d: Draft): string {
  return [
    HEAD,
    "",
    d.quote,
    "",
    SEP,
    `👫 שם: ${d.anonymous ? "אנונימי" : (d.name ?? EMPTY)}`,
    `📍 מקום: ${d.anonymous ? EMPTY : (d.venue ?? EMPTY)}`,
    `🌐 שפה: ${d.lang === "he" ? "עברית" : "English"}`,
    `📌 עמוד הבית: ${d.pinned ? "כן, בראש הקרוסלה" : "לא"}`,
    ...(d.audioFileId ? [`🎙 הקלטה: ${d.audioFileId}`] : []),
    "",
    "↩️ לתיקון: שלחו שם · מקום (למשל: דנה ויוסי · האחוזה), או ״ציטוט:״ ואחריו הנוסח המתוקן.",
  ].join("\n");
}

export function parseDraft(text: string): Draft {
  const body = text.slice(HEAD.length).replace(/^\n+/, "");
  const cut = body.lastIndexOf(`\n${SEP}\n`);
  const quote = body.slice(0, cut).trim();
  const meta = body.slice(cut + SEP.length + 2).split("\n");
  const field = (emoji: string) => {
    const line = meta.find((l) => l.startsWith(emoji));
    const v = line?.slice(line.indexOf(":") + 1).trim();
    return v && v !== EMPTY ? v : null;
  };
  const name = field("👫");
  return {
    quote,
    name: name === "אנונימי" ? null : name,
    venue: field("📍"),
    anonymous: name === "אנונימי",
    lang: field("🌐") === "English" ? "en" : "he",
    pinned: (field("📌") ?? "").startsWith("כן"),
    audioFileId: field("🎙"),
  };
}

/** A reply to a draft: "ציטוט: ...", "שם: ...", "מקום: ...", or simply "names · venue". */
export function applyReply(d: Draft, reply: string): Draft {
  const t = reply.trim();
  const q = t.match(/^(?:ציטוט|quote)\s*:\s*([\s\S]+)$/i);
  if (q) return { ...d, quote: q[1].trim() };
  const next = { ...d, anonymous: false };
  const named = t.match(/^(?:שם|name)\s*:\s*(.+)$/im);
  const venue = t.match(/^(?:מקום|אולם|venue)\s*:\s*(.+)$/im);
  if (named || venue) {
    if (named) next.name = named[1].trim();
    if (venue) next.venue = venue[1].trim();
    return next;
  }
  const parts = t.split(/\s+[·•|]\s+|\s+-\s+|\n/).map((s) => s.trim()).filter(Boolean);
  next.name = parts[0] ?? d.name;
  if (parts[1]) next.venue = cleanVenue(parts.slice(1).join(" "));
  return next;
}

/** "התחתנו בגאיה" → "גאיה", "we got married at Olmaya" → "Olmaya". */
function cleanVenue(v: string): string {
  return (
    v
      .replace(/^(?:התחתנו|חגגנו|החתונה (?:היתה|הייתה)|האירוע היה|היינו)\s+ב-?\s*/, "")
      .replace(/^(?:we )?(?:got married|celebrated|were) (?:at|in) /i, "")
      .trim() || v
  );
}

/** A short message sent right after a draft, without Reply: most likely names / venue for it. */
export const looksLikeDraftFix = (t: string) => t.trim().length <= 80 && t.trim().split("\n").length <= 3;
