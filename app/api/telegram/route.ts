import { after } from "next/server";
import { applyReply, isDraft, looksLikeDraftFix, parseDraft, renderDraft, type Draft } from "@/lib/bot/draft";
import { extractReview } from "@/lib/bot/extract";
import { updateJson, writeFile } from "@/lib/bot/github";
import { downloadFile, keyboard, tg, type TgMessage, type TgUpdate } from "@/lib/bot/telegram";
import { googleAskMessage, reviewAskMessage, type Review } from "@/lib/reviews";

/**
 * Telegram webhook for the reviews bot. Netanel and Yaniv send it a review (text, screenshot or voice
 * note); it shows a draft to approve, then commits it to content/reviews.json and the site republishes.
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, TELEGRAM_ALLOWED_IDS, GITHUB_TOKEN,
 * GEMINI_API_KEY (reads text, screenshots and voice notes; optional GEMINI_MODEL).
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
  "↩️ שלחו את השמות והמקום (למשל: דנה ויוסי · האחוזה). הם נכנסים לטיוטה הפתוחה",
  "✅ לחצו ״פרסום באתר״, והאתר מתעדכן תוך 1–2 דקות.",
  "",
  "📲 אחרי הפרסום תקבלו הודעה מוכנה לזוג, עם לינק שמעתיק את ההמלצה ופותח את גוגל.",
  "",
  "/list – ההמלצות האחרונות באתר (הסרה / בקשת ביקורת בגוגל)",
  "/google – הודעה מוכנה ללקוחות שעוד לא כתבו כלום",
  "/status – בדיקת חיבור (אם הבוט עונה לאט)",
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
    if (m.text === "/google") return await sendGoogleAsk(chat);
    if (m.text === "/status") return await sendStatus(chat);
    if (m.reply_to_message && isDraft(m.reply_to_message.text) && m.text) return await onReply(m, m.reply_to_message);
    // names / venue sent as a plain message right after a draft (no Reply): they belong to the open draft
    if (m.text && !m.text.startsWith("/") && looksLikeDraftFix(m.text)) {
      const open = await openDraft(chat);
      const d = open && parseDraft(open.text!);
      // only while the draft still lacks a name or venue, so a short new review isn't swallowed
      if (open && d && !d.anonymous && (!d.name || !d.venue)) return await onReply(m, open);
    }
    await onReview(m);
  } catch (e) {
    await say(chat, `⚠️ משהו השתבש: ${(e as Error).message}`);
  }
}

async function say(chat: number, text: string, extra: Record<string, unknown> = {}) {
  return tg<TgMessage>("sendMessage", { chat_id: chat, text, ...extra });
}

/** A message ready to send on WhatsApp: clean text to copy, plus a button that opens WhatsApp with it. */
async function sayForWhatsApp(chat: number, text: string) {
  return say(chat, text, {
    link_preview_options: { is_disabled: true },
    reply_markup: keyboard([[{ text: "📲 שליחה בווטסאפ", url: `https://wa.me/?text=${encodeURIComponent(text)}` }]]),
  });
}

/** After a review is published: the message asking the couple to post it on Google too. */
async function sendReviewAsk(chat: number, r: Pick<Review, "id" | "lang">) {
  await say(chat, "👇 הודעה מוכנה לזוג: העתיקו לצ'אט שלהם או לחצו ״שליחה בווטסאפ״.");
  await sayForWhatsApp(chat, reviewAskMessage(r));
}

/** For clients who didn't write anything: the short kolotband.co.il/google link, in Hebrew and English. */
async function sendGoogleAsk(chat: number) {
  await say(chat, "👇 הודעות מוכנות ללקוחות שעוד לא כתבו המלצה (עברית ואנגלית):");
  await sayForWhatsApp(chat, googleAskMessage("he"));
  await sayForWhatsApp(chat, googleAskMessage("en"));
}

