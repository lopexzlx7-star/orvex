import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Workflow } from "lucide-react";
import { AutomationActions } from "@/components/automation-actions";
import { AutomationStatusBadge, ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { formatRelative } from "@/lib/format";
import { getSession } from "@/lib/session";
import { TRIGGER_LABELS } from "@/lib/templates";
import type { Automation } from "@/lib/types";

export const metadata: Metadata = { title: "Automações" };

export default async function AutomationsPage() {
  const { supabase } = await getSession();
  const { data } = await supabase
    .from("automations")
    .select("id, name, description, status, trigger_type, last_run_at, run_count, last_error")
    .order("created_at", { ascending: false })
    .returns<Automation[]>();
  const automations = data ?? [];

  return (
    <>
      <PageHeader
        title="Automações"
        description="Gerencie os fluxos da sua agência. Cada automação aponta para um workflow do n8n."
        actions={
          <ButtonLink href="/automacoes/nova">
            <Plus className="h-4 w-4" /> Nova automação
          </ButtonLink>
        }
      />

      {automations.length === 0 ? (
        <Card>
          <EmptyState
            icon={Workflow}
            title="Nenhuma automação cadastrada"
            description="Use um modelo de atendimento, leads, follow-up ou notificações como ponto de partida."
            action={<ButtonLink href="/automacoes/nova">Criar primeira automação</ButtonLink>}
          />
        </Card>
      ) : (
        <div className="grid gap-3">
          {automations.map((a) => (
            <Card key={a.id} className="!p-5 transition-shadow hover:shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Link href={`/automacoes/${a.id}`} className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-[15px] font-medium">{a.name}</h2>
                    <AutomationStatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-fg-2">{a.description || "Sem descrição."}</p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-3">
                    <span>{TRIGGER_LABELS[a.trigger_type]}</span>
                    <span>Última execução: {formatRelative(a.last_run_at)}</span>
                    <span>
                      {a.run_count} execuç{a.run_count === 1 ? "ão" : "ões"}
                    </span>
                  </p>
                  {a.status === "error" && a.last_error && <p className="mt-2 line-clamp-1 text-xs text-err">{a.last_error}</p>}
                </Link>
                <AutomationActions id={a.id} name={a.name} status={a.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
