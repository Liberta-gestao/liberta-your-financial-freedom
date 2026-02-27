import { motion } from "framer-motion";
import { Target, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const goals = [
  { id: 1, title: "Reserva de Emergência", target: 30000, current: 18500, deadline: "Dez 2026", icon: "🛡️" },
  { id: 2, title: "Viagem Europa", target: 15000, current: 6200, deadline: "Jul 2027", icon: "✈️" },
  { id: 3, title: "Carro Novo", target: 80000, current: 32000, deadline: "2028", icon: "🚗" },
  { id: 4, title: "Curso de MBA", target: 25000, current: 25000, deadline: "Concluída", icon: "🎓" },
];

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Metas Financeiras</h1>
          <p className="text-muted-foreground text-sm">Acompanhe seus objetivos de economia</p>
        </div>
        <Button variant="hero" size="sm"><Plus className="h-4 w-4 mr-2" /> Nova Meta</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.round((g.current / g.target) * 100);
          const completed = pct >= 100;
          return (
            <motion.div
              key={g.id}
              className={`p-5 rounded-xl bg-card border transition-all ${completed ? "border-success/30" : "border-border/50"}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold">{g.title}</h3>
                    <p className="text-xs text-muted-foreground">{g.deadline}</p>
                  </div>
                </div>
                {completed && (
                  <span className="text-xs font-medium bg-success/10 text-success px-2 py-1 rounded-full">
                    Concluída ✓
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    R$ {g.current.toLocaleString("pt-BR")}
                  </span>
                  <span className="font-medium">
                    R$ {g.target.toLocaleString("pt-BR")}
                  </span>
                </div>
                <Progress value={Math.min(pct, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">{pct}% concluído</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
