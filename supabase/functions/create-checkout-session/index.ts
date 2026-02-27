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

    const stripe = getStripe();

    const { returnUrl }: Body = await req.json().catch(() => ({}));
    const priceId = Deno.env.get("STRIPE_PRICE_ID");
    if (!priceId) throw new Error("STRIPE_PRICE_ID ausente");

    // Busca/Cria customer e salva em entitlements
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (entErr) throw entErr;

    let customerId = ent?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      const { error: updErr } = await supabaseAdmin
        .from("entitlements")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
      if (updErr) throw updErr;
    }

    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:8080";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/app?checkout=success`,
      cancel_url: `${siteUrl}/app/paywall?checkout=cancel`,
      allow_promotion_codes: true,
      metadata: { supabase_user_id: user.id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
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

