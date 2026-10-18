"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, Notice } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { login, signup, type AuthState } from "./actions";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(mode === "login" ? login : signup, undefined);
  const isLogin = mode === "login";

  return (
    <div className="glass p-7">
      <h1 className="text-xl font-semibold tracking-tight">{isLogin ? "Entrar na plataforma" : "Criar conta"}</h1>
      <p className="mt-1 text-sm text-fg-2">
        {isLogin ? "Acesse suas automações e execuções." : "Comece a organizar as automações da sua agência."}
      </p>
      <form action={action} className="mt-6 space-y-4">
        {next && <input type="hidden" name="next" value={next} />}
        {!isLogin && (
          <>
            <Field label="Seu nome" htmlFor="full_name">
              <input id="full_name" name="full_name" className="input" autoComplete="name" required />
            </Field>
            <Field label="Nome da agência" htmlFor="agency_name" hint="Opcional. Pode ser alterado depois.">
              <input id="agency_name" name="agency_name" className="input" autoComplete="organization" />
            </Field>
          </>
        )}
        <Field label="E-mail" htmlFor="email">
          <input id="email" name="email" type="email" className="input" autoComplete="email" required />
        </Field>
        <Field label="Senha" htmlFor="password" hint={isLogin ? undefined : "Mínimo de 8 caracteres."}>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={isLogin ? undefined : 8}
            required
          />
        </Field>
        {state?.error && <Notice tone="err">{state.error}</Notice>}
        {state?.message && <Notice tone="ok">{state.message}</Notice>}
        <SubmitButton className="w-full" pendingLabel={isLogin ? "Entrando…" : "Criando conta…"}>
          {isLogin ? "Entrar" : "Criar conta"}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-fg-2">
        {isLogin ? "Ainda não tem conta? " : "Já tem conta? "}
        <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-fg underline-offset-4 hover:underline">
          {isLogin ? "Criar conta" : "Entrar"}
        </Link>
      </p>
    </div>
  );
}
