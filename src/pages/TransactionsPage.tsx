import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockTransactions = [
  { id: 1, desc: "Salário", amount: 8500, type: "receita", category: "Trabalho", date: "2026-06-01" },
  { id: 2, desc: "Aluguel", amount: -1500, type: "despesa", category: "Moradia", date: "2026-06-05" },
  { id: 3, desc: "Supermercado", amount: -380, type: "despesa", category: "Alimentação", date: "2026-06-08" },
  { id: 4, desc: "Freelance Design", amount: 2000, type: "receita", category: "Trabalho", date: "2026-06-10" },
  { id: 5, desc: "Uber", amount: -95, type: "despesa", category: "Transporte", date: "2026-06-12" },
  { id: 6, desc: "Netflix", amount: -55.9, type: "despesa", category: "Lazer", date: "2026-06-13" },
  { id: 7, desc: "Restaurante", amount: -120, type: "despesa", category: "Alimentação", date: "2026-06-15" },
  { id: 8, desc: "Dividendos", amount: 350, type: "receita", category: "Investimentos", date: "2026-06-18" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = mockTransactions.filter(t => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (search && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Lançamentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog>
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
                <Input placeholder="Ex: Supermercado" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input type="number" placeholder="0,00" className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moradia">Moradia</SelectItem>
                      <SelectItem value="alimentacao">Alimentação</SelectItem>
                      <SelectItem value="transporte">Transporte</SelectItem>
                      <SelectItem value="lazer">Lazer</SelectItem>
                      <SelectItem value="trabalho">Trabalho</SelectItem>
                      <SelectItem value="investimentos">Investimentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" className="bg-secondary border-border" />
              </div>
              <Button variant="hero" className="w-full">Salvar Lançamento</Button>
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
        {filtered.map(t => (
          <div key={t.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.amount > 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                {t.amount > 0 ? <ArrowUp className="h-4 w-4 text-success" /> : <ArrowDown className="h-4 w-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-medium">{t.desc}</p>
                <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.date).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${t.amount > 0 ? "text-success" : "text-foreground"}`}>
              {t.amount > 0 ? "+" : ""}R$ {Math.abs(t.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
