import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  BarChart3, CreditCard, Target, TrendingUp,
  Brain, MessageCircle, Settings, LogOut, Menu, X, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import iconLiberta from "@/assets/icone_liberta.png";

const navItems = [
  { to: "/app", icon: Home, label: "Início", end: true },
  { to: "/app/transactions", icon: CreditCard, label: "Lançamentos" },
  { to: "/app/goals", icon: Target, label: "Metas" },
  { to: "/app/bi", icon: BarChart3, label: "Análises" },
  { to: "/app/simulator", icon: TrendingUp, label: "Simulador" },
  { to: "/app/ai", icon: Brain, label: "Assistente IA" },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border">
            <img src={logoWhite} alt="Liberta" className="h-6" />
            <button className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`
                }
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-sidebar-border space-y-1">
            <NavLink
              to="/app/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Settings className="h-4.5 w-4.5" />
              Configurações
            </NavLink>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <img src={iconLiberta} alt="" className="h-5 w-5 rounded" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
