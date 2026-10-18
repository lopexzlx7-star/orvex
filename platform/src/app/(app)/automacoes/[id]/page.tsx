import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft } from "lucide-react";
import { AutomationActions } from "@/components/automation-actions";
import { CopyField } from "@/components/copy-field";
import { RunButton } from "@/components/run-button";
import { AutomationStatusBadge, Card, EmptyState, ExecutionStatusBadge, Notice } from "@/components/ui";
import { serverEnv } from "@/lib/env";
import { runBlocker } from "@/lib/executions";
import { formatDateTime, formatDuration } from "@/lib/format";
import { getSession } from "@/lib/session";
import { TEMPLATES, TRIGGER_HINTS, TRIGGER_LABELS } from "@/lib/templates";
import type { Automation, Execution } from "@/lib/types";

export const metadata: Metadata = { title: "Automação" };

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mono-label">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

export default async function AutomationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { id } = await params;
  const { aviso } = await searchParams;
  const { supabase, profile } = await getSession();
  const { data: a } = await supabase.from("automations").select("*").eq("id", id).maybeSingle<Automation>();
  if (!a) notFound();

  const { data: executions } = await supabase
    .from("executions")
    .select("id, status, started_at, duration_ms, error_message, trigger_source")
    .eq("automation_id", a.id)
    .order("started_at", { ascending: false })
    .limit(10)
    .returns<Execution[]>();

  const template = TEMPLATES.find((t) => t.id === a.template);
  const blocker = runBlocker(a);
  const configEntries = Object.entries(a.config);

  return (
    <>
      <Link href="/automacoes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Automações
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{a.name}</h1>
            <AutomationStatusBadge status={a.status} />
          </div>
          <p className="mt-1.5 max-w-2xl text-sm text-fg-2">{a.description || "Sem descrição."}</p>
        </div>
        <AutomationActions id={a.id} name={a.name} status={a.status} showView={false} />
      </div>

      {aviso === "ativacao" && (
        <div className="mb-5">
          <Notice tone="warn">
            Não foi possível ativar: configure o n8n em Integrações e informe o caminho do webhook do workflow.
          </Notice>
        </div>
      )}
      {a.status === "error" && a.last_error && (
        <div className="mb-5">
          <Notice tone="err">Última falha: {a.last_error}</Notice>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="grid content-start gap-5">
          <Card>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Detail label="Gatilho">
                {TRIGGER_LABELS[a.trigger_type]}
                <span className="hint block">{TRIGGER_HINTS[a.trigger_type]}</span>
              </Detail>
              <Detail label="Origem">{a.source_app || "—"}</Detail>
              <Detail label="Execuções">{a.run_count}</Detail>
              <Detail label="Última execução">{formatDateTime(a.last_run_at, profile.timezone)}</Detail>
              <Detail label="Modelo">{template?.name ?? "Em branco"}</Detail>
              <Detail label="Workflow n8n">
                {a.n8n_webhook_path ? <code className="font-mono text-xs">/webhook/{a.n8n_webhook_path}</code> : "Não configurado"}
              </Detail>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-4 text-sm font-medium">Ações</h2>
            {a.actions.length === 0 ? (
              <p className="text-sm text-fg-3">Nenhuma ação descrita.</p>
            ) : (
              <ol className="grid gap-2">
                {a.actions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 shrink-0 text-center font-mono text-xs leading-5 text-fg-3">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            )}
            {configEntries.length > 0 && (
              <>
                <h3 className="mb-3 mt-6 text-sm font-medium">Configurações</h3>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {configEntries.map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-line px-3 py-2">
                      <dt className="font-mono text-xs text-fg-3">{k}</dt>
                      <dd className="mt-0.5 break-words text-sm">{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </Card>

          <Card className="!p-0">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <h2 className="text-sm font-medium">Execuções recentes</h2>
              {(executions?.length ?? 0) > 0 && (
                <Link href={`/execucoes?automacao=${a.id}`} className="text-xs text-fg-2 hover:text-fg">
                  Ver todas
                </Link>
              )}
            </div>
            {!executions || executions.length === 0 ? (
              <EmptyState icon={Activity} title="Sem execuções" description="Execute manualmente ou aguarde o gatilho configurado." />
            ) : (
              <ul className="divide-y divide-line">
                {executions.map((e) => (
                  <li key={e.id}>
                    <Link href={`/execucoes/${e.id}`} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-line/50 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">{formatDateTime(e.started_at, profile.timezone)}</p>
                        <p className="truncate text-xs text-fg-3">{e.error_message ?? formatDuration(e.duration_ms)}</p>
                      </div>
                      <ExecutionStatusBadge status={e.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="grid content-start gap-5">
          <Card>
            <h2 className="mb-4 text-sm font-medium">Executar</h2>
            <RunButton id={a.id} blocker={blocker} />
          </Card>
          {a.trigger_type === "webhook" && (
            <Card>
              <h2 className="mb-1 text-sm font-medium">URL de webhook</h2>
              <p className="mb-4 text-xs text-fg-3">
                Sistemas externos fazem <code className="font-mono">POST</code> nesta URL. Envie o cabeçalho{" "}
                <code className="font-mono">Idempotency-Key</code> para evitar execuções duplicadas.
              </p>
              <CopyField label="URL de webhook" value={`${serverEnv.appUrl}/api/hooks/${a.webhook_token}`} />
              <p className="mt-3 text-xs text-fg-3">Mantenha esta URL em sigilo: ela funciona como uma senha.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
