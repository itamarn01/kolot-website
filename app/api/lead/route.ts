import { NextResponse, after } from "next/server";
import { validEmail, validPhone } from "@/lib/lead";
import { restoreMondayStage, sendToMonday } from "@/lib/monday";
import { normalizeSource } from "@/lib/source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Contact form endpoint.
 *  1. validates + filters bots (honeypot, minimum fill time, light rate limit)
 *  2. forwards the lead to Zooglot (server-to-server, WEBHOOK_SECRET) – Zooglot saves it in the CRM,
 *     sends the visitor a WhatsApp from the band's number and emails both sides
 *  3. if Zooglot can't be reached: emails the band directly through Resend (if configured)
 * The visitor's browser never sees the secret.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   ZOOGLOT_API_URL          https://zooglot-backend.up.railway.app
 *   ZOOGLOT_WEBHOOK_SECRET   = WEBHOOK_SECRET of the Zooglot backend (Railway)
 *   RESEND_API_KEY           optional – fallback email if Zooglot is down
 *   RESEND_FROM              optional – e.g. "KOLOT <website@kolotband.co.il>" (verified domain)
 *   LEAD_NOTIFY_EMAIL        optional – default kolotmusic@gmail.com
 *   MONDAY_API_TOKEN         optional – also create the lead on monday ("מעקב זוגות" → Active Leads)
 *
 * Until the website-lead endpoint is live (or the secret is set), leads still reach Zooglot through
 * its existing public form endpoint (the one the old iframes used) – saved in the CRM, without the
 * automatic WhatsApp/emails.
 */

const ZOOGLOT_DEFAULT = "https://zooglot-backend.up.railway.app";
const LEGACY_FORM_SLUG = {
  he: process.env.ZOOGLOT_FORM_SLUG_HE || "טופס-ניסוי-d8eb009fa99c319a",
  en: process.env.ZOOGLOT_FORM_SLUG_EN || "Mazal-Tov--a092a5d62d6d2aae",
};

const FIELD_MAX: Record<string, number> = {
  contact_name: 120,
  relation: 80,
  event_date: 10,
  event_location: 200,
  event_lat: 20,
  event_lng: 20,
  phone1: 40,
  email: 160,
  hear_about_us: 120,
  partner_name: 120,
  celebration: 200,
  referrer: 120,
  notes: 2000,
};

