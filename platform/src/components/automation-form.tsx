"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, Field, Notice } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import type { FormState } from "@/app/(app)/automacoes/actions";
import { TRIGGER_HINTS, TRIGGER_LABELS } from "@/lib/templates";
import type { TriggerType } from "@/lib/types";

export interface AutomationFormValues {
  name: string;
  description: string;
  template: string | null;
  trigger_type: TriggerType;
  source_app: string;
  actions: string[];
  config: Record<string, string>;
  n8n_webhook_path: string | null;
  wait_for_callback: boolean;
  active: boolean;
}

type Row = { id: number; key: string; value: string };
let nextId = 0;
const uid = () => ++nextId;

export function AutomationForm({
  action,
  initial,
  n8nConfigured,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial: AutomationFormValues;
  n8nConfigured: boolean;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [trigger, setTrigger] = useState<TriggerType>(initial.trigger_type);
  const [steps, setSteps] = useState<Row[]>(() =>
    (initial.actions.length ? initial.actions : [""]).map((value) => ({ id: uid(), key: "", value })),
  );
  const [config, setConfig] = useState<Row[]>(() =>
    Object.entries(initial.config).map(([key, value]) => ({ id: uid(), key, value })),
  );

  return (
    <form action={formAction} className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="template" value={initial.template ?? ""} />
      <div className="grid gap-5">
        <Card>
          <h2 className="mb-5 text-sm font-medium">Informações</h2>
          <div className="grid gap-4">
            <Field label="Nome da automação" htmlFor="name">
              <input id="name" name="name" className="input" defaultValue={initial.name} maxLength={120} required />
            </Field>
            <Field label="Descrição" htmlFor="description" hint="O que esta automação faz e para quem.">
              <textarea id="description" name="description" className="input" defaultValue={initial.description} maxLength={1000} />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 text-sm font-medium">Gatilho e origem</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Gatilho de início" htmlFor="trigger_type" hint={TRIGGER_HINTS[trigger]}>
              <select
                id="trigger_type"
                name="trigger_type"
                className="input"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value as TriggerType)}
              >
                {(Object.keys(TRIGGER_LABELS) as TriggerType[]).map((t) => (
                  <option key={t} value={t}>
                    {TRIGGER_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Aplicativo ou serviço de origem" htmlFor="source_app" hint="Ex.: WhatsApp, formulário do site, CRM.">
              <input id="source_app" name="source_app" className="input" defaultValue={initial.source_app} maxLength={120} />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-medium">Ações a executar</h2>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSteps((s) => [...s, { id: uid(), key: "", value: "" }])}
              disabled={steps.length >= 20}
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
          <p className="mb-4 text-xs text-fg-3">Descreva os passos. A execução em si acontece no workflow do n8n.</p>
          <ol className="grid gap-2">
            {steps.map((step, i) => (
              <li key={step.id} className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-center font-mono text-xs text-fg-3">{i + 1}</span>
                <input
                  name="actions"
                  className="input"
                  defaultValue={step.value}
                  maxLength={200}
                  placeholder="Ex.: Enviar mensagem de boas-vindas"
                  aria-label={`Ação ${i + 1}`}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-icon shrink-0"
                  onClick={() => setSteps((s) => s.filter((x) => x.id !== step.id))}
                  aria-label={`Remover ação ${i + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-medium">Configurações</h2>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setConfig((c) => [...c, { id: uid(), key: "", value: "" }])}
              disabled={config.length >= 30}
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
          <p className="mb-4 text-xs text-fg-3">
            Parâmetros enviados ao workflow (sem senhas ou chaves: guarde credenciais no próprio n8n).
          </p>
          {config.length === 0 ? (
            <p className="text-sm text-fg-3">Nenhuma configuração.</p>
          ) : (
            <div className="grid gap-2">
              {config.map((row) => (
                <div key={row.id} className="grid grid-cols-[1fr_1.4fr_auto] items-center gap-2">
                  <input name="config_key" className="input" defaultValue={row.key} placeholder="chave" maxLength={60} aria-label="Chave" />
                  <input name="config_value" className="input" defaultValue={row.value} placeholder="valor" maxLength={500} aria-label="Valor" />
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => setConfig((c) => c.filter((x) => x.id !== row.id))}
                    aria-label="Remover configuração"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid content-start gap-5">
        <Card>
          <h2 className="mb-5 text-sm font-medium">Conexão com o n8n</h2>
          <div className="grid gap-4">
            <Field
              label="Caminho do webhook no n8n"
              htmlFor="n8n_webhook_path"
              hint="O “Path” do nó Webhook do workflow. Ex.: atendimento-whatsapp"
            >
              <input
                id="n8n_webhook_path"
                name="n8n_webhook_path"
                className="input font-mono"
                defaultValue={initial.n8n_webhook_path ?? ""}
                placeholder="meu-workflow"
                pattern="[A-Za-z0-9/_\-]{1,200}"
              />
            </Field>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="wait_for_callback" defaultChecked={initial.wait_for_callback} className="mt-0.5 accent-[var(--accent)]" />
              <span>
                Aguardar callback do n8n
                <span className="hint block">
                  Marque se o workflow é longo e responde depois em <code className="font-mono">/api/n8n/callback</code>.
                </span>
              </span>
            </label>
          </div>
        </Card>
        <Card>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="activate" defaultChecked={initial.active} className="mt-0.5 accent-[var(--accent)]" />
            <span>
              Ativar automação
              <span className="hint block">Automações pausadas não aceitam execuções.</span>
            </span>
          </label>
          {!n8nConfigured && (
            <p className="mt-3 text-xs text-warn">O n8n ainda não está configurado. Você pode salvar como pausada e ativar depois.</p>
          )}
          {state?.error && (
            <div className="mt-4">
              <Notice tone="err">{state.error}</Notice>
            </div>
          )}
          <SubmitButton className="mt-5 w-full" pendingLabel="Salvando…">
            {submitLabel}
          </SubmitButton>
        </Card>
      </div>
    </form>
  );
}
