/**
 * Writes to the site's repository through the GitHub contents API. Every write is a commit on main,
 * and Vercel republishes the site from it (about 1-2 minutes).
 * Env: GITHUB_TOKEN (contents read/write on the repo), GITHUB_REPO ("owner/name").
 */

const API = "https://api.github.com";
const repo = () => process.env.GITHUB_REPO ?? "itamarn01/kolot-website";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "kolot-reviews-bot",
  };
}

export async function readFile(path: string): Promise<{ text: string; sha: string }> {
  const res = await fetch(`${API}/repos/${repo()}/contents/${encodeURI(path)}?ref=main`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`GitHub read ${path}: ${res.status}`);
  const data = (await res.json()) as { content: string; sha: string };
  return { text: Buffer.from(data.content, "base64").toString("utf8"), sha: data.sha };
}

/** Creates or replaces a file. `sha` is required when replacing (GitHub rejects stale writes with 409). */
export async function writeFile(path: string, content: Buffer | string, message: string, sha?: string): Promise<void> {
  const body = {
    message,
    branch: "main",
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content, "utf8").toString("base64"),
    ...(sha ? { sha } : {}),
  };
  const res = await fetch(`${API}/repos/${repo()}/contents/${encodeURI(path)}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) {
    const err = new Error(`GitHub write ${path}: ${res.status} ${await res.text()}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
}

/**
 * Read-modify-write of a JSON file, retried when the other partner published at the same moment.
 */
export async function updateJson<T>(path: string, message: string, change: (data: T) => T): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const { text, sha } = await readFile(path);
    const next = change(JSON.parse(text) as T);
    try {
      await writeFile(path, JSON.stringify(next, null, 2) + "\n", message, sha);
      return next;
    } catch (e) {
      const status = (e as { status?: number }).status;
      if ((status === 409 || status === 422) && attempt < 3) continue;
      throw e;
    }
  }
}
