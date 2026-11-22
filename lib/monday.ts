/**
 * Sends a website lead to monday.com – board "מעקב זוגות", group "Active Leads".
 * Server-only (uses MONDAY_API_TOKEN). Column ids/labels come from the live board (1101725011).
 *
 * Env: MONDAY_API_TOKEN (required to enable), MONDAY_BOARD_ID, MONDAY_GROUP_ID (optional overrides)
 */

import { searchPlaces } from "./places";

export const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID || "1101725011";
export const MONDAY_GROUP_ID = process.env.MONDAY_GROUP_ID || "topics"; // "Active Leads"

const COL = {
  contact: "text", // Contact
  relation: "____2", // קרבה (status)
  eventDate: "weddingdate", // Event date
  phone: "______14", // טלפון 1
  email: "____", // מייל
  location: "location", // Event location (map column: needs coordinates)
  venue: "____6", // אולם (text) – only when the place couldn't be found on the map
  saleStatus: "______", // סטאטוס מכירה
  stage: "status", // שלב
  nextAction: "status7", // פעולה הבאה
  hearAbout: "_______________", // How'd You Hear About Us?
  referrer: "text_mm05h4s4", // מי המליץ
  notes: "_____", // הערות
  contactDate: "_____________", // תאריך התקשרות
  howArrived: "_________", // איך הגיעו
};

// labels that exist on the board's status columns
const RELATION_LABELS = new Set(["כלה", "חתן", "הורה", "מפיק/ה"]);
const HEAR_MAP: Record<string, string> = {
  Instagram: "Instagram",
  Facebook: "Facebook",
  Youtube: "Youtube",
  "ניגנתם אצל חברים": "ניגנתם אצל חברים",
  המלצה: "חברים המליצו",
  גוגל: "אחר",
  אחר: "אחר",
};

// calling code → ISO country (monday's phone column needs the country)
const CALLING: Record<string, string> = {
  "972": "IL", "1": "US", "44": "GB", "33": "FR", "39": "IT", "43": "AT", "49": "DE", "34": "ES", "31": "NL",
  "32": "BE", "41": "CH", "61": "AU", "27": "ZA", "7": "RU", "380": "UA", "48": "PL", "351": "PT", "353": "IE",
  "30": "GR", "36": "HU", "420": "CZ", "45": "DK", "46": "SE", "47": "NO", "358": "FI", "52": "MX", "54": "AR",
  "55": "BR", "971": "AE", "90": "TR", "40": "RO", "359": "BG", "385": "HR", "381": "RS", "370": "LT", "371": "LV", "372": "EE",
};

/** "050-123 4567" → { phone: "+972501234567", countryShortName: "IL" }; international numbers by calling code. */
export function mondayPhone(raw: string): { phone: string; countryShortName: string } | null {
  const trimmed = raw.trim();
  let d = trimmed.replace(/\D/g, "");
  if (!d) return null;
  const intl = trimmed.startsWith("+") || d.startsWith("00");
  if (d.startsWith("00")) d = d.slice(2);
  if (!intl && d.startsWith("0")) return { phone: "+972" + d.slice(1), countryShortName: "IL" };
  if (!intl && d.length === 9 && d.startsWith("5")) return { phone: "+972" + d, countryShortName: "IL" };
  for (const len of [3, 2, 1]) {
    const cc = CALLING[d.slice(0, len)];
    if (cc) return { phone: "+" + d, countryShortName: cc };
  }
  return null;
}

const todayIL = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date());

type Coords = { lat: number; lng: number } | null;