// best-effort per-instance limit: 5 submissions / 10 minutes / IP
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function fallbackEmail(fields: Record<string, string>, lang: string, page: string, reason: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 10px;color:#555">${esc(k)}</td><td style="padding:6px 10px">${esc(v)}</td></tr>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "KOLOT Website <onboarding@resend.dev>",
      to: [process.env.LEAD_NOTIFY_EMAIL || "kolotmusic@gmail.com"],
      subject: `🌐 ליד חדש מהאתר (גיבוי): ${fields.contact_name || fields.phone1}`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif"><h2>ליד חדש מהאתר kolotband.co.il</h2>
        <p style="color:#b45309">⚠️ Zooglot לא היה זמין (${esc(reason)}), לכן הליד לא נשמר במערכת ולא נשלח וואטסאפ אוטומטי. כדאי להזין אותו ידנית.</p>
        <table>${rows}<tr><td style="padding:6px 10px;color:#555">שפה / עמוד</td><td style="padding:6px 10px">${esc(lang)} · ${esc(page)}</td></tr></table></div>`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

type ZooglotResult = { ok: true; whatsapp: string; via: string } | { ok: false; reason: string };

async function sendToZooglot(fields: Record<string, string>, lang: string, page: string, consent: boolean): Promise<ZooglotResult> {
  const api = (process.env.ZOOGLOT_API_URL || ZOOGLOT_DEFAULT).replace(/\/+$/, "");
  const secret = process.env.ZOOGLOT_WEBHOOK_SECRET;
  let reason = "secret not configured";
  // 1) website-lead endpoint: CRM + WhatsApp + emails
  if (secret) {
    try {
      const res = await fetch(`${api}/api/webhooks/website-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-webhook-key": secret },
        body: JSON.stringify({ lang, page, whatsapp_consent: consent, fields }),
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: true, whatsapp: data.whatsapp || "unknown", via: "zooglot" };
      }
      reason = `HTTP ${res.status}`;
    } catch (e) {
      reason = e instanceof Error ? e.message : "network error";
    }
  }
  // 2) public form endpoint: the lead is saved in the CRM (no automatic WhatsApp/emails)
  try {
    const legacyNotes = [fields.notes, `🌐 נשלח מהאתר kolotband.co.il (${page || "/"})`].filter(Boolean).join("\n");
    const slug = LEGACY_FORM_SLUG[lang === "en" ? "en" : "he"];
    const res = await fetch(`${api}/api/public/forms/${encodeURIComponent(slug)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, notes: legacyNotes }),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return { ok: true, whatsapp: "skipped", via: "zooglot-form" };
    reason += `; form HTTP ${res.status}`;
  } catch (e) {
    reason += `; form ${e instanceof Error ? e.message : "error"}`;
  }
  return { ok: false, reason };
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // --- bots: hidden field filled, or the whole form "filled" in under 2.5 s → pretend success
  const startedAt = Number(body.started_at) || 0;
  if (body.company || (startedAt && Date.now() - startedAt < 2500)) {
    return NextResponse.json({ ok: true, whatsapp: "skipped" });
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const lang = body.lang === "en" ? "en" : "he";
  const source = normalizeSource(body.source) || "website";
  // the source rides along in the page label, so Zooglot's lead note and the band email show it too
  const page = `${String(body.page || "").slice(0, 200)} · מקור: ${source}`;
  const raw = (body.fields || {}) as Record<string, unknown>;
  const fields: Record<string, string> = {};
  for (const [k, max] of Object.entries(FIELD_MAX)) {
    const v = String(raw[k] ?? "").trim().slice(0, max);
    if (v) fields[k] = v;
  }
  if (!fields.contact_name || !fields.phone1 || !validPhone(fields.phone1)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  if (fields.email && !validEmail(fields.email)) delete fields.email;
  if (fields.event_date && !/^\d{4}-\d{2}-\d{2}$/.test(fields.event_date)) delete fields.event_date;
  // coordinates come from a picked suggestion; drop anything that isn't a real lat/lng pair
  const lat = Number(fields.event_lat), lng = Number(fields.event_lng);
  if (!fields.event_location || !(Math.abs(lat) <= 90 && Math.abs(lng) <= 180) || !fields.event_lat || !fields.event_lng) {
    delete fields.event_lat;
    delete fields.event_lng;
  }

  // --- monday.com runs in parallel with Zooglot (independent of it)
  const monday: Promise<string | null> = process.env.MONDAY_API_TOKEN
    ? sendToMonday(fields, lang, page, source).catch((e) => {
        console.error("[lead] monday failed:", e instanceof Error ? e.message : e);
        return null;
      })
    : Promise.resolve(null);

  // the CRM stores the location as text, and has no partner / celebration fields: those lead the notes
  const { event_lat: _lat, event_lng: _lng, partner_name, celebration, ...zooglotFields } = fields;
  const partnerLabel = fields.relation === "כלה" ? "שם החתן" : "שם הכלה";
  const extra = [partner_name && `${partnerLabel}: ${partner_name}`, celebration && `מה חוגגים: ${celebration}`].filter(Boolean);
  if (extra.length) zooglotFields.notes = [...extra, zooglotFields.notes].filter(Boolean).join("\n");
  const zooglot = await sendToZooglot(zooglotFields, lang, page, body.whatsapp_consent !== false);
  const mondayId = await monday;
  if (mondayId) {
    // after the response: undo the board automation that resets "שלב" on new items
    after(async () => {
      await new Promise((r) => setTimeout(r, 8000));
      await restoreMondayStage(mondayId, lang).catch((e) => console.error("[lead] monday stage fix failed:", e instanceof Error ? e.message : e));
    });
  }

  if (zooglot.ok) return NextResponse.json({ ok: true, whatsapp: zooglot.whatsapp, via: zooglot.via, monday: !!mondayId });
  console.error(`[lead] Zooglot unavailable (${zooglot.reason})`);

  // --- fallback email (if configured) so the band hears about it right away
  let emailed = false;
  try {
    emailed = await fallbackEmail(zooglotFields, lang, page, zooglot.reason);
  } catch (e) {
    console.error("[lead] fallback email failed", e);
  }
  if (mondayId || emailed) return NextResponse.json({ ok: true, whatsapp: "skipped", via: mondayId ? "monday" : "email" });

  // --- 3) the client offers a pre-filled WhatsApp link instead
  return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
}
