import "server-only";
import { isN8nConfigured, serverEnv } from "@/lib/env";
import { triggerN8nWorkflow } from "@/lib/n8n";
import { createAdminClient } from "@/lib/supabase/server";
import type { Automation, Execution, ExecutionSource } from "@/lib/types";

export type RunResult =
  | { ok: true; duplicate: boolean; execution: Execution }
  | { ok: false; error: string; execution?: Execution };

const MAX_STORED_OUTPUT = 20_000;

function truncateOutput(value: unknown): unknown {
  if (value === undefined) return null;
  const json = JSON.stringify(value);
  if (json && json.length > MAX_STORED_OUTPUT) {
    return { truncated: true, preview: json.slice(0, MAX_STORED_OUTPUT) };
  }
  return value;
}

export function runBlocker(automation: Pick<Automation, "status" | "n8n_webhook_path">): string | null {
  if (automation.status === "paused") return "A automação está pausada. Ative-a para executar.";
  if (!isN8nConfigured()) return "Configure a conexão com o n8n em Integrações antes de executar.";
  if (!automation.n8n_webhook_path) return "Informe o caminho do webhook do workflow no n8n.";
  if (!serverEnv.supabaseServiceRoleKey) return "SUPABASE_SERVICE_ROLE_KEY não configurada no servidor.";
  return null;
}

export async function runAutomation(params: {
  automation: Automation;
  source: Exclude<ExecutionSource, "n8n">;
  idempotencyKey: string;
  input: unknown;
}): Promise<RunResult> {
  const { automation, source, idempotencyKey, input } = params;
  const blocker = runBlocker(automation);
  if (blocker) return { ok: false, error: blocker };

  const admin = createAdminClient();
  const { data: created, error: insertError } = await admin
    .from("executions")
    .insert({
      user_id: automation.user_id,
      automation_id: automation.id,
      trigger_source: source,
      idempotency_key: idempotencyKey,
      status: "running",
      input: truncateOutput(input),
    })
    .select()
    .single<Execution>();

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: existing } = await admin
        .from("executions")
        .select()
        .eq("automation_id", automation.id)
        .eq("idempotency_key", idempotencyKey)
        .single<Execution>();
      if (existing) return { ok: true, duplicate: true, execution: existing };
    }
    return { ok: false, error: "Não foi possível registrar a execução." };
  }

  const startedAt = Date.parse(created.started_at);
  const result = await triggerN8nWorkflow(automation.n8n_webhook_path!, {
    execution_id: created.id,
    automation_id: automation.id,
    idempotency_key: idempotencyKey,
    trigger: source,
    wait_for_callback: automation.wait_for_callback,
    callback_url: `${serverEnv.appUrl}/api/n8n/callback`,
    automation: {
      name: automation.name,
      source_app: automation.source_app,
      actions: automation.actions,
      config: automation.config,
    },
    payload: input,
  });

  if (!result.ok) {
    const { data: failed } = await admin
      .from("executions")
      .update({
        status: "error",
        error_message: result.error,
        finished_at: new Date().toISOString(),
        duration_ms: Date.now() - startedAt,
      })
      .eq("id", created.id)
      .select()
      .single<Execution>();
    await admin.from("automations").update({ status: "error", last_error: result.error }).eq("id", automation.id);
    return { ok: false, error: result.error, execution: failed ?? created };
  }

  if (automation.wait_for_callback) {
    const { data: running } = await admin
      .from("executions")
      .update({ output: truncateOutput(result.body) })
      .eq("id", created.id)
      .eq("status", "running")
      .select()
      .maybeSingle<Execution>();
    return { ok: true, duplicate: false, execution: running ?? created };
  }

  const { data: done } = await admin
    .from("executions")
    .update({
      status: "success",
      output: truncateOutput(result.body),
      finished_at: new Date().toISOString(),
      duration_ms: Date.now() - startedAt,
    })
    .eq("id", created.id)
    .select()
    .single<Execution>();
  if (automation.status === "error") {
    await admin.from("automations").update({ status: "active", last_error: null }).eq("id", automation.id);
  }
  return { ok: true, duplicate: false, execution: done ?? created };
}

export { truncateOutput };
