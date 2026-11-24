/** Minimal Telegram Bot API client (no library). Token: TELEGRAM_BOT_TOKEN. */

const token = () => process.env.TELEGRAM_BOT_TOKEN ?? "";

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}

/** Downloads a file the user sent (photo, voice, audio). */
export async function downloadFile(fileId: string): Promise<{ bytes: Buffer; path: string }> {
  const file = await tg<{ file_path: string }>("getFile", { file_id: fileId });
  const res = await fetch(`https://api.telegram.org/file/bot${token()}/${file.file_path}`);
  if (!res.ok) throw new Error(`Telegram file download failed: ${res.status}`);
  return { bytes: Buffer.from(await res.arrayBuffer()), path: file.file_path };
}

export type Button = { text: string; callback_data: string } | { text: string; url: string };
export const keyboard = (rows: Button[][]) => ({ inline_keyboard: rows });

export type TgMessage = {
  message_id: number;
  chat: { id: number };
  from?: { id: number; first_name?: string };
  text?: string;
  caption?: string;
  photo?: { file_id: string; width: number; height: number }[];
  voice?: { file_id: string; mime_type?: string };
  audio?: { file_id: string; mime_type?: string; file_name?: string };
  document?: { file_id: string; mime_type?: string; file_name?: string };
  reply_to_message?: TgMessage;
  pinned_message?: TgMessage;
};

export type TgUpdate = {
  message?: TgMessage;
  callback_query?: { id: string; from: { id: number }; data?: string; message?: TgMessage };
};
