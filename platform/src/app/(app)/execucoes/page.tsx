import type { Metadata } from "next";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Card, EmptyState, ExecutionStatusBadge, PageHeader } from "@/components/ui";
import { formatDateTime, formatDuration } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { Automation, Execution, ExecutionStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Execuções" };

const PAGE_SIZE = 25;
const STATUSES: { value: ExecutionStatus; label: string }[] = [
  { value: "success", label: "Sucesso" },
  { value: "error", label: "Erro" },
  { value: "running", label: "Em execução" },
  { value: "pending", label: "Pendente" },
];
const SOURCE_LABELS = { manual: "Manual", webhook: "Webhook", n8n: "n8n" } as const;

type Row = Pick<Execution, "id" | "status" | "started_at" | "duration_ms" | "error_message" | "trigger_source"> & {
  automations: { name: string } | null;
};

export default async function ExecutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; automacao?: string; pagina?: string }>;
}) {
  const sp = await searchParams;
  const { supabase, profile } = await getSession();
  const status = STATUSES.some((s) => s.value === sp.status) ? (sp.status as ExecutionStatus) : undefined;
  const automationId = sp.automacao && /^[0-9a-f-]{36}$/i.test(sp.automacao) ? sp.automacao : undefined;
  const page = Math.max(1, Number.parseInt(sp.pagina ?? "1", 10) || 1);

  let query = supabase
    .from("executions")
    .select("id, status, started_at, duration_ms, error_message, trigger_source, automations(name)", { count: "exact" })
    .order("started_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  if (automationId) query = query.eq("automation_id", automationId);

  const [{ data, count, error }, { data: automations }] = await Promise.all([
    query.returns<Row[]>(),
    supabase.from("automations").select("id, name").order("name").returns<Pick<Automation, "id" | "name">[]>(),
  ]);
  const rows = data ?? [];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(status || automationId);

  const href = (p: number) => {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (automationId) q.set("automacao", automationId);
    if (p > 1) q.set("pagina", String(p));
    const s = q.toString();
    return `/execucoes${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Histórico de execuções" description="Todas as execuções registradas das suas automações." />

      <Card className="mb-4 !p-4">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-48">
            <label className="label" htmlFor="status">
              Status
            </label>
            <select id="status" name="status" className="input" defaultValue={status ?? ""}>
              <option value="">Todos</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-72">
            <label className="label" htmlFor="automacao">
              Automação
            </label>
            <select id="automacao" name="automacao" className="input" defaultValue={automationId ?? ""}>
              <option value="">Todas</option>
              {(automations ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-secondary">
              Filtrar
            </button>
            {filtered && (
              <Link href="/execucoes" className="btn btn-ghost">
                Limpar
              </Link>
            )}
          </div>
        </form>
      </Card>

      <Card className="!p-0">
        {error ? (
          <p className="p-6 text-sm text-err">Não foi possível carregar as execuções. Tente novamente.</p>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Activity}
            title={filtered ? "Nenhuma execução encontrada" : "Nenhuma execução registrada"}
            description={
              filtered ? "Ajuste ou limpe os filtros para ver outros resultados." : "As execuções aparecem aqui assim que uma automação rodar."
            }
          />
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="mono-label px-6 py-3 font-normal">Fluxo</th>
                    <th className="mono-label px-4 py-3 font-normal">Data e horário</th>
                    <th className="mono-label px-4 py-3 font-normal">Origem</th>
                    <th className="mono-label px-4 py-3 font-normal">Duração</th>
                    <th className="mono-label px-6 py-3 text-right font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((e) => (
                    <tr key={e.id} className="group transition-colors hover:bg-line/50">
                      <td className="max-w-xs px-6 py-3.5">
                        <Link href={`/execucoes/${e.id}`} className="block truncate font-medium">
                          {e.automations?.name ?? "Automação removida"}
                        </Link>
                        {e.error_message && <p className="truncate text-xs text-err">{e.error_message}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-fg-2">{formatDateTime(e.started_at, profile.timezone)}</td>
                      <td className="px-4 py-3.5 text-fg-2">{SOURCE_LABELS[e.trigger_source]}</td>
                      <td className="px-4 py-3.5 text-fg-2">{formatDuration(e.duration_ms)}</td>
                      <td className="px-6 py-3.5 text-right">
                        <Link href={`/execucoes/${e.id}`}>
                          <ExecutionStatusBadge status={e.status} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-line md:hidden">
              {rows.map((e) => (
                <li key={e.id}>
                  <Link href={`/execucoes/${e.id}`} className="block px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">{e.automations?.name ?? "Automação removida"}</p>
                      <ExecutionStatusBadge status={e.status} />
                    </div>
                    <p className="mt-1 text-xs text-fg-3">
                      {formatDateTime(e.started_at, profile.timezone)} · {formatDuration(e.duration_ms)}
                    </p>
                    {e.error_message && <p className="mt-1 truncate text-xs text-err">{e.error_message}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-fg-2">
          <span>
            Página {page} de {pages} · {total} execuções
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={href(page - 1)} className="btn btn-secondary btn-sm">
                Anterior
              </Link>
            )}
            {page < pages && (
              <Link href={href(page + 1)} className="btn btn-secondary btn-sm">
                Próxima
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
