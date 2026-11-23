import { after } from "next/server";
import { applyReply, isDraft, parseDraft, renderDraft, type Draft } from "@/lib/bot/draft";
import { extractReview, transcribe } from "@/lib/bot/extract";
import { updateJson, writeFile } from "@/lib/bot/github";
import { downloadFile, keyboard, tg, type TgMessage, type TgUpdate } from "@/lib/bot/telegram";
import type { Review } from "@/lib/reviews";

/**
 * Telegram webhook for the reviews bot. Netanel and Yaniv send it a review (text, screenshot or voice
 * note); it shows a draft to approve, then commits it to content/reviews.json and the site republishes.
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, TELEGRAM_ALLOWED_IDS, GITHUB_TOKEN,
 * ANTHROPIC_API_KEY (screenshots), OPENAI_API_KEY (voice notes).
 */

export const maxDuration = 120;

const REVIEWS = "content/reviews.json";
const allowed = () => (process.env.TELEGRAM_ALLOWED_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

const draftButtons = (d: Draft) =>
  keyboard([
    [{ text: "✅ פרסום באתר", callback_data: "pub" }],
    [
      { text: d.anonymous ? "👫 עם שם" : "🕶 אנונימי", callback_data: "anon" },
      { text: d.pinned ? "📌 ביטול הצמדה" : "📌 לעמוד הבית", callback_data: "pin" },
      { text: d.lang === "he" ? "🌐 English" : "🌐 עברית", callback_data: "lang" },
    ],
    [{ text: "🗑 ביטול", callback_data: "drop" }],
  ]);

const HELP = [
  "שלום! אני הבוט של המלצות קולות 🎶",
  "",
  "שלחו לי המלצה באחת הדרכים:",
  "• העברה או הדבקה של הודעת טקסט",
  "• צילום מסך של ההודעה (וואטסאפ / אינסטגרם)",
  "• הודעה קולית",
  "",
  "אני אכין טיוטה, אחרי זה:",
  "↩️ השיבו לטיוטה עם ״שמות · מקום״ (למשל: דנה ויוסי · האחוזה)",
  "✅ לחצו ״פרסום באתר״, והאתר מתעדכן תוך 1–2 דקות.",
  "",
  "/list – ההמלצות האחרונות באתר (עם אפשרות להסיר)",
].join("\n");

export async function POST(req: Request) {
  if (req.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  const update = (await req.json()) as TgUpdate;
  // Answer Telegram right away; the slow work (Claude, transcription, GitHub) runs after the response.
  after(() => handle(update).catch((e) => console.error("[telegram-bot]", e)));
  return Response.json({ ok: true });
}

async function handle(u: TgUpdate) {
  if (u.callback_query) return onButton(u.callback_query);
  const m = u.message;
  if (!m) return;
  const chat = m.chat.id;
  const from = String(m.from?.id ?? "");
  if (!allowed().includes(from)) {
    if (m.text?.startsWith("/start")) await say(chat, `הבוט הזה פרטי.\nה-Telegram ID שלך: ${from}`);
    return;
  }
  try {
    if (m.text === "/start" || m.text === "/help") return void (await say(chat, `${HELP}\n\nה-ID שלך: ${from}`));
    if (m.text === "/list") return await listRecent(chat);
    if (m.reply_to_message && isDraft(m.reply_to_message.text) && m.text) return await onReply(m);
    await onReview(m);
  } catch (e) {
    await say(chat, `⚠️ משהו השתבש: ${(e as Error).message}`);
  }
}

async function say(chat: number, text: string, extra: Record<string, unknown> = {}) {
  return tg<TgMessage>("sendMessage", { chat_id: chat, text, ...extra });
}

/** New review in: build a draft. */
async function onReview(m: TgMessage) {
  const chat = m.chat.id;
  const audio = m.voice ?? m.audio ?? (m.document?.mime_type?.startsWith("audio/") ? m.document : undefined);
  const imageDoc = m.document?.mime_type?.startsWith("image/") ? m.document : undefined;
  const wait = await say(chat, audio ? "🎧 מתמלל ומכין טיוטה…" : m.photo || imageDoc ? "👀 קורא את צילום המסך…" : "✍️ מכין טיוטה…");

  let ex;
  if (audio) {
    const { bytes } = await downloadFile(audio.file_id);
    ex = await extractReview({ transcript: await transcribe(bytes) });
  } else if (m.photo?.length || imageDoc) {
    const fileId = imageDoc?.file_id ?? m.photo![m.photo!.length - 1].file_id;
    const { bytes, path } = await downloadFile(fileId);
    const mediaType = path.endsWith(".png") ? "image/png" : path.endsWith(".webp") ? "image/webp" : "image/jpeg";
    ex = await extractReview({ image: bytes, mediaType });
  } else if (m.text || m.caption) {
    ex = await extractReview({ text: (m.text ?? m.caption)! });
  } else {
    await tg("editMessageText", { chat_id: chat, message_id: wait.message_id, text: "לא הבנתי מה לשמור. שלחו טקסט, צילום מסך או הודעה קולית." });
    return;
  }
  if (!ex.isReview || !ex.quote.trim()) {
    await tg("editMessageText", { chat_id: chat, message_id: wait.message_id, text: "לא מצאתי פה המלצה של לקוח 🤔 אם בכל זאת יש – אפשר להדביק את הטקסט." });
    return;
  }
  const d: Draft = {
    quote: ex.quote.trim(),
    name: ex.signature,
    venue: null,
    anonymous: false,
    lang: ex.lang,
    pinned: false,
    audioFileId: audio?.file_id ?? null,
  };
  await tg("editMessageText", { chat_id: chat, message_id: wait.message_id, text: renderDraft(d), reply_markup: draftButtons(d) });
}

/** A reply to a draft fixes its name / venue / quote in place. */
async function onReply(m: TgMessage) {
  const draftMsg = m.reply_to_message!;
  const d = applyReply(parseDraft(draftMsg.text!), m.text!);
  await tg("editMessageText", { chat_id: m.chat.id, message_id: draftMsg.message_id, text: renderDraft(d), reply_markup: draftButtons(d) });
  await tg("setMessageReaction", { chat_id: m.chat.id, message_id: m.message_id, reaction: [{ type: "emoji", emoji: "👌" }] }).catch(() => {});
}

async function onButton(q: NonNullable<TgUpdate["callback_query"]>) {
  const ack = (text?: string) => tg("answerCallbackQuery", { callback_query_id: q.id, ...(text ? { text } : {}) }).catch(() => {});
  if (!allowed().includes(String(q.from.id)) || !q.message) return void (await ack("הבוט הזה פרטי"));
  const chat = q.message.chat.id;
  const id = q.message.message_id;
  const data = q.data ?? "";
  const edit = (text: string, markup?: unknown) =>
    tg("editMessageText", { chat_id: chat, message_id: id, text, ...(markup ? { reply_markup: markup } : {}) });

  try {
    // Removing a published review (from /list or a "published" message).
    if (data.startsWith("rm:")) {
      await ack();
      return void (await tg("editMessageReplyMarkup", {
        chat_id: chat,
        message_id: id,
        reply_markup: keyboard([[{ text: "כן, להסיר מהאתר", callback_data: `rmy:${data.slice(3)}` }, { text: "לא", callback_data: `rmn:${data.slice(3)}` }]]),
      }));
    }
    if (data.startsWith("rmn:")) {
      await ack();
      return void (await tg("editMessageReplyMarkup", { chat_id: chat, message_id: id, reply_markup: keyboard([[{ text: "🗑 הסרה מהאתר", callback_data: `rm:${data.slice(4)}` }]]) }));
    }
    if (data.startsWith("rmy:")) {
      await ack("מסיר…");
      const rid = data.slice(4);
      await updateJson<Review[]>(REVIEWS, `Reviews bot: remove ${rid}`, (all) => all.filter((r) => r.id !== rid));
      return void (await edit(`🗑 הוסר מהאתר (יתעדכן תוך 1–2 דקות)\n\n${q.message.text ?? ""}`));
    }

    if (!isDraft(q.message.text)) return void (await ack());
    const d = parseDraft(q.message.text!);

    if (data === "drop") {
      await ack("בוטל");
      return void (await tg("deleteMessage", { chat_id: chat, message_id: id }));
    }
    if (data === "anon" || data === "pin" || data === "lang") {
      const n: Draft =
        data === "anon" ? { ...d, anonymous: !d.anonymous } : data === "pin" ? { ...d, pinned: !d.pinned } : { ...d, lang: d.lang === "he" ? "en" : "he" };
      await ack();
      return void (await edit(renderDraft(n), draftButtons(n)));
    }
    if (data === "back") {
      await ack();
      return void (await tg("editMessageReplyMarkup", { chat_id: chat, message_id: id, reply_markup: draftButtons(d) }));
    }
    if (data === "pub" && !d.anonymous && !d.name) {
      return void (await ack("חסר שם. השיבו לטיוטה עם ״שמות · מקום״, או לחצו ״אנונימי״."));
    }
    if (data === "pub" && d.audioFileId) {
      await ack();
      return void (await tg("editMessageReplyMarkup", {
        chat_id: chat,
        message_id: id,
        reply_markup: keyboard([
          [{ text: "🎙 עם ההקלטה (הזוג אישר)", callback_data: "pub:a" }],
          [{ text: "📝 רק הטקסט", callback_data: "pub:t" }],
          [{ text: "↩️ חזרה", callback_data: "back" }],
        ]),
      }));
    }
    if (data === "pub" || data === "pub:a" || data === "pub:t") {
      await ack("מפרסם…");
      await edit(`⏳ מפרסם…\n\n${d.quote}`);
      const rid = `t${Date.now().toString(36)}`;
      let audio: string | undefined;
      if (data === "pub:a" && d.audioFileId) {
        const { bytes } = await downloadFile(d.audioFileId);
        await writeFile(`public/media/reviews/${rid}.ogg`, bytes, `Reviews bot: voice note for ${rid}`);
        audio = `/media/reviews/${rid}.ogg`;
      }
      const month = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit" }).format(new Date());
      const review: Review = {
        id: rid,
        date: month,
        lang: d.lang,
        name: d.anonymous ? null : d.name,
        venue: d.anonymous ? null : d.venue,
        quote: d.quote,
        ...(d.pinned ? { pinned: true } : {}),
        ...(audio ? { audio } : {}),
      };
      await updateJson<Review[]>(REVIEWS, `Reviews bot: add ${review.name ?? "anonymous"}${review.venue ? ` (${review.venue})` : ""}`, (all) => [review, ...all]);
      const who = review.name ? `${review.name}${review.venue ? ` · ${review.venue}` : ""}` : "אנונימי";
      return void (await edit(`✅ פורסם! יופיע באתר תוך 1–2 דקות\nkolot-website.vercel.app/reviews/\n\n${d.quote}\n— ${who}`, keyboard([[{ text: "🗑 הסרה מהאתר", callback_data: `rm:${rid}` }]])));
    }
    await ack();
  } catch (e) {
    await ack("שגיאה");
    await say(chat, `⚠️ משהו השתבש: ${(e as Error).message}`);
  }
}

/** The latest reviews on the site, each with a remove button. Reads GitHub so it's always current. */
async function listRecent(chat: number) {
  const { readFile } = await import("@/lib/bot/github");
  const all = JSON.parse((await readFile(REVIEWS)).text) as Review[];
  await say(chat, `באתר יש ${all.length} המלצות. האחרונות:`);
  for (const r of all.slice(0, 6)) {
    const who = r.name ? `${r.name}${r.venue ? ` · ${r.venue}` : ""}` : "אנונימי";
    const quote = r.quote.length > 280 ? `${r.quote.slice(0, 280)}…` : r.quote;
    await say(chat, `${quote}\n— ${who}${r.pinned ? " 📌" : ""}${r.audio ? " 🎙" : ""}`, { reply_markup: keyboard([[{ text: "🗑 הסרה מהאתר", callback_data: `rm:${r.id}` }]]) });
  }
}
