import { createClient } from "npm:@supabase/supabase-js@2";

export function getSupabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url) throw new Error("SUPABASE_URL ausente");
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente");

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

