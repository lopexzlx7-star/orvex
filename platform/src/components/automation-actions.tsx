"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { deleteAutomation, setAutomationStatus } from "@/app/(app)/automacoes/actions";
import type { AutomationStatus } from "@/lib/types";

export function AutomationActions({
  id,
  name,
  status,
  showView = true,
}: {
  id: string;
  name: string;
  status: AutomationStatus;
  showView?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form action={deleteAutomation} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <span className="text-xs text-fg-2">Excluir “{name}” e seu histórico?</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
          Cancelar
        </button>
        <SubmitButton variant="danger" size="sm" pendingLabel="Excluindo…">
          Confirmar exclusão
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showView && (
        <Link href={`/automacoes/${id}`} className="btn btn-ghost btn-sm" aria-label={`Ver ${name}`}>
          <Eye className="h-4 w-4" /> Ver
        </Link>
      )}
      <Link href={`/automacoes/${id}/editar`} className="btn btn-ghost btn-sm" aria-label={`Editar ${name}`}>
        <Pencil className="h-4 w-4" /> Editar
      </Link>
      <form action={setAutomationStatus}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={status === "active" ? "paused" : "active"} />
        <SubmitButton variant="ghost" size="sm">
          {status === "active" ? (
            <>
              <Pause className="h-4 w-4" /> Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Ativar
            </>
          )}
        </SubmitButton>
      </form>
      <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirming(true)} aria-label={`Excluir ${name}`}>
        <Trash2 className="h-4 w-4" /> Excluir
      </button>
    </div>
  );
}
