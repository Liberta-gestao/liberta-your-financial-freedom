import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TransactionRow = {
  id: string;
  amount_cents: number;
  type: "income" | "expense";
  category: string | null;
  description: string | null;
  date: string;
};

export default function TransactionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "" as "" | "income" | "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id,amount_cents,type,category,description,date")
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TransactionRow[];
    },
  });

  const createTx = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Sem sessão");
      const amountNumber = Number(String(form.amount).replace(",", "."));
      if (!Number.isFinite(amountNumber) || amountNumber <= 0) throw new Error("Valor inválido");
      if (!form.type) throw new Error("Selecione o tipo");
      if (!form.date) throw new Error("Selecione a data");

      const amountCents = Math.round(amountNumber * 100);
      const signed = form.type === "expense" ? -amountCents : amountCents;

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount_cents: signed,
        type: form.type,
        category: form.category || null,
        description: form.description || null,
        date: form.date,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Lançamento salvo");
      setOpen(false);
      setForm((p) => ({ ...p, description: "", amount: "", category: "" }));
      await qc.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
    onError: (e) => {
      toast.error("Não foi possível salvar", { description: String((e as any)?.message ?? e) });
    },
  });

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const mappedType = t.type === "income" ? "receita" : "despesa";
      if (filterType !== "all" && mappedType !== filterType) return false;
      if (search && !(t.description ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filterType, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Lançamentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Novo Lançamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Supermercado"
                  className="bg-secondary border-border"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  inputMode="decimal"
                  placeholder="0,00"
                  className="bg-secondary border-border"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as any }))}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moradia">Moradia</SelectItem>
                      <SelectItem value="Alimentação">Alimentação</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Lazer">Lazer</SelectItem>
                      <SelectItem value="Trabalho">Trabalho</SelectItem>
                      <SelectItem value="Investimentos">Investimentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  className="bg-secondary border-border"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <Button variant="hero" className="w-full" onClick={() => createTx.mutate()} disabled={createTx.isPending}>
                Salvar Lançamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-36 bg-secondary border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="receita">Receitas</SelectItem>
            <SelectItem value="despesa">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="rounded-xl bg-card border border-border/50 divide-y divide-border/30">
        {isLoading && (
          <div className="px-5 py-6 text-sm text-muted-foreground">Carregando lançamentos...</div>
        )}
        {filtered.map(t => (
          <div key={t.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.amount_cents > 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                {t.amount_cents > 0 ? <ArrowUp className="h-4 w-4 text-success" /> : <ArrowDown className="h-4 w-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-medium">{t.description ?? "Sem descrição"}</p>
                <p className="text-xs text-muted-foreground">{t.category ?? "—"} · {new Date(t.date).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${t.amount_cents > 0 ? "text-success" : "text-foreground"}`}>
              {t.amount_cents > 0 ? "+" : ""}R$ {(Math.abs(t.amount_cents) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
