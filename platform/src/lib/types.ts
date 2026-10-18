export type TriggerType = "manual" | "webhook" | "schedule" | "event";
export type AutomationStatus = "active" | "paused" | "error";
export type ExecutionStatus = "pending" | "running" | "success" | "error";
export type ExecutionSource = "manual" | "webhook" | "n8n";

export interface Automation {
  id: string;
  user_id: string;
  name: string;
  description: string;
  template: string | null;
  trigger_type: TriggerType;
  source_app: string;
  actions: string[];
  config: Record<string, string>;
  n8n_webhook_path: string | null;
  wait_for_callback: boolean;
  webhook_token: string;
  status: AutomationStatus;
  last_error: string | null;
  last_run_at: string | null;
  run_count: number;
  created_at: string;
  updated_at: string;
}

export interface Execution {
  id: string;
  user_id: string;
  automation_id: string;
  trigger_source: ExecutionSource;
  idempotency_key: string;
  status: ExecutionStatus;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  error_message: string | null;
  input: unknown;
  output: unknown;
  n8n_execution_id: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  agency_name: string;
  theme: "system" | "light" | "dark";
  timezone: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  base_url: string;
  health_path: string;
  status: "unknown" | "online" | "error";
  last_status_code: number | null;
  last_error: string | null;
  last_checked_at: string | null;
  created_at: string;
}
