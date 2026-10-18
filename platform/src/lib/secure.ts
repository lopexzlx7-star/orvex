import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

export function safeEqual(a: string | null | undefined, b: string | null | undefined) {
  if (!a || !b) return false;
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function readJsonLimited(request: Request, maxBytes = 256 * 1024): Promise<{ ok: true; value: unknown } | { ok: false; error: string; status: number }> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > maxBytes) return { ok: false, error: "Payload muito grande.", status: 413 };
  const text = await request.text();
  if (text.length > maxBytes) return { ok: false, error: "Payload muito grande.", status: 413 };
  if (!text.trim()) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, error: "JSON inválido.", status: 400 };
  }
}
