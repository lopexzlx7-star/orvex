import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-sm p-8 text-center">
        <p className="mono-label">404</p>
        <h1 className="mt-2 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-fg-2">O conteúdo que você procura não existe ou foi removido.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
