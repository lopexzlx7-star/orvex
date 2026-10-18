"use client";

import { useActionState } from "react";
import { Field, Notice } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { updatePreferences, updateProfile, type SettingsState } from "@/app/(app)/configuracoes/actions";

const TIMEZONES = [
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Fortaleza",
  "America/Recife",
  "America/Cuiaba",
  "America/Rio_Branco",
  "America/Noronha",
  "Europe/Lisbon",
  "America/New_York",
  "UTC",
];

function Feedback({ state }: { state: SettingsState }) {
  if (state?.error) return <Notice tone="err">{state.error}</Notice>;
  if (state?.ok) return <Notice tone="ok">Alterações salvas.</Notice>;
  return null;
}

export function ProfileForm({ fullName, agencyName, email }: { fullName: string; agencyName: string; email: string }) {
  const [state, action] = useActionState<SettingsState, FormData>(updateProfile, undefined);
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome" htmlFor="full_name">
          <input id="full_name" name="full_name" className="input" defaultValue={fullName} maxLength={120} />
        </Field>
        <Field label="Nome da agência" htmlFor="agency_name">
          <input id="agency_name" name="agency_name" className="input" defaultValue={agencyName} maxLength={120} />
        </Field>
      </div>
      <Field label="E-mail" htmlFor="email" hint="O e-mail de acesso é gerenciado pela autenticação.">
        <input id="email" className="input" value={email} readOnly disabled />
      </Field>
      <Feedback state={state} />
      <div>
        <SubmitButton pendingLabel="Salvando…">Salvar perfil</SubmitButton>
      </div>
    </form>
  );
}

export function PreferencesForm({ theme, timezone }: { theme: string; timezone: string }) {
  const [state, action] = useActionState<SettingsState, FormData>(updatePreferences, undefined);
  const zones = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES];
  return (
    <form
      action={async (formData) => {
        action(formData);
        const pref = String(formData.get("theme"));
        const resolved = pref === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : pref;
        document.documentElement.dataset.pref = pref;
        document.documentElement.dataset.theme = resolved;
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tema" htmlFor="theme">
          <select id="theme" name="theme" className="input" defaultValue={theme}>
            <option value="system">Seguir o sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </Field>
        <Field label="Fuso horário" htmlFor="timezone" hint="Usado para exibir datas e horários.">
          <select id="timezone" name="timezone" className="input" defaultValue={timezone}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Feedback state={state} />
      <div>
        <SubmitButton pendingLabel="Salvando…">Salvar preferências</SubmitButton>
      </div>
    </form>
  );
}
