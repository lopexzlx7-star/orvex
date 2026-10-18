import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Globe, Server, Trash2, Webhook } from "lucide-react";
import { ApiEndpointForm } from "@/components/api-endpoint-form";
import { HealthTest } from "@/components/health-test";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, PageHeader } from "@/components/ui";
import { isN8nConfigured, serverEnv } from "@/lib/env";
import { formatRelative } from "@/lib/format";
import { checkN8nHealth } from "@/lib/n8n";
import { getSession } from "@/lib/session";
import type { ApiEndpoint } from "@/lib/types";
import { deleteApiEndpoint, testAi, testApiEndpoint, testN8n } from "./actions";

export const metadata: Metadata = { title: "Integrações" };

function Header({ icon: Icon, title, description }: { icon: typeof Bot; title: string; description: string }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
        <Icon className="h-5 w-5 text-accent" strokeWidth={1.7} />
      </div>
      <div>
        <h2 className="text-[15px] font-medium">{title}</h2>
        <p className="mt-0.5 text-sm text-fg-2">{description}</p>
      </div>
    </div>
  );
}

function EnvList({ vars }: { vars: [string, boolean, string][] }) {
  return (
    <ul className="mt-5 grid gap-1.5 rounded-xl border border-line p-3">
      {vars.map(([name, set, hint]) => (
        <li key={name} className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span>
            <code className="font-mono">{name}</code> <span className="text-fg-3">· {hint}</span>
          </span>
          <span className={set ? "text-ok" : "text-fg-3"}>{set ? "definida" : "ausente"}</span>
        </li>
      ))}
    </ul>
  );
}

const API_STATUS = {
  unknown: { label: "Não testada", tone: "neutral" },
  online: { label: "Online", tone: "ok" },
  error: { label: "Erro", tone: "err" },
} as const;

export default async function IntegrationsPage() {
  const { supabase } = await getSession();
  const [n8nHealth, { data: endpoints }, { count: webhookCount }] = await Promise.all([
    checkN8nHealth(),
    supabase.from("api_endpoints").select("*").order("created_at", { ascending: false }).returns<ApiEndpoint[]>(),
    supabase.from("automations").select("id", { count: "exact", head: true }).eq("trigger_type", "webhook"),
  ]);
  const webhooksReady = isN8nConfigured() && Boolean(serverEnv.supabaseServiceRoleKey);

  return (
    <>
      <PageHeader
        title="Integrações"
        description="O estado mostrado aqui é verificado em tempo real. Nada aparece como conectado sem estar de fato configurado."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <Header icon={Server} title="n8n" description="Motor que executa os workflows das automações." />
          <HealthTest initial={n8nHealth} test={testN8n} />
          <EnvList
            vars={[
              ["N8N_BASE_URL", Boolean(serverEnv.n8nBaseUrl), "URL da instância"],
              ["N8N_WEBHOOK_SECRET", Boolean(serverEnv.n8nWebhookSecret), "enviado no cabeçalho x-orvex-secret"],
              ["N8N_CALLBACK_SECRET", Boolean(serverEnv.n8nCallbackSecret), "exigido em /api/n8n/callback"],
              ["N8N_API_KEY", Boolean(serverEnv.n8nApiKey), "opcional, valida a API"],
            ]}
          />
          {n8nHealth.state === "not_configured" && (
            <p className="mt-4 text-xs text-fg-2">
              Defina as variáveis acima no servidor (arquivo <code className="font-mono">.env.local</code> ou painel da hospedagem) e
              reinicie a aplicação. Veja o passo a passo no README.
            </p>
          )}
        </Card>

        <Card>
          <Header icon={Webhook} title="Webhooks" description="URLs para sistemas externos dispararem automações." />
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={webhooksReady ? "ok" : "neutral"}>{webhooksReady ? "Disponível" : "Não configurado"}</Badge>
            <span className="text-xs text-fg-2">
              {webhookCount ?? 0} automaç{webhookCount === 1 ? "ão usa" : "ões usam"} gatilho de webhook
            </span>
          </div>
          <p className="mt-4 text-sm text-fg-2">
            Cada automação com gatilho “Webhook” recebe uma URL própria, exibida na página da automação. As requisições são validadas no
            servidor e repassadas ao n8n.
          </p>
          {!webhooksReady && (
            <p className="mt-3 text-xs text-fg-3">Requer o n8n configurado e a variável SUPABASE_SERVICE_ROLE_KEY.</p>
          )}
          <Link href="/automacoes/nova?modelo=leads" className="btn btn-secondary btn-sm mt-5">
            Criar automação com webhook
          </Link>
        </Card>

        <Card>
          <Header icon={Bot} title="Provedor de IA" description="Modelo usado pelos agentes e workflows de IA." />
          <HealthTest initial={serverEnv.aiApiKey ? null : { state: "not_configured" }} test={testAi} disabled={!serverEnv.aiApiKey} />
          <EnvList
            vars={[
              ["AI_PROVIDER", Boolean(process.env.AI_PROVIDER), `atual: ${serverEnv.aiProvider}`],
              ["AI_API_KEY", Boolean(serverEnv.aiApiKey), "chave do provedor"],
              ["AI_BASE_URL", Boolean(serverEnv.aiBaseUrl), "opcional, APIs compatíveis"],
            ]}
          />
        </Card>

        <Card className="lg:col-span-2">
          <Header
            icon={Globe}
            title="APIs externas"
            description="Cadastre as APIs usadas pelos seus workflows para acompanhar a disponibilidade. Credenciais ficam no n8n."
          />
          <ApiEndpointForm />
          {(endpoints?.length ?? 0) === 0 ? (
            <p className="mt-6 text-sm text-fg-3">Nenhuma API cadastrada.</p>
          ) : (
            <ul className="mt-6 divide-y divide-line rounded-xl border border-line">
              {endpoints!.map((ep) => {
                const s = API_STATUS[ep.status];
                return (
                  <li key={ep.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{ep.name}</p>
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </div>
                      <p className="truncate font-mono text-xs text-fg-3">
                        {ep.base_url}
                        {ep.health_path ? `/${ep.health_path.replace(/^\/+/, "")}` : ""}
                      </p>
                      {ep.last_checked_at && (
                        <p className="text-xs text-fg-3">
                          Testada {formatRelative(ep.last_checked_at)}
                          {ep.last_status_code ? ` · HTTP ${ep.last_status_code}` : ""}
                          {ep.last_error ? ` · ${ep.last_error}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <form action={testApiEndpoint}>
                        <input type="hidden" name="id" value={ep.id} />
                        <SubmitButton variant="secondary" size="sm" pendingLabel="Testando…">
                          Testar
                        </SubmitButton>
                      </form>
                      <form action={deleteApiEndpoint}>
                        <input type="hidden" name="id" value={ep.id} />
                        <button type="submit" className="btn btn-danger btn-sm" aria-label={`Remover ${ep.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
