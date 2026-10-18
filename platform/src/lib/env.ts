import "server-only";

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

export const serverEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
  appUrl: optional("APP_URL") ?? "http://localhost:3000",
  n8nBaseUrl: optional("N8N_BASE_URL")?.replace(/\/+$/, ""),
  n8nApiKey: optional("N8N_API_KEY"),
  n8nWebhookSecret: optional("N8N_WEBHOOK_SECRET"),
  n8nCallbackSecret: optional("N8N_CALLBACK_SECRET"),
  aiProvider: optional("AI_PROVIDER") ?? "openai",
  aiApiKey: optional("AI_API_KEY"),
  aiBaseUrl: optional("AI_BASE_URL")?.replace(/\/+$/, ""),
};

export function isN8nConfigured() {
  return Boolean(serverEnv.n8nBaseUrl && serverEnv.n8nWebhookSecret);
}
