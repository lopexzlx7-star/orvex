import type { Metadata } from "next";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams;
  return (
    <>
      {erro && (
        <p className="mb-4 rounded-xl bg-err-soft px-4 py-3 text-sm text-err">Link inválido ou expirado. Entre novamente.</p>
      )}
      <AuthForm mode="login" next={next} />
    </>
  );
}
