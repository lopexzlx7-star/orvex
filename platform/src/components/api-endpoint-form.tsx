"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field, Notice } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { addApiEndpoint, type EndpointFormState } from "@/app/(app)/integracoes/actions";

export function ApiEndpointForm() {
  const [state, action] = useActionState<EndpointFormState, FormData>(addApiEndpoint, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-[1fr_1.6fr_1fr_auto] sm:items-end">
      <Field label="Nome" htmlFor="api-name">
        <input id="api-name" name="name" className="input" placeholder="Ex.: CRM" required maxLength={80} />
      </Field>
      <Field label="URL base" htmlFor="api-url">
        <input id="api-url" name="base_url" type="url" className="input" placeholder="https://api.exemplo.com" required />
      </Field>
      <Field label="Caminho de teste" htmlFor="api-health">
        <input id="api-health" name="health_path" className="input" placeholder="health (opcional)" maxLength={200} />
      </Field>
      <SubmitButton variant="secondary" pendingLabel="Salvando…">
        Adicionar
      </SubmitButton>
      {state?.error && (
        <div className="sm:col-span-4">
          <Notice tone="err">{state.error}</Notice>
        </div>
      )}
    </form>
  );
}
