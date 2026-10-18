import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<Profile>();
  return {
    supabase,
    user,
    profile: profile ?? { id: user.id, full_name: "", agency_name: "", theme: "system" as const, timezone: "America/Sao_Paulo" },
  };
});
