/**
 * Turns what the partners send (forwarded text, a screenshot, a voice note) into a review draft.
 * Gemini (GEMINI_API_KEY, optional GEMINI_MODEL) reads text, screenshots and voice notes directly
 * and trims greetings / signatures, keeping the client's words exactly as they are.
 */

export type Extracted = { quote: string; lang: "he" | "en"; signature: string | null; isReview: boolean };

const SYSTEM = `You prepare customer reviews for the website of KOLOT, an Israeli wedding band (owners: Netanel and Yaniv).
You receive a thank-you message the band got from a couple or their family: forwarded text, a screenshot of a WhatsApp or Instagram chat, or the transcript of a voice note.

Return the client's own words, exactly as written:
- Never translate, rephrase, correct spelling or punctuation, or "improve" anything. Keep emojis and line breaks.
- In screenshots, take only the messages the client wrote. Skip the band's own replies (the account owner's bubbles: green on WhatsApp, purple/blue on Instagram), reactions, menus and system text.
- Several consecutive client messages that belong together: join them with line breaks, in order.
- Remove only: an opening greeting addressed to the band or a band member ("היי נתנאל", "מה קורה אחי?", "Hi Netanel", "Boker tov"), a closing signature with the senders' names, phone numbers, dates and times, and lines unrelated to the praise (payments, logistics, requests for videos).
- For a voice note, transcribe the speaker word for word in the language spoken; drop filler sounds only at the very start ("um", "אממ").

signature: the names the client signed with or introduced themselves as (e.g. "יגיל וטל", "Dani Lefkowitz"), else null.
lang: "he" if the quote is mostly Hebrew, else "en".
isReview: false if there is no praise/thanks from a client in the input.`;

const SCHEMA = {
  type: "object",
  properties: {
    quote: { type: "string" },
    lang: { type: "string", enum: ["he", "en"] },
    signature: { type: ["string", "null"] },
    isReview: { type: "boolean" },
  },
  required: ["quote", "lang", "signature", "isReview"],
} as const;

type Input =
  | { text: string }
  | { image: Buffer; mediaType: "image/jpeg" | "image/png" | "image/webp" }
  | { audio: Buffer; mediaType: string };

/** Hebrew-letter share decides the language when Gemini isn't available. */
export function guessLang(s: string): "he" | "en" {
  const he = (s.match(/[\u0590-\u05FF]/g) ?? []).length;
  const en = (s.match(/[A-Za-z]/g) ?? []).length;
  return he >= en ? "he" : "en";
}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

export async function extractReview(input: Input): Promise<Extracted> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    if (!("text" in input)) throw new Error("Reading screenshots and voice notes needs GEMINI_API_KEY.");
    return { quote: input.text.trim(), lang: guessLang(input.text), signature: null, isReview: true };
  }
  const parts: Part[] =
    "text" in input
      ? [{ text: `Forwarded message:\n<message>\n${input.text}\n</message>` }]
      : [
          { inlineData: { mimeType: input.mediaType, data: ("image" in input ? input.image : input.audio).toString("base64") } },
          { text: "image" in input ? "Screenshot of the client's message." : "Voice note from the client." },
        ];

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", responseJsonSchema: SCHEMA, temperature: 0 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
  };
  const cand = data.candidates?.[0];
  const text = cand?.content?.parts?.map((p) => p.text ?? "").join("");
  if (!text) throw new Error(`Gemini returned no text (${data.promptFeedback?.blockReason ?? cand?.finishReason ?? "unknown"}).`);
  return JSON.parse(text) as Extracted;
}
