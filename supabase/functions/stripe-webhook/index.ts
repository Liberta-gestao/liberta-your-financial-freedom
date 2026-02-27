import { corsHeaders } from "../_shared/cors.ts";
import { getStripe } from "../_shared/stripe.ts";
import { getSupabaseAdmin } from "../_shared/supabaseAdmin.ts";
import type Stripe from "npm:stripe@14.25.0";

function getSignature(req: Request): string {
  const sig = req.headers.get("stripe-signature");
  if (!sig) throw new Error("stripe-signature ausente");
  return sig;
}

function mapStatus(status: Stripe.Subscription.Status): string {
  return status;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405, headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET ausente");

    const stripe = getStripe();
    const sig = getSignature(req);
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    const supabaseAdmin = getSupabaseAdmin();

    const upsertFromSubscription = async (sub: Stripe.Subscription) => {
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const subscriptionId = sub.id;
      const status = mapStatus(sub.status);
      const currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;

      const { error } = await supabaseAdmin
        .from("entitlements")
        .update({
          subscription_status: status,
          current_period_end: currentPeriodEnd,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        })
        .eq("stripe_customer_id", customerId);
      if (error) throw error;
    };

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await upsertFromSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "checkout.session.completed": {
        // Opcional: poderia marcar status aqui também, mas subscription.* cobre o essencial
        break;
      }
      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
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

