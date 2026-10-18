import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { runAutomation } from "@/lib/executions";
import { readJsonLimited } from "@/lib/secure";
import { createAdminClient } from "@/lib/supabase/server";
import type { Automation } from "@/lib/types";

// Webhook público de entrada: o token identifica a automação e funciona como segredo.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/.test(token)) return NextResponse.json({ error: "Webhook não encontrado." }, { status: 404 });
  if (!serverEnv.supabaseServiceRoleKey) {
    return NextResponse.json({ error: "Webhook indisponível." }, { status: 503 });
  }

  const admin = createAdminClient();
  const { data: automation } = await admin.from("automations").select("*").eq("webhook_token", token).maybeSingle<Automation>();
  if (!automation || automation.trigger_type !== "webhook") {
    return NextResponse.json({ error: "Webhook não encontrado." }, { status: 404 });
  }
  if (automation.status === "paused") {
    return NextResponse.json({ error: "Automação pausada." }, { status: 409 });
  }

  const body = await readJsonLimited(request);
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: body.status });

  const rawKey = request.headers.get("idempotency-key") ?? request.headers.get("x-idempotency-key");
  const idempotencyKey = rawKey && /^[A-Za-z0-9:_.-]{1,150}$/.test(rawKey) ? `webhook:${rawKey}` : `webhook:${randomUUID()}`;

  const result = await runAutomation({ automation, source: "webhook", idempotencyKey, input: body.value });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, execution_id: result.execution?.id },
      { status: result.execution ? 502 : 409 },
    );
  }
  return NextResponse.json(
    { ok: true, duplicate: result.duplicate, execution_id: result.execution.id, status: result.execution.status },
    { status: result.duplicate ? 200 : 202 },
  );
}
