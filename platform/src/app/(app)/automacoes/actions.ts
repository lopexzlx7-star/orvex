"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isN8nConfigured } from "@/lib/env";
import { runAutomation } from "@/lib/executions";
import { createClient } from "@/lib/supabase/server";
import type { Automation, TriggerType } from "@/lib/types";
import { automationSchema, firstError, type AutomationInput } from "@/lib/validation";

export type FormState = { error?: string } | undefined;
export type RunState = { ok?: boolean; message?: string; executionId?: string } | undefined;

function parseForm(formData: FormData) {
  const actions = formData
    .getAll("actions")
    .map((v) => String(v).trim())
    .filter(Boolean);
  const keys = formData.getAll("config_key").map((v) => String(v).trim());
  const values = formData.getAll("config_value").map((v) => String(v));
  const config: Record<string, string> = {};
  keys.forEach((k, i) => {
    if (k) config[k] = values[i] ?? "";
  });
  const path = String(formData.get("n8n_webhook_path") ?? "").trim().replace(/^\/+/, "");
  const template = String(formData.get("template") ?? "").trim();
  return automationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    template: template || null,
    trigger_type: formData.get("trigger_type"),
    source_app: formData.get("source_app") ?? "",
    actions,
    config,
    n8n_webhook_path: path || null,
    wait_for_callback: formData.get("wait_for_callback") === "on",
    status: formData.get("activate") === "on" ? "active" : "paused",
  });
}

function activationBlocker(input: { trigger_type: TriggerType; n8n_webhook_path: string | null }) {
  if (!isN8nConfigured()) return "Para ativar, configure primeiro a conexão com o n8n em Integrações.";
  if ((input.trigger_type === "manual" || input.trigger_type === "webhook") && !input.n8n_webhook_path) {
    return "Para ativar, informe o caminho do webhook do workflow no n8n.";
  }
  return null;
}

function validated(formData: FormData): { data: AutomationInput } | { error: string } {
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };
  if (parsed.data.status === "active") {
    const blocker = activationBlocker(parsed.data);
    if (blocker) return { error: blocker };
  }
  return { data: parsed.data };
}

export async function createAutomation(_: FormState, formData: FormData): Promise<FormState> {
  const result = validated(formData);
  if ("error" in result) return { error: result.error };
  const supabase = await createClient();
  const { data, error } = await supabase.from("automations").insert(result.data).select("id").single();
  if (error || !data) return { error: "Não foi possível salvar a automação." };
  revalidatePath("/", "layout");
  redirect(`/automacoes/${data.id}`);
}

export async function updateAutomation(id: string, _: FormState, formData: FormData): Promise<FormState> {
  const result = validated(formData);
  if ("error" in result) return { error: result.error };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("automations")
    .update({ ...result.data, last_error: result.data.status === "active" ? null : undefined })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) return { error: "Não foi possível salvar as alterações." };
  if (!data) return { error: "Automação não encontrada." };
  revalidatePath("/", "layout");
  redirect(`/automacoes/${id}`);
}

export async function setAutomationStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = formData.get("status") === "active" ? "active" : "paused";
  const supabase = await createClient();
  const { data: automation } = await supabase
    .from("automations")
    .select("trigger_type, n8n_webhook_path")
    .eq("id", id)
    .maybeSingle<Pick<Automation, "trigger_type" | "n8n_webhook_path">>();
  if (!automation) return;
  if (status === "active" && activationBlocker(automation)) {
    redirect(`/automacoes/${id}?aviso=ativacao`);
  }
  await supabase.from("automations").update({ status, last_error: null }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deleteAutomation(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("automations").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/automacoes");
}

export async function runNow(_: RunState, formData: FormData): Promise<RunState> {
  const id = String(formData.get("id"));
  const rawKey = String(formData.get("idempotency_key") ?? "");
  const idempotencyKey = /^[A-Za-z0-9:_-]{8,100}$/.test(rawKey) ? `manual:${rawKey}` : `manual:${randomUUID()}`;
  const supabase = await createClient();
  const { data: automation } = await supabase.from("automations").select("*").eq("id", id).maybeSingle<Automation>();
  if (!automation) return { ok: false, message: "Automação não encontrada." };

  const result = await runAutomation({ automation, source: "manual", idempotencyKey, input: { triggered_by: "manual" } });
  revalidatePath("/", "layout");
  if (!result.ok) return { ok: false, message: result.error, executionId: result.execution?.id };
  if (result.duplicate) return { ok: true, message: "Esta solicitação já foi processada.", executionId: result.execution.id };
  return {
    ok: true,
    message:
      result.execution.status === "running"
        ? "Execução enviada ao n8n. O resultado aparecerá quando o workflow responder."
        : "Execução concluída com sucesso.",
    executionId: result.execution.id,
  };
}
