import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2, Pause, Play, Plus, Workflow } from "lucide-react";
import { ButtonLink, Card, EmptyState, ExecutionStatusBadge, Notice } from "@/components/ui";
import { isN8nConfigured } from "@/lib/env";
import { formatDuration, formatRelative, greeting } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { Automation, Execution } from "@/lib/types";

type RecentExecution = Pick<Execution, "id" | "status" | "started_at" | "duration_ms" | "error_message" | "trigger_source"> & {
  automations: { name: string } | null;
};

function Stat({ label, value, hint, icon: Icon }: { label: string; value: string; hint?: string; icon: typeof Activity }) {
  return (
    <Card className="!p-5">
      <div className="flex items-center justify-between">
        <span className="mono-label">{label}</span>
        <Icon className="h-4 w-4 text-fg-3" strokeWidth={1.7} />
      </div>
      <p className="mt-3 text-[28px] font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-fg-3">{hint}</p>}
    </Card>
  );
}

export default async function DashboardPage() {
  const { supabase, profile } = await getSession();

  const [{ data: automations }, total, success, failed, { data: recent }] = await Promise.all([
    supabase.from("automations").select("id, status").returns<Pick<Automation, "id" | "status">[]>(),
    supabase.from("executions").select("id", { count: "exact", head: true }),
    supabase.from("executions").select("id", { count: "exact", head: true }).eq("status", "success"),
    supabase.from("executions").select("id", { count: "exact", head: true }).eq("status", "error"),
    supabase
      .from("executions")
      .select("id, status, started_at, duration_ms, error_message, trigger_source, automations(name)")
      .order("started_at", { ascending: false })
      .limit(8)
      .returns<RecentExecution[]>(),
  ]);

  const list = automations ?? [];
  const active = list.filter((a) => a.status === "active").length;
  const paused = list.filter((a) => a.status === "paused").length;
  const withError = list.filter((a) => a.status === "error").length;
  const finished = (success.count ?? 0) + (failed.count ?? 0);
  const rate = finished > 0 ? `${Math.round(((success.count ?? 0) / finished) * 1000) / 10}%` : "—";
  const firstName = profile.full_name.split(" ")[0];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-label">{profile.agency_name || "Sua agência"}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">
            {greeting(profile.timezone)}
            {firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="mt-1.5 text-sm text-fg-2">
            {list.length === 0
              ? "Você ainda não tem automações. Comece por um modelo ou crie do zero."
              : `${active} de ${list.length} automaç${list.length === 1 ? "ão" : "ões"} ativa${active === 1 ? "" : "s"}${withError ? ` · ${withError} com erro` : ""}.`}
          </p>
        </div>
        <ButtonLink href="/automacoes/nova">
          <Plus className="h-4 w-4" /> Criar automação
        </ButtonLink>
      </div>

      {!isN8nConfigured() && (
        <div className="mb-6">
          <Notice tone="warn">
            O n8n ainda não está conectado, então nenhuma automação pode ser executada.{" "}
            <Link href="/integracoes" className="font-medium underline underline-offset-4">
              Configurar integração
            </Link>
          </Notice>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Fluxos" value={String(list.length)} hint="cadastrados" icon={Workflow} />
        <Stat label="Ativos / pausados" value={`${active} / ${paused}`} hint={withError ? `${withError} com erro` : "nenhum com erro"} icon={active ? Play : Pause} />
        <Stat label="Execuções" value={String(total.count ?? 0)} hint="no total" icon={Activity} />
        <Stat label="Taxa de sucesso" value={rate} hint={finished ? `${success.count} de ${finished} concluídas` : "sem execuções concluídas"} icon={CheckCircle2} />
      </div>

      <Card className="mt-6 !p-0">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-sm font-medium">Atividade recente</h2>
          {(recent?.length ?? 0) > 0 && (
            <Link href="/execucoes" className="inline-flex items-center gap-1 text-xs text-fg-2 hover:text-fg">
              Ver histórico <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        {!recent || recent.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Nenhuma execução ainda"
            description={
              list.length === 0
                ? "Crie sua primeira automação e conecte-a a um workflow do n8n para ver a atividade aqui."
                : "Quando suas automações forem executadas, os resultados aparecerão aqui."
            }
            action={
              list.length === 0 ? (
                <ButtonLink href="/automacoes/nova" variant="secondary">
                  Criar automação
                </ButtonLink>
              ) : undefined
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((e) => (
              <li key={e.id}>
                <Link href={`/execucoes/${e.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-line/50 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.automations?.name ?? "Automação removida"}</p>
                    <p className="truncate text-xs text-fg-3">
                      {e.error_message ?? `${formatRelative(e.started_at)} · ${formatDuration(e.duration_ms)}`}
                    </p>
                  </div>
                  <ExecutionStatusBadge status={e.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
