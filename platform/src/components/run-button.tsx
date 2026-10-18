"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Play } from "lucide-react";
import { Notice } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { runNow, type RunState } from "@/app/(app)/automacoes/actions";

export function RunButton({ id, blocker }: { id: string; blocker: string | null }) {
  const [state, action] = useActionState<RunState, FormData>(async (prev, formData) => {
    const result = await runNow(prev, formData);
    setKey(crypto.randomUUID());
    return result;
  }, undefined);
  // Uma chave por clique: reenvios da mesma solicitação não geram execuções duplicadas.
  const [key, setKey] = useState(() => crypto.randomUUID());

  return (
    <div className="grid gap-3">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="idempotency_key" value={key} />
        <SubmitButton disabled={Boolean(blocker)} pendingLabel="Executando…" className="w-full">
          <Play className="h-4 w-4" /> Executar agora
        </SubmitButton>
      </form>
      {blocker && <p className="text-xs text-fg-3">{blocker}</p>}
      {state?.message && (
        <Notice tone={state.ok ? "ok" : "err"}>
          {state.message}{" "}
          {state.executionId && (
            <Link href={`/execucoes/${state.executionId}`} className="font-medium underline underline-offset-4">
              Ver detalhes
            </Link>
          )}
        </Notice>
      )}
    </div>
  );
}
