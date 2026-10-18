"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { firstError, preferencesSchema, profileSchema } from "@/lib/validation";

export type SettingsState = { error?: string; ok?: boolean } | undefined;

export async function updateProfile(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const parsed = profileSchema.safeParse({ full_name: formData.get("full_name"), agency_name: formData.get("agency_name") });
  if (!parsed.success) return { error: firstError(parsed.error) };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };
  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) return { error: "Não foi possível salvar o perfil." };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updatePreferences(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const parsed = preferencesSchema.safeParse({ theme: formData.get("theme"), timezone: formData.get("timezone") });
  if (!parsed.success) return { error: firstError(parsed.error) };
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: parsed.data.timezone });
  } catch {
    return { error: "Fuso horário inválido." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };
  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) return { error: "Não foi possível salvar as preferências." };
  (await cookies()).set("orvex-theme", parsed.data.theme, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
  return { ok: true };
}
