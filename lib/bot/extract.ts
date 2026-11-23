import Anthropic from "@anthropic-ai/sdk";

/**
 * Turns what the partners send (forwarded text, a screenshot, a voice note) into a review draft.
 * Claude (ANTHROPIC_API_KEY) reads screenshots and trims greetings / signatures, word for word.
 * Voice notes are transcribed by OpenAI (OPENAI_API_KEY) first.
 */

export type Extracted = { quote: string; lang: "he" | "en"; signature: string | null; isReview: boolean };

const SYSTEM = `You prepare customer reviews for the website of KOLOT, an Israeli wedding band (owners: Netanel and Yaniv).
You receive a thank-you message the band got from a couple or their family: forwarded text, a screenshot of a WhatsApp or Instagram chat, or the transcript of a voice note.

Return the client's own words, exactly as written:
- Never translate, rephrase, correct spelling or punctuation, or "improve" anything. Keep emojis and line breaks.
- In screenshots, take only the messages the client wrote. Skip the band's own replies (the account owner's bubbles: green on WhatsApp, purple/blue on Instagram), reactions, menus and system text.
- Several consecutive client messages that belong together: join them with line breaks, in order.
- Remove only: an opening greeting addressed to the band or a band member ("היי נתנאל", "מה קורה אחי?", "Hi Netanel", "Boker tov"), a closing signature with the senders' names, phone numbers, dates and times, and lines unrelated to the praise (payments, logistics, requests for videos).
- For a voice transcript, keep the speaker's words; drop filler sounds only at the very start ("um", "אממ").

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
  additionalProperties: false,
} as const;

type Input = { text: string } | { image: Buffer; mediaType: "image/jpeg" | "image/png" | "image/webp" } | { transcript: string };

/** Hebrew-letter share decides the language when Claude isn't available. */
export function guessLang(s: string): "he" | "en" {
  const he = (s.match(/[֐-׿]/g) ?? []).length;
  const en = (s.match(/[A-Za-z]/g) ?? []).length;
  return he >= en ? "he" : "en";
}

export async function extractReview(input: Input): Promise<Extracted> {
  if (!process.env.ANTHROPIC_API_KEY) {
    if ("image" in input) throw new Error("Reading screenshots needs ANTHROPIC_API_KEY.");
    const quote = "text" in input ? input.text : input.transcript;
    return { quote: quote.trim(), lang: guessLang(quote), signature: null, isReview: true };
  }
  const client = new Anthropic();
  const content: Anthropic.Beta.BetaContentBlockParam[] =
    "image" in input
      ? [
          { type: "image", source: { type: "base64", media_type: input.mediaType, data: input.image.toString("base64") } },
          { type: "text", text: "Screenshot of the client's message." },
        ]
      : "text" in input
        ? [{ type: "text", text: `Forwarded message:\n<message>\n${input.text}\n</message>` }]
        : [{ type: "text", text: `Voice note transcript:\n<transcript>\n${input.transcript}\n</transcript>` }];

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    messages: [{ role: "user", content }],
  });
  if (response.stop_reason === "refusal") throw new Error("Claude declined to read this message.");
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("Claude returned no text.");
  return JSON.parse(text.text) as Extracted;
}

/** Voice note (Telegram OGG/Opus, or a forwarded WhatsApp .opus) to text. */
export async function transcribe(bytes: Buffer): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Transcribing voice notes needs OPENAI_API_KEY.");
  const form = new FormData();
  form.append("model", "gpt-4o-transcribe");
  form.append("file", new Blob([new Uint8Array(bytes)], { type: "audio/ogg" }), "voice.ogg");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Transcription failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { text: string }).text.trim();
}
