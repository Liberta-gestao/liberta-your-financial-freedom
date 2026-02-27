import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const monthlyData = [
  { month: "Jan", receita: 6200, despesa: 4100, economia: 2100 },
  { month: "Fev", receita: 7100, despesa: 3800, economia: 3300 },
  { month: "Mar", receita: 6800, despesa: 4500, economia: 2300 },
  { month: "Abr", receita: 7500, despesa: 4200, economia: 3300 },
  { month: "Mai", receita: 8200, despesa: 3900, economia: 4300 },
  { month: "Jun", receita: 8500, despesa: 4230, economia: 4270 },
];

const categoryData = [
  { name: "Moradia", value: 1500, color: "hsl(14, 90%, 58%)" },
  { name: "Alimentação", value: 980, color: "hsl(25, 95%, 55%)" },
  { name: "Transporte", value: 650, color: "hsl(210, 100%, 60%)" },
  { name: "Lazer", value: 450, color: "hsl(152, 69%, 45%)" },
  { name: "Saúde", value: 320, color: "hsl(280, 70%, 55%)" },
  { name: "Educação", value: 280, color: "hsl(38, 92%, 50%)" },
];

const tooltipStyle = { background: "hsl(220, 20%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" };

export default function BIPage() {
  const [period, setPeriod] = useState("6m");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Análises & BI</h1>
          <p className="text-muted-foreground text-sm">Visão completa das suas finanças</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32 bg-secondary border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 mês</SelectItem>
            <SelectItem value="3m">3 meses</SelectItem>
            <SelectItem value="6m">6 meses</SelectItem>
            <SelectItem value="1y">1 ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Economizado", value: "R$ 19.570", color: "text-success" },
          { label: "Média Mensal", value: "R$ 3.261", color: "text-info" },
          { label: "Maior Gasto", value: "Moradia", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-xl bg-card border border-border/50">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`font-display text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-card border border-border/50">
          <h3 className="font-display font-semibold mb-4">Receita vs Despesa</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="receita" fill="hsl(152, 69%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="hsl(14, 90%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/50">
          <h3 className="font-display font-semibold mb-4">Economia Acumulada</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="economia" stroke="hsl(210, 100%, 60%)" strokeWidth={2} dot={{ fill: "hsl(210, 100%, 60%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories pie */}
      <div className="p-5 rounded-xl bg-card border border-border/50">
        <h3 className="font-display font-semibold mb-4">Distribuição por Categoria</h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ResponsiveContainer width="100%" height={250} className="max-w-xs">
            <PieChart>
              <Pie data={categoryData} innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="font-medium ml-auto">R$ {c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
