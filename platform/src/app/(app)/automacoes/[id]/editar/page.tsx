import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AutomationForm } from "@/components/automation-form";
import { PageHeader } from "@/components/ui";
import { isN8nConfigured } from "@/lib/env";
import { getSession } from "@/lib/session";
import type { Automation } from "@/lib/types";
import { updateAutomation } from "../../actions";

export const metadata: Metadata = { title: "Editar automação" };

export default async function EditAutomationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await getSession();
  const { data: a } = await supabase.from("automations").select("*").eq("id", id).maybeSingle<Automation>();
  if (!a) notFound();

  return (
    <>
      <Link href={`/automacoes/${a.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> {a.name}
      </Link>
      <PageHeader title="Editar automação" />
      <AutomationForm
        action={updateAutomation.bind(null, a.id)}
        n8nConfigured={isN8nConfigured()}
        submitLabel="Salvar alterações"
        initial={{
          name: a.name,
          description: a.description,
          template: a.template,
          trigger_type: a.trigger_type,
          source_app: a.source_app,
          actions: a.actions,
          config: a.config,
          n8n_webhook_path: a.n8n_webhook_path,
          wait_for_callback: a.wait_for_callback,
          active: a.status !== "paused",
        }}
      />
    </>
  );
}
