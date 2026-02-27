import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type GoalRow = {
  id: string;
  title: string;
  target_cents: number;
  current_cents: number;
  deadline: string | null;
  status: string;
};

export default function GoalsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    target: "",
    current: "",
    deadline: "",
  });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("id,title,target_cents,current_cents,deadline,status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as GoalRow[];
    },
  });

  const createGoal = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Sem sessão");
      const target = Number(String(form.target).replace(",", "."));
      const current = form.current ? Number(String(form.current).replace(",", ".")) : 0;
      if (!form.title.trim()) throw new Error("Título obrigatório");
      if (!Number.isFinite(target) || target <= 0) throw new Error("Meta inválida");
      if (!Number.isFinite(current) || current < 0) throw new Error("Valor atual inválido");

      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        title: form.title.trim(),
        target_cents: Math.round(target * 100),
        current_cents: Math.round(current * 100),
        deadline: form.deadline ? form.deadline : null,
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Meta criada");
      setOpen(false);
      setForm({ title: "", target: "", current: "", deadline: "" });
      await qc.invalidateQueries({ queryKey: ["goals", user?.id] });
    },
    onError: (e) => {
      toast.error("Não foi possível criar", { description: String((e as any)?.message ?? e) });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Metas Financeiras</h1>
          <p className="text-muted-foreground text-sm">Acompanhe seus objetivos de economia</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm"><Plus className="h-4 w-4 mr-2" /> Nova Meta</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Nova Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input className="bg-secondary border-border" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta (R$)</Label>
                  <Input className="bg-secondary border-border" inputMode="decimal" value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Atual (R$)</Label>
                  <Input className="bg-secondary border-border" inputMode="decimal" value={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prazo</Label>
                <Input type="date" className="bg-secondary border-border" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} />
              </div>
              <Button variant="hero" className="w-full" onClick={() => createGoal.mutate()} disabled={createGoal.isPending}>
                Criar Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading && (
          <div className="p-5 rounded-xl bg-card border border-border/50 text-sm text-muted-foreground">
            Carregando metas...
          </div>
        )}
        {goals.map((g, i) => {
          const target = g.target_cents / 100;
          const current = g.current_cents / 100;
          const pct = Math.round((current / target) * 100);
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
                  <div>
                    <h3 className="font-display font-semibold">{g.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {g.deadline ? new Date(g.deadline).toLocaleDateString("pt-BR") : "Sem prazo"}
                    </p>
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
                    R$ {current.toLocaleString("pt-BR")}
                  </span>
                  <span className="font-medium">
                    R$ {target.toLocaleString("pt-BR")}
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
