"use server";

import { revalidatePath } from "next/cache";
import { checkAiProvider, checkN8nHealth, type HealthResult } from "@/lib/n8n";
import { createClient } from "@/lib/supabase/server";
import type { ApiEndpoint } from "@/lib/types";
import { assertPublicUrl } from "@/lib/url-guard";
import { apiEndpointSchema, firstError } from "@/lib/validation";

export type TestState = { result?: HealthResult } | undefined;
export type EndpointFormState = { error?: string; ok?: boolean } | undefined;

export async function testN8n(): Promise<TestState> {
  return { result: await checkN8nHealth() };
}

export async function testAi(): Promise<TestState> {
  return { result: await checkAiProvider() };
}

export async function addApiEndpoint(_: EndpointFormState, formData: FormData): Promise<EndpointFormState> {
  const parsed = apiEndpointSchema.safeParse({
    name: formData.get("name"),
    base_url: formData.get("base_url"),
    health_path: formData.get("health_path") ?? "",
  });
  if (!parsed.success) return { error: firstError(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.from("api_endpoints").insert({
    ...parsed.data,
    base_url: parsed.data.base_url.replace(/\/+$/, ""),
  });
  if (error) return { error: "Não foi possível salvar a API." };
  revalidatePath("/integracoes");
  return { ok: true };
}

export async function deleteApiEndpoint(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("api_endpoints").delete().eq("id", String(formData.get("id")));
  revalidatePath("/integracoes");
}

export async function testApiEndpoint(formData: FormData) {
  const supabase = await createClient();
  const { data: endpoint } = await supabase
    .from("api_endpoints")
    .select("*")
    .eq("id", String(formData.get("id")))
    .maybeSingle<ApiEndpoint>();
  if (!endpoint) return;

  const path = endpoint.health_path ? `/${endpoint.health_path.replace(/^\/+/, "")}` : "";
  const target = `${endpoint.base_url}${path}`;
  let update: Partial<ApiEndpoint>;
  const blocked = await assertPublicUrl(target);
  if (blocked) {
    update = { status: "error", last_status_code: null, last_error: blocked };
  } else {
    try {
      const res = await fetch(target, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(6000), cache: "no-store" });
      const reachable = res.status < 500;
      update = {
        status: reachable ? "online" : "error",
        last_status_code: res.status,
        last_error: reachable ? null : `Respondeu ${res.status}.`,
      };
    } catch (err) {
      const timeout = err instanceof Error && err.name === "TimeoutError";
      update = { status: "error", last_status_code: null, last_error: timeout ? "Tempo esgotado (6s)." : "Não foi possível conectar." };
    }
  }
  await supabase
    .from("api_endpoints")
    .update({ ...update, last_checked_at: new Date().toISOString() })
    .eq("id", endpoint.id);
  revalidatePath("/integracoes");
}
