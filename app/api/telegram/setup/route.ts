import { tg } from "@/lib/bot/telegram";

/**
 * One-time: points Telegram at this site's webhook. Call with header x-setup-key: TELEGRAM_WEBHOOK_SECRET
 * (POST /api/telegram/setup/). Safe to call again after changing the token or the domain.
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-setup-key") !== secret) return new Response("forbidden", { status: 403 });
  const origin = new URL(req.url).origin;
  const webhook = await tg("setWebhook", {
    url: `${origin}/api/telegram/`,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
  await tg("setMyCommands", {
    commands: [
      { command: "list", description: "ההמלצות האחרונות באתר" },
      { command: "help", description: "איך שולחים המלצה" },
    ],
  });
  const info = await tg("getWebhookInfo", {});
  return Response.json({ webhook, info });
}
