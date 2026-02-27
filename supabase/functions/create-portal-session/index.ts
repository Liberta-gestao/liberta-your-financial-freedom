import { corsHeaders } from "../_shared/cors.ts";
import { getStripe } from "../_shared/stripe.ts";
import { getSupabaseAdmin } from "../_shared/supabaseAdmin.ts";

type Body = {
  returnUrl?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response("Não autenticado", { status: 401, headers: corsHeaders });

    const supabaseAdmin = getSupabaseAdmin();
    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userErr || !user) return new Response("Não autenticado", { status: 401, headers: corsHeaders });

    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (entErr) throw entErr;
    if (!ent?.stripe_customer_id) throw new Error("Cliente Stripe não encontrado");

    const stripe = getStripe();
    const body: Body = await req.json().catch(() => ({}));
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:8080";
    const portal = await stripe.billingPortal.sessions.create({
      customer: ent.stripe_customer_id,
      return_url: body.returnUrl ?? `${siteUrl}/app`,
    });

    return new Response(JSON.stringify({ url: portal.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

