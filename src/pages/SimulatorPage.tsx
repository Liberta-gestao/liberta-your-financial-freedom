import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calculator } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SimulatorPage() {
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const data = Array.from({ length: years * 12 + 1 }, (_, i) => {
    const monthlyRate = rate / 100 / 12;
    const invested = initial + monthly * i;
    const total = initial * Math.pow(1 + monthlyRate, i) + monthly * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate);
    return {
      month: i,
      investido: Math.round(invested),
      total: Math.round(total),
    };
  });

  const finalData = data[data.length - 1];
  const profit = finalData.total - finalData.investido;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Simulador de Investimentos</h1>
        <p className="text-muted-foreground text-sm">Projete o crescimento do seu patrimônio</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-5 rounded-xl bg-card border border-border/50 space-y-5">
          <div className="space-y-2">
            <Label>Investimento Inicial (R$)</Label>
            <Input type="number" value={initial} onChange={e => setInitial(+e.target.value)} className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label>Aporte Mensal (R$)</Label>
            <Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label>Taxa Anual (%): {rate}%</Label>
            <Slider value={[rate]} onValueChange={v => setRate(v[0])} min={1} max={30} step={0.5} />
          </div>
          <div className="space-y-2">
            <Label>Período: {years} anos</Label>
            <Slider value={[years]} onValueChange={v => setYears(v[0])} min={1} max={30} />
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-card border border-border/50">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Total Investido</p>
              <p className="font-display text-lg font-bold text-info">R$ {finalData.investido.toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rendimento</p>
              <p className="font-display text-lg font-bold text-success">R$ {profit.toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Final</p>
              <p className="font-display text-lg font-bold text-primary">R$ {finalData.total.toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.filter((_, i) => i % 3 === 0 || i === data.length - 1)}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(14, 90%, 58%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(14, 90%, 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} tickFormatter={v => `${Math.floor(v/12)}a`} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220, 20%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }} />
              <Area type="monotone" dataKey="investido" stroke="hsl(210, 100%, 60%)" fill="url(#investGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="total" stroke="hsl(14, 90%, 58%)" fill="url(#totalGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
