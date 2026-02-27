# Supabase Edge Functions (Liberta)

## Variáveis necessárias (Edge runtime)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `SITE_URL`

## Funções
- `create-checkout-session`: cria sessão Stripe Checkout (assinatura)
- `create-portal-session`: abre o portal do cliente
- `stripe-webhook`: recebe eventos do Stripe e atualiza `public.entitlements`

