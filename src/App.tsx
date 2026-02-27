import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import GoalsPage from "./pages/GoalsPage";
import BIPage from "./pages/BIPage";
import SimulatorPage from "./pages/SimulatorPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/providers/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import PaywallPage from "@/pages/PaywallPage";
import { envOk } from "@/lib/env";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {envOk ? (
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="goals" element={<GoalsPage />} />
                  <Route path="bi" element={<BIPage />} />
                  <Route path="simulator" element={<SimulatorPage />} />
                  <Route path="ai" element={<AIAssistantPage />} />
                  <Route path="paywall" element={<PaywallPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md text-center space-y-3">
            <h1 className="font-display text-2xl font-bold">Configuração ausente</h1>
            <p className="text-sm text-muted-foreground">
              As variáveis de ambiente <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> não
              estão definidas neste ambiente. Configure-as nas secrets da plataforma (Lovable) e publique novamente.
            </p>
          </div>
        </div>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
