"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
  next: z.string().optional(),
});

const signupSchema = z.object({
  full_name: z.string().trim().min(1, "Informe seu nome.").max(120),
  agency_name: z.string().trim().max(120).default(""),
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(72),
});

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Confirme seu e-mail antes de entrar."
          : error.code === "invalid_credentials"
            ? "E-mail ou senha incorretos."
            : "Não foi possível entrar. Tente novamente.",
    };
  }
  redirect(safeNext(parsed.data.next));
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name, agency_name: parsed.data.agency_name },
      emailRedirectTo: `${serverEnv.appUrl}/auth/callback`,
    },
  });
  if (error) {
    return {
      error: error.code === "user_already_exists" ? "Já existe uma conta com este e-mail." : error.message,
    };
  }
  if (!data.session) {
    return { message: "Conta criada. Enviamos um link de confirmação para o seu e-mail." };
  }
  redirect("/");
}

export async function signOut(formData: FormData) {
  const scope = formData.get("scope") === "global" ? "global" : "local";
  const supabase = await createClient();
  await supabase.auth.signOut({ scope });
  redirect("/login");
}
