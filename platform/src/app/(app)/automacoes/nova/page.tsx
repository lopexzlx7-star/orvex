import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bell, FilePlus2, Headphones, Repeat, UserPlus } from "lucide-react";
import { AutomationForm } from "@/components/automation-form";
import { Card, PageHeader, cn } from "@/components/ui";
import { isN8nConfigured } from "@/lib/env";
import { TEMPLATES } from "@/lib/templates";
import { createAutomation } from "../actions";

export const metadata: Metadata = { title: "Nova automação" };

const ICONS: Record<string, typeof Bell> = {
  atendimento: Headphones,
  leads: UserPlus,
  "follow-up": Repeat,
  notificacoes: Bell,
};

export default async function NewAutomationPage({ searchParams }: { searchParams: Promise<{ modelo?: string }> }) {
  const { modelo } = await searchParams;
  const template = TEMPLATES.find((t) => t.id === modelo);
  const selected = template?.id ?? (modelo === "vazio" ? "vazio" : null);

  return (
    <>
      <Link href="/automacoes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Automações
      </Link>
      <PageHeader title="Nova automação" description="Escolha um modelo como ponto de partida ou comece do zero." />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TEMPLATES.map((t) => {
          const Icon = ICONS[t.id] ?? FilePlus2;
          return (
            <Link key={t.id} href={`/automacoes/nova?modelo=${t.id}`} scroll={false}>
              <Card className={cn("h-full !p-4 transition-all hover:-translate-y-0.5", selected === t.id && "!border-accent ring-1 ring-accent")}>
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.7} />
                <p className="mt-3 text-sm font-medium">{t.name}</p>
                <p className="mt-1 text-xs text-fg-2">{t.summary}</p>
              </Card>
            </Link>
          );
        })}
        <Link href="/automacoes/nova?modelo=vazio" scroll={false}>
          <Card className={cn("h-full !p-4 transition-all hover:-translate-y-0.5", selected === "vazio" && "!border-accent ring-1 ring-accent")}>
            <FilePlus2 className="h-5 w-5 text-fg-2" strokeWidth={1.7} />
            <p className="mt-3 text-sm font-medium">Em branco</p>
            <p className="mt-1 text-xs text-fg-2">Configure todos os campos manualmente.</p>
          </Card>
        </Link>
      </div>

      {selected && (
        <AutomationForm
          key={selected}
          action={createAutomation}
          n8nConfigured={isN8nConfigured()}
          submitLabel="Criar automação"
          initial={{
            name: template?.name ?? "",
            description: template?.description ?? "",
            template: template?.id ?? null,
            trigger_type: template?.trigger_type ?? "manual",
            source_app: template?.source_app ?? "",
            actions: template?.actions ?? [],
            config: template?.config ?? {},
            n8n_webhook_path: null,
            wait_for_callback: false,
            active: false,
          }}
        />
      )}
    </>
  );
}
