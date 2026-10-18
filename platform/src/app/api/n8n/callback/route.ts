import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { truncateOutput } from "@/lib/executions";
import { readJsonLimited, safeEqual } from "@/lib/secure";
import { createAdminClient } from "@/lib/supabase/server";
import type { Automation, Execution } from "@/lib/types";
import { callbackSchema, firstError } from "@/lib/validation";

// Recebe o resultado das execuções enviado pelo n8n.
// - Com execution_id: conclui uma execução iniciada pela plataforma.
// - Com automation_id + n8n_execution_id: registra uma execução iniciada pelo próprio n8n (agendamento/evento).
export async function POST(request: Request) {
  if (!serverEnv.n8nCallbackSecret || !serverEnv.supabaseServiceRoleKey) {
    return NextResponse.json({ error: "Callback não configurado no servidor." }, { status: 503 });
  }
  if (!safeEqual(request.headers.get("x-orvex-secret"), serverEnv.n8nCallbackSecret)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await readJsonLimited(request);
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: body.status });
  const parsed = callbackSchema.safeParse(body.value);
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  const data = parsed.data;

  const admin = createAdminClient();
  let execution: Execution | null = null;

  if (data.execution_id) {
    const { data: found } = await admin.from("executions").select().eq("id", data.execution_id).maybeSingle<Execution>();
    execution = found;
    if (!execution) return NextResponse.json({ error: "Execução não encontrada." }, { status: 404 });
  } else {
    const { data: automation } = await admin
      .from("automations")
      .select("id, user_id")
      .eq("id", data.automation_id!)
      .maybeSingle<Pick<Automation, "id" | "user_id">>();
    if (!automation) return NextResponse.json({ error: "Automação não encontrada." }, { status: 404 });

    const idempotencyKey = `n8n:${data.n8n_execution_id}`;
    const { data: created, error } = await admin
      .from("executions")
      .insert({
        user_id: automation.user_id,
        automation_id: automation.id,
        trigger_source: "n8n",
        idempotency_key: idempotencyKey,
        status: "running",
        n8n_execution_id: data.n8n_execution_id,
        started_at: data.started_at ?? new Date().toISOString(),
      })
      .select()
      .single<Execution>();
    if (error && error.code !== "23505") {
      return NextResponse.json({ error: "Não foi possível registrar a execução." }, { status: 500 });
    }
    execution =
      created ??
      (
        await admin
          .from("executions")
          .select()
          .eq("automation_id", automation.id)
          .eq("idempotency_key", idempotencyKey)
          .single<Execution>()
      ).data;
  }

  if (!execution) return NextResponse.json({ error: "Execução não encontrada." }, { status: 404 });

  // Execuções já concluídas não são reprocessadas.
  if (execution.status === "success" || execution.status === "error") {
    return NextResponse.json({ ok: true, ignored: true, execution_id: execution.id, status: execution.status });
  }
  if (data.status === "running") {
    return NextResponse.json({ ok: true, execution_id: execution.id, status: execution.status });
  }

  const finishedAt = data.finished_at ? new Date(data.finished_at) : new Date();
  const { data: updated } = await admin
    .from("executions")
    .update({
      status: data.status,
      output: data.output !== undefined ? truncateOutput(data.output) : execution.output,
      error_message: data.status === "error" ? (data.error ?? "O workflow do n8n reportou um erro.") : null,
      finished_at: finishedAt.toISOString(),
      duration_ms: Math.max(0, finishedAt.getTime() - Date.parse(execution.started_at)),
      n8n_execution_id: data.n8n_execution_id ?? execution.n8n_execution_id,
    })
    .eq("id", execution.id)
    .in("status", ["pending", "running"])
    .select("id, status")
    .maybeSingle();

  if (!updated) {
    return NextResponse.json({ ok: true, ignored: true, execution_id: execution.id });
  }

  if (data.status === "error") {
    await admin
      .from("automations")
      .update({ status: "error", last_error: data.error ?? "O workflow do n8n reportou um erro." })
      .eq("id", execution.automation_id)
      .neq("status", "paused");
  } else {
    await admin.from("automations").update({ status: "active", last_error: null }).eq("id", execution.automation_id).eq("status", "error");
  }

  return NextResponse.json({ ok: true, execution_id: execution.id, status: data.status });
}
