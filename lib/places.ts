/**
 * Venue search through Zooglot's public places endpoint (OpenStreetMap / Photon, the same suggestions
 * the CRM shows). Server-only; cached in memory.
 */
const ZOOGLOT_DEFAULT = "https://zooglot-backend.up.railway.app";

export type Place = { label: string; title: string; where: string; lat: number; lon: number };

const cache = new Map<string, { at: number; places: Place[] }>();
const TTL = 6 * 60 * 60_000;

export async function searchPlaces(q: string): Promise<Place[]> {
  const query = q.trim().replace(/\s+/g, " ").slice(0, 80);
  if (query.length < 2) return [];
  const key = query.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.places;

  const api = (process.env.ZOOGLOT_API_URL || ZOOGLOT_DEFAULT).replace(/\/+$/, "");
  const res = await fetch(`${api}/api/public/places?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`places ${res.status}`);
  const data = await res.json();
  const places: Place[] = (Array.isArray(data?.places) ? data.places : [])
    .filter((p: Record<string, unknown>) => p && typeof p.label === "string" && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)) && p.lat !== null)
    .slice(0, 7)
    .map((p: Record<string, unknown>) => ({
      label: String(p.label),
      title: String(p.title || p.label),
      where: String(p.where || ""),
      lat: Number(p.lat),
      lon: Number(p.lon),
    }));
  cache.set(key, { at: Date.now(), places });
  if (cache.size > 1000) cache.delete(cache.keys().next().value!);
  return places;
}