/** New review in: build a draft. */
async function onReview(m: TgMessage) {
  const chat = m.chat.id;
  const audio = m.voice ?? m.audio ?? (m.document?.mime_type?.startsWith("audio/") ? m.document : undefined);
  const imageDoc = m.document?.mime_type?.startsWith("image/") ? m.document : undefined;
  const wait = await say(chat, audio ? "🎧 מתמלל ומכין טיוטה…" : m.photo || imageDoc ? "👀 קורא את צילום המסך…" : "✍️ מכין טיוטה…");

  const busy = (n: number, total: number) =>
    tg("editMessageText", { chat_id: chat, message_id: wait.message_id, text: `⏳ גוגל עמוס כרגע, מנסה שוב (${n}/${total})…` }).catch(() => {});
  let ex;
  if (audio) {
    const { bytes } = await downloadFile(audio.file_id);
    const mime = audio.mime_type && audio.mime_type !== "audio/opus" ? audio.mime_type : "audio/ogg";
    ex = await extractReview({ audio: bytes, mediaType: mime }, busy);
  } else if (m.photo?.length || imageDoc) {
    const fileId = imageDoc?.file_id ?? m.photo![m.photo!.length - 1].file_id;
    const { bytes, path } = await downloadFile(fileId);
    const mediaType = path.endsWith(".png") ? "image/png" : path.endsWith(".webp") ? "image/webp" : "image/jpeg";
    ex = await extractReview({ image: bytes, mediaType }, busy);
  } else if (m.text || m.caption) {
    ex = await extractReview({ text: (m.text ?? m.caption)! }, busy);
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
  await pin(chat, wait.message_id);
}

/**
 * The draft waiting for approval is pinned in the chat: that's how the bot (which keeps no database)
 * finds it when names / venue arrive without Reply. Publishing or cancelling unpins it.
 */
async function openDraft(chat: number): Promise<TgMessage | null> {
  const c = await tg<{ pinned_message?: TgMessage }>("getChat", { chat_id: chat }).catch(() => null);
  const p = c?.pinned_message;
  return p && isDraft(p.text) ? p : null;
}
const pin = (chat: number, id: number) => tg("pinChatMessage", { chat_id: chat, message_id: id, disable_notification: true }).catch(() => {});
const unpin = (chat: number, id: number) => tg("unpinChatMessage", { chat_id: chat, message_id: id }).catch(() => {});

/** /status: what Telegram says about the webhook (delays and failed deliveries show up here). */
async function sendStatus(chat: number) {
  const w = await tg<{ url: string; pending_update_count: number; last_error_date?: number; last_error_message?: string }>("getWebhookInfo", {});
  const when = (t?: number) => (t ? new Date(t * 1000).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }) : "—");
  await say(chat, [
    "🔧 מצב הבוט",
    `כתובת: ${w.url || "—"}`,
    `הודעות שממתינות: ${w.pending_update_count}`,
    `שגיאה אחרונה: ${w.last_error_message ? `${w.last_error_message} (${when(w.last_error_date)})` : "אין"}`,
    `Gemini: ${process.env.GEMINI_MODEL || "gemini-3.6-flash"}${process.env.GEMINI_API_KEY ? "" : " (חסר GEMINI_API_KEY!)"}`,
  ].join("\n"));
}

/** A reply to a draft (or names / venue right after it) fixes its name / venue / quote in place. */
async function onReply(m: TgMessage, draftMsg: TgMessage) {
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
      return void (await tg("editMessageReplyMarkup", { chat_id: chat, message_id: id, reply_markup: reviewButtons(data.slice(4)) }));
    }
    if (data.startsWith("ask:")) {
      await ack();
      const { readFile } = await import("@/lib/bot/github");
      const all = JSON.parse((await readFile(REVIEWS)).text) as Review[];
      const r = all.find((x) => x.id === data.slice(4));
      if (!r) return void (await say(chat, "ההמלצה הזאת כבר לא באתר."));
      return void (await sendReviewAsk(chat, r));
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
      await unpin(chat, id);
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
      await unpin(chat, id);
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
      await edit(`✅ פורסם! יופיע באתר תוך 1–2 דקות\nkolotband.co.il/reviews/\n\n${d.quote}\n— ${who}`, keyboard([[{ text: "🗑 הסרה מהאתר", callback_data: `rm:${rid}` }]]));
      return void (await sendReviewAsk(chat, review));
    }
    await ack();
  } catch (e) {
    await ack("שגיאה");
    await say(chat, `⚠️ משהו השתבש: ${(e as Error).message}`);
  }
}

const reviewButtons = (rid: string) =>
  keyboard([[{ text: "📲 בקשה לגוגל", callback_data: `ask:${rid}` }, { text: "🗑 הסרה מהאתר", callback_data: `rm:${rid}` }]]);

/** The latest reviews on the site, each with a remove button. Reads GitHub so it's always current. */
async function listRecent(chat: number) {
  const { readFile } = await import("@/lib/bot/github");
  const all = JSON.parse((await readFile(REVIEWS)).text) as Review[];
  await say(chat, `באתר יש ${all.length} המלצות. האחרונות:`);
  for (const r of all.slice(0, 6)) {
    const who = r.name ? `${r.name}${r.venue ? ` · ${r.venue}` : ""}` : "אנונימי";
    const quote = r.quote.length > 280 ? `${r.quote.slice(0, 280)}…` : r.quote;
    await say(chat, `${quote}\n— ${who}${r.pinned ? " 📌" : ""}${r.audio ? " 🎙" : ""}`, { reply_markup: reviewButtons(r.id) });
  }
}