export function buildMondayItem(fields: Record<string, string>, lang: "he" | "en", page: string, coords: Coords = null) {
  const v: Record<string, unknown> = {};
  const extraNotes: string[] = [];

  if (fields.contact_name) v[COL.contact] = fields.contact_name;
  if (fields.relation) {
    if (RELATION_LABELS.has(fields.relation)) v[COL.relation] = { label: fields.relation };
    else extraNotes.push(`קרבה: ${fields.relation}`);
  }
  if (fields.event_date) v[COL.eventDate] = { date: fields.event_date };
  const phone = mondayPhone(fields.phone1 || "");
  if (phone) v[COL.phone] = phone;
  else if (fields.phone1) extraNotes.push(`טלפון: ${fields.phone1}`);
  if (fields.email) v[COL.email] = { email: fields.email, text: fields.email };
  if (fields.event_location) {
    // the visitor's own wording is the address; the coordinates only place the pin
    if (coords) v[COL.location] = { lat: String(coords.lat), lng: String(coords.lng), address: fields.event_location };
    else v[COL.venue] = fields.event_location;
  }
  v[COL.saleStatus] = { label: "Open" };
  v[COL.stage] = { label: lang === "en" ? "לקוח משאלון אנגלית" : "לקוח משאלון" };
  v[COL.nextAction] = { label: "עוד פרטים" };
  if (fields.hear_about_us) {
    const mapped = HEAR_MAP[fields.hear_about_us];
    v[COL.hearAbout] = { label: mapped || "אחר" };
    if (!mapped || fields.hear_about_us === "גוגל") extraNotes.push(`איך שמעו: ${fields.hear_about_us}`);
  }
  if (fields.referrer) v[COL.referrer] = fields.referrer;
  v[COL.contactDate] = { date: todayIL() };
  v[COL.howArrived] = `אתר kolotband.co.il${page ? ` (${page})` : ""}`;
  const notes = [fields.notes, ...extraNotes, "🌐 ליד מהאתר"].filter(Boolean).join(" | ");
  v[COL.notes] = notes.slice(0, 1900);

  return { name: fields.contact_name || fields.phone1 || "ליד מהאתר", columnValues: v };
}

async function mondayQuery(query: string, variables: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) throw new Error("MONDAY_API_TOKEN not set");
  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json", "API-Version": "2024-10" },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(12_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.errors || data.error_message) {
    throw new Error(`monday: ${res.status} ${JSON.stringify(data.errors || data.error_message || data).slice(0, 300)}`);
  }
  return data.data;
}

/**
 * The board has an automation "when an item is created → שלב = לקוח חדש ידני", which overwrites the
 * stage we set a few seconds after creation. Set it back once that has run.
 */
export async function restoreMondayStage(itemId: string, lang: "he" | "en") {
  await mondayQuery(
    "mutation ($board: ID!, $item: ID!, $col: String!, $value: JSON!) { change_column_value (board_id: $board, item_id: $item, column_id: $col, value: $value) { id } }",
    { board: MONDAY_BOARD_ID, item: itemId, col: COL.stage, value: JSON.stringify({ label: lang === "en" ? "לקוח משאלון אנגלית" : "לקוח משאלון" }) },
  );
}

/** Coordinates of the picked suggestion, or the best map match for text typed without picking one. */
async function locate(fields: Record<string, string>): Promise<Coords> {
  if (!fields.event_location) return null;
  const lat = Number(fields.event_lat), lng = Number(fields.event_lng);
  if (fields.event_lat && fields.event_lng && Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  try {
    const [top] = await searchPlaces(fields.event_location);
    return top ? { lat: top.lat, lng: top.lon } : null;
  } catch {
    return null;
  }
}

/** Creates the item. Returns the item id, or throws. */
export async function sendToMonday(fields: Record<string, string>, lang: "he" | "en", page: string): Promise<string> {
  const item = buildMondayItem(fields, lang, page, await locate(fields));
  const data = await mondayQuery(
    "mutation ($board: ID!, $group: String!, $name: String!, $values: JSON!) { create_item (board_id: $board, group_id: $group, item_name: $name, column_values: $values) { id } }",
    { board: MONDAY_BOARD_ID, group: MONDAY_GROUP_ID, name: item.name, values: JSON.stringify(item.columnValues) },
  );
  return String(data?.create_item?.id || "");
}
