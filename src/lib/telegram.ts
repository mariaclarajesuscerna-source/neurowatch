const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "";

interface TelegramAlertPayload {
  chatId: string;
  message: string;
}

export async function sendTelegramAlert({
  chatId,
  message,
}: TelegramAlertPayload): Promise<{ ok: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    return { ok: false, error: "Token de Telegram no configurado." };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return { ok: false, error: data.description || "Error al enviar alerta." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red al enviar alerta." };
  }
}
