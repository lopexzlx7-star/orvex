import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, ExecutionStatusBadge, Notice } from "@/components/ui";
import { formatDateTime, formatDuration } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { Execution } from "@/lib/types";

export const metadata: Metadata = { title: "Execução" };

const SOURCE_LABELS = { manual: "Manual", webhook: "Webhook", n8n: "Iniciada pelo n8n" } as const;

function Json({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <p className="text-sm text-fg-3">Sem dados.</p>;
  return (
    <pre className="max-h-96 overflow-auto rounded-xl border border-line bg-line/40 p-4 font-mono text-xs leading-relaxed">
      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default async function ExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await getSession();
  const { data: e } = await supabase
    .from("executions")
    .select("*, automations(id, name)")
    .eq("id", id)
    .maybeSingle<Execution & { automations: { id: string; name: string } | null }>();
  if (!e) notFound();

  const items: [string, React.ReactNode][] = [
    ["Início", formatDateTime(e.started_at, profile.timezone)],
    ["Fim", formatDateTime(e.finished_at, profile.timezone)],
    ["Duração", formatDuration(e.duration_ms)],
    ["Origem", SOURCE_LABELS[e.trigger_source]],
    ["ID no n8n", e.n8n_execution_id ?? "—"],
    ["Chave de idempotência", <code key="k" className="break-all font-mono text-xs">{e.idempotency_key}</code>],
  ];

  return (
    <>
      <Link href="/execucoes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Execuções
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
          {e.automations ? (
            <Link href={`/automacoes/${e.automations.id}`} className="hover:underline">
              {e.automations.name}
            </Link>
          ) : (
            "Automação removida"
          )}
        </h1>
        <ExecutionStatusBadge status={e.status} />
      </div>

      {e.error_message && (
        <div className="mb-5">
          <Notice tone="err">{e.error_message}</Notice>
        </div>
      )}
      {e.status === "running" && (
        <div className="mb-5">
          <Notice tone="accent">Aguardando o n8n concluir o workflow. Atualize a página para ver o resultado.</Notice>
        </div>
      )}

      <Card className="mb-5">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([label, value]) => (
            <div key={label}>
              <dt className="mono-label">{label}</dt>
              <dd className="mt-1 text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-medium">Entrada</h2>
          <Json value={e.input} />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-medium">Resultado</h2>
          <Json value={e.output} />
        </Card>
      </div>
    </>
  );
}
