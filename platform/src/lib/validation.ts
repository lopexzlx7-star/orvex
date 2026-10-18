import { z } from "zod";

export const automationSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome.").max(120, "Máximo de 120 caracteres."),
  description: z.string().trim().max(1000, "Máximo de 1000 caracteres.").default(""),
  template: z.string().trim().max(40).nullable().default(null),
  trigger_type: z.enum(["manual", "webhook", "schedule", "event"], { message: "Gatilho inválido." }),
  source_app: z.string().trim().max(120, "Máximo de 120 caracteres.").default(""),
  actions: z
    .array(z.string().trim().min(1).max(200))
    .max(20, "Máximo de 20 ações.")
    .default([]),
  config: z
    .record(z.string().trim().min(1).max(60), z.string().max(500))
    .refine((v) => Object.keys(v).length <= 30, "Máximo de 30 configurações.")
    .default({}),
  n8n_webhook_path: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9/_-]{1,200}$/, "Use apenas letras, números, '/', '-' e '_'.")
    .nullable()
    .default(null),
  wait_for_callback: z.boolean().default(false),
  status: z.enum(["active", "paused"]).default("paused"),
});

export type AutomationInput = z.infer<typeof automationSchema>;

export const profileSchema = z.object({
  full_name: z.string().trim().max(120),
  agency_name: z.string().trim().max(120),
});

export const preferencesSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
  timezone: z.string().trim().min(1).max(64),
});

export const apiEndpointSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome.").max(80),
  base_url: z
    .string()
    .trim()
    .url("URL inválida.")
    .regex(/^https?:\/\//, "Use http:// ou https://")
    .max(500),
  health_path: z.string().trim().max(200).default(""),
});

export const callbackSchema = z
  .object({
    execution_id: z.string().uuid().optional(),
    automation_id: z.string().uuid().optional(),
    n8n_execution_id: z.union([z.string(), z.number()]).transform(String).optional(),
    status: z.enum(["running", "success", "error"]),
    output: z.unknown().optional(),
    error: z.string().max(4000).optional(),
    started_at: z.string().datetime({ offset: true }).optional(),
    finished_at: z.string().datetime({ offset: true }).optional(),
  })
  .refine((v) => v.execution_id || (v.automation_id && v.n8n_execution_id), {
    message: "Informe execution_id, ou automation_id + n8n_execution_id.",
  });

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos.";
}
