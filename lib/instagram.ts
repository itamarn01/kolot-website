/**
 * Latest @kolotband posts for the homepage, from the official Instagram API (Meta Graph API).
 *
 * Auth: a never-expiring system-user token from the "להקת קולות" business portfolio
 * (system user "kolot-website", app "KOLOT Website", permission instagram_basic).
 * It lives only in the INSTAGRAM_TOKEN env var: Vercel → Settings → Environment Variables,
 * and .env.local for local development. Never commit it.
 *
 * If the token is missing or the API fails, getInstagramPosts() returns [] and the homepage
 * shows its built-in reel cards instead, so the page never breaks.
 */

/** @kolotband's Instagram account ID (public, not a secret). */
const IG_USER_ID = process.env.INSTAGRAM_USER_ID || "17841401117125224";
const GRAPH = "https://graph.facebook.com/v24.0";

/** One photo or video inside a post (a carousel has several). */
export type InstaMedia = { type: "image" | "video"; src: string; poster?: string };

export type InstaPost = {
  id: string;
  permalink: string;
  /** Card still. */
  image: string;
  /** Card hover preview (videos only). */
  video?: string;
  isVideo: boolean;
  caption: string;
  /** Everything the lightbox shows, in order. */
  media: InstaMedia[];
};

type GraphMedia = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  children?: { data?: GraphMedia[] };
};

function toMedia(m: GraphMedia): InstaMedia | null {
  if (!m.media_url) return null;
  return m.media_type === "VIDEO" ? { type: "video", src: m.media_url, poster: m.thumbnail_url } : { type: "image", src: m.media_url };
}

function normalise(m: GraphMedia): InstaPost | null {
  const isVideo = m.media_type === "VIDEO";
  // Videos: thumbnail_url is the still, media_url the MP4. Images and carousels: media_url is the (first) image.
  const image = isVideo ? m.thumbnail_url : m.media_url;
  if (!m.permalink || !image) return null;
  const kids = (m.children?.data ?? []).map(toMedia).filter((x): x is InstaMedia => x !== null);
  const self = toMedia(m);
  const media = kids.length ? kids : self ? [self] : [{ type: "image" as const, src: image }];
  return {
    media,
    id: m.id,
    permalink: m.permalink,
    image,
    video: isVideo ? m.media_url : undefined,
    isVideo,
    caption: (m.caption ?? "").trim(),
  };
}

export async function getInstagramPosts(limit = 24): Promise<InstaPost[]> {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) return [];
  const fields = "id,media_type,media_url,thumbnail_url,permalink,caption,children{media_type,media_url,thumbnail_url}";
  try {
    // Re-read at most once an hour. Instagram's media links are signed and expire after a while,
    // so they must not be cached much longer than that.
    const res = await fetch(`${GRAPH}/${IG_USER_ID}/media?fields=${encodeURIComponent(fields)}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: GraphMedia[] };
    return (data.data ?? []).map(normalise).filter((p): p is InstaPost => p !== null);
  } catch {
    return [];
  }
}
