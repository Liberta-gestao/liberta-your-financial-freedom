import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

type EntitlementsRow = {
  trial_ends_at: string;
  subscription_status: string;
};

function isSubscribed(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}

export default function ProtectedRoute() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const { data: entitlements, isLoading: entLoading } = useQuery({
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

  const gate = useMemo(() => {
    if (authLoading) return { state: "loading" as const };
    if (!user) return { state: "no_session" as const };
    if (entLoading) return { state: "loading" as const };

    const trialEndsAt = entitlements?.trial_ends_at ? new Date(entitlements.trial_ends_at) : null;
    const trialValid = trialEndsAt ? Date.now() <= trialEndsAt.getTime() : false;
    const subscribed = isSubscribed(entitlements?.subscription_status);

    if (subscribed || trialValid) return { state: "ok" as const };
    return { state: "paywall" as const };
  }, [authLoading, user, entLoading, entitlements]);

  if (gate.state === "loading") return null;

  if (gate.state === "no_session") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (gate.state === "paywall") {
    return <Navigate to="/app/paywall" replace />;
  }

  return <Outlet />;
}

