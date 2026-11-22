import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Venue autocomplete for the contact form's "where is the event" field.
 * Proxies Zooglot's public places search (OpenStreetMap / Photon, the same suggestions the CRM shows)
 * so the browser only ever talks to this site. Returns [{ label, title, where, lat, lon }].
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "";
  try {
    return NextResponse.json({ places: await searchPlaces(q) }, { headers: { "Cache-Control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ places: [] });
  }
}
