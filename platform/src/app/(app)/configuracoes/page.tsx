import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PreferencesForm, ProfileForm } from "@/components/settings-forms";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, PageHeader } from "@/components/ui";
import { signOut } from "@/app/(auth)/actions";
import { isN8nConfigured, serverEnv } from "@/lib/env";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Configurações" };

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          <p className="mt-1 text-xs text-fg-3">{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </Card>
  );
}

export default async function SettingsPage() {
  const { user, profile } = await getSession();
  const envItems: [string, boolean][] = [
    ["n8n", isN8nConfigured()],
    ["Callback do n8n", Boolean(serverEnv.n8nCallbackSecret)],
    ["Provedor de IA", Boolean(serverEnv.aiApiKey)],
    ["Chave de serviço do Supabase", Boolean(serverEnv.supabaseServiceRoleKey)],
  ];

  return (
    <>
      <PageHeader title="Configurações" description="Perfil da agência, preferências e sessão." />
      <div className="grid gap-5">
        <Section title="Perfil da agência" description="Como você e sua agência aparecem na plataforma.">
          <ProfileForm fullName={profile.full_name} agencyName={profile.agency_name} email={user.email ?? ""} />
        </Section>
        <Section title="Preferências" description="Aparência e fuso horário.">
          <PreferencesForm theme={profile.theme} timezone={profile.timezone} />
        </Section>
        <Section title="Integrações" description="Segredos ficam em variáveis de ambiente do servidor e nunca chegam ao navegador.">
          <ul className="grid gap-2 sm:grid-cols-2">
            {envItems.map(([label, ok]) => (
              <li key={label} className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm">
                {label}
                <Badge tone={ok ? "ok" : "neutral"}>{ok ? "Configurado" : "Não configurado"}</Badge>
              </li>
            ))}
          </ul>
          <Link href="/integracoes" className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            Gerenciar integrações <ArrowRight className="h-4 w-4" />
          </Link>
        </Section>
        <Section title="Sessão" description="Encerre o acesso neste dispositivo ou em todos.">
          <div className="flex flex-wrap gap-2">
            <form action={signOut}>
              <input type="hidden" name="scope" value="local" />
              <SubmitButton variant="secondary" pendingLabel="Saindo…">
                Sair deste dispositivo
              </SubmitButton>
            </form>
            <form action={signOut}>
              <input type="hidden" name="scope" value="global" />
              <SubmitButton variant="danger" pendingLabel="Saindo…">
                Sair de todos os dispositivos
              </SubmitButton>
            </form>
          </div>
        </Section>
      </div>
    </>
  );
}
