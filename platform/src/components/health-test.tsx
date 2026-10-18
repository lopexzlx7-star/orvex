"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import type { HealthResult } from "@/lib/n8n";
import type { TestState } from "@/app/(app)/integracoes/actions";

export function HealthBadge({ result }: { result: HealthResult | null }) {
  if (!result) return <Badge tone="neutral">Não testado</Badge>;
  if (result.state === "not_configured") return <Badge tone="neutral">Não configurado</Badge>;
  if (result.state === "connected") return <Badge tone="ok">Conectado</Badge>;
  return <Badge tone="err">Erro</Badge>;
}

export function HealthTest({
  initial,
  test,
  disabled,
}: {
  initial: HealthResult | null;
  test: () => Promise<TestState>;
  disabled?: boolean;
}) {
  const [state, action] = useActionState<TestState, FormData>(() => test(), undefined);
  const result = state?.result ?? initial;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <HealthBadge result={result} />
        {result && "detail" in result && <span className="text-xs text-fg-2">{result.detail}</span>}
      </div>
      <form action={action}>
        <SubmitButton variant="secondary" size="sm" pendingLabel="Testando…" disabled={disabled}>
          <RefreshCw className="h-3.5 w-3.5" /> Testar conexão
        </SubmitButton>
      </form>
    </div>
  );
}
