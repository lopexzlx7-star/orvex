import "server-only";
import { isN8nConfigured, serverEnv } from "@/lib/env";

export interface N8nTriggerPayload {
  execution_id: string;
  automation_id: string;
  idempotency_key: string;
  trigger: string;
  wait_for_callback: boolean;
  callback_url: string;
  automation: {
    name: string;
    source_app: string;
    actions: string[];
    config: Record<string, string>;
  };
  payload: unknown;
}

export type N8nTriggerResult =
  | { ok: true; status: number; body: unknown }
  | { ok: false; status?: number; error: string };

const TIMEOUT_MS = 30_000;

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text.slice(0, 4000);
  }
}

export async function triggerN8nWorkflow(webhookPath: string, payload: N8nTriggerPayload): Promise<N8nTriggerResult> {
  if (!isN8nConfigured()) {
    return { ok: false, error: "n8n não configurado (N8N_BASE_URL e N8N_WEBHOOK_SECRET)." };
  }
  const url = `${serverEnv.n8nBaseUrl}/webhook/${webhookPath.replace(/^\/+/, "")}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-orvex-secret": serverEnv.n8nWebhookSecret!,
        "x-idempotency-key": payload.idempotency_key,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const body = await readBody(res);
    if (!res.ok) {
      const detail = typeof body === "object" && body && "message" in body ? String((body as { message: unknown }).message) : "";
      return {
        ok: false,
        status: res.status,
        error: res.status === 404
          ? `Workflow não encontrado no n8n (404). Verifique se o caminho "${webhookPath}" existe e se o workflow está ativo.`
          : `n8n respondeu ${res.status}${detail ? `: ${detail}` : ""}.`,
      };
    }
    return { ok: true, status: res.status, body };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    return {
      ok: false,
      error: name === "TimeoutError" ? "Tempo de resposta do n8n esgotado (30s)." : "Não foi possível conectar ao n8n.",
    };
  }
}

export type HealthResult = { state: "not_configured" } | { state: "connected"; detail: string } | { state: "error"; detail: string };

export async function checkN8nHealth(): Promise<HealthResult> {
  if (!serverEnv.n8nBaseUrl) return { state: "not_configured" };
  try {
    const res = await fetch(`${serverEnv.n8nBaseUrl}/healthz`, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!res.ok) return { state: "error", detail: `Health check respondeu ${res.status}.` };
  } catch {
    return { state: "error", detail: `Não foi possível alcançar ${serverEnv.n8nBaseUrl}.` };
  }
  if (!serverEnv.n8nWebhookSecret) {
    return { state: "error", detail: "Servidor alcançável, mas N8N_WEBHOOK_SECRET não está definido." };
  }
  if (!serverEnv.n8nApiKey) {
    return { state: "connected", detail: "Servidor online. API key não configurada (opcional)." };
  }
  try {
    const res = await fetch(`${serverEnv.n8nBaseUrl}/api/v1/workflows?limit=1`, {
      headers: { "X-N8N-API-KEY": serverEnv.n8nApiKey },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) return { state: "error", detail: "Servidor online, mas a API key foi recusada." };
    if (!res.ok) return { state: "error", detail: `API do n8n respondeu ${res.status}.` };
    return { state: "connected", detail: "Servidor online e API key válida." };
  } catch {
    return { state: "error", detail: "Servidor online, mas a API do n8n não respondeu." };
  }
}

export async function checkAiProvider(): Promise<HealthResult> {
  const { aiApiKey, aiProvider, aiBaseUrl } = serverEnv;
  if (!aiApiKey) return { state: "not_configured" };
  const isAnthropic = aiProvider === "anthropic";
  const base = aiBaseUrl ?? (isAnthropic ? "https://api.anthropic.com/v1" : "https://api.openai.com/v1");
  const headers: Record<string, string> = isAnthropic
    ? { "x-api-key": aiApiKey, "anthropic-version": "2023-06-01" }
    : { authorization: `Bearer ${aiApiKey}` };
  try {
    const res = await fetch(`${base}/models`, { headers, signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (res.status === 401 || res.status === 403) return { state: "error", detail: "Chave de API recusada pelo provedor." };
    if (!res.ok) return { state: "error", detail: `Provedor respondeu ${res.status}.` };
    return { state: "connected", detail: `Chave válida (${aiProvider}).` };
  } catch {
    return { state: "error", detail: "Não foi possível alcançar o provedor de IA." };
  }
}
