import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Shield, Zap } from "lucide-react";

type EntitlementsRow = {
  trial_ends_at: string;
  subscription_status: string;
};

function formatDateTimeBR(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function PaywallPage() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: entitlements } = useQuery({
    queryKey: ["entitlements", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entitlements")
        .select("trial_ends_at,subscription_status")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as EntitlementsRow | null;
    },
  });

  const trialInfo = useMemo(() => {
    if (!entitlements?.trial_ends_at) return null;
    const end = new Date(entitlements.trial_ends_at);
    const ms = end.getTime() - Date.now();
    return {
      endsAt: end,
      ended: ms <= 0,
      hoursLeft: Math.max(0, Math.ceil(ms / 36e5)),
    };
  }, [entitlements?.trial_ends_at]);

  const startCheckout = async () => {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {},
      });
      if (error) throw error;
      const url = (data as { url?: string } | null)?.url;
      if (!url) throw new Error("Checkout sem URL");
      window.location.href = url;
    } catch (e) {
      setError(String((e as any)?.message ?? e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-primary/20 bg-card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Desbloqueie o Liberta</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Seu acesso está bloqueado até a assinatura ser ativada.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="flex items-center justify-between rounded-xl bg-secondary/60 border border-border/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">Plano Premium</span>
            <span className="font-display font-bold text-gradient">R$ 21,90/mês</span>
          </div>
          {trialInfo && (
            <div className="rounded-xl bg-secondary/60 border border-border/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Teste grátis</span>
                <span className="text-sm font-medium">
                  {trialInfo.ended
                    ? `Finalizado em ${formatDateTimeBR(entitlements!.trial_ends_at)}`
                    : `Termina em ${formatDateTimeBR(entitlements!.trial_ends_at)} (${trialInfo.hoursLeft}h)`}
                </span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="hero" className="h-11 flex-1" onClick={startCheckout} disabled={busy}>
            Assinar e desbloquear <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11"
            onClick={() => supabase.functions.invoke("create-portal-session").then((r) => {
              const url = (r.data as any)?.url;
              if (url) window.location.href = url;
            })}
            disabled={busy}
          >
            Gerenciar assinatura
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Checkout seguro via Stripe
          </span>
          <button className="hover:underline" onClick={() => signOut()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

