import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, TrendingUp, Wallet, Target, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Saldo Atual", value: "R$ 12.450,00", icon: Wallet, change: "+8.2%", positive: true },
  { label: "Receitas (mês)", value: "R$ 8.500,00", icon: ArrowUp, change: "+12.5%", positive: true },
  { label: "Despesas (mês)", value: "R$ 4.230,00", icon: ArrowDown, change: "-3.1%", positive: false },
  { label: "Meta do mês", value: "68%", icon: Target, change: "R$ 2.000", positive: true },
];

const chartData = [
  { month: "Jan", receita: 6200, despesa: 4100 },
  { month: "Fev", receita: 7100, despesa: 3800 },
  { month: "Mar", receita: 6800, despesa: 4500 },
  { month: "Abr", receita: 7500, despesa: 4200 },
  { month: "Mai", receita: 8200, despesa: 3900 },
  { month: "Jun", receita: 8500, despesa: 4230 },
];

const categories = [
  { name: "Moradia", value: 1500, color: "hsl(14, 90%, 58%)" },
  { name: "Alimentação", value: 980, color: "hsl(25, 95%, 55%)" },
  { name: "Transporte", value: 650, color: "hsl(210, 100%, 60%)" },
  { name: "Lazer", value: 450, color: "hsl(152, 69%, 45%)" },
  { name: "Outros", value: 650, color: "hsl(215, 15%, 55%)" },
];

const recentTransactions = [
  { desc: "Salário", amount: "+R$ 8.500,00", cat: "Receita", date: "01/06", positive: true },
  { desc: "Aluguel", amount: "-R$ 1.500,00", cat: "Moradia", date: "05/06", positive: false },
  { desc: "Supermercado", amount: "-R$ 380,00", cat: "Alimentação", date: "08/06", positive: false },
  { desc: "Freelance", amount: "+R$ 2.000,00", cat: "Receita", date: "10/06", positive: true },
  { desc: "Uber", amount: "-R$ 95,00", cat: "Transporte", date: "12/06", positive: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Olá, João! 👋</h1>
        <p className="text-muted-foreground text-sm">Aqui está seu resumo financeiro de junho.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="p-5 rounded-xl bg-card border border-border/50"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className={`text-xs font-medium ${s.positive ? "text-success" : "text-destructive"}`}>
                {s.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-xl font-bold mt-0.5">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-card border border-border/50">
          <h3 className="font-display font-semibold mb-4">Fluxo de Caixa</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="despesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(14, 90%, 58%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(14, 90%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 95%)" }}
              />
              <Area type="monotone" dataKey="receita" stroke="hsl(152, 69%, 45%)" fill="url(#receita)" strokeWidth={2} />
              <Area type="monotone" dataKey="despesa" stroke="hsl(14, 90%, 58%)" fill="url(#despesa)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/50">
          <h3 className="font-display font-semibold mb-4">Categorias</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categories} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {categories.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categories.map(c => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-medium">R$ {c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-5 rounded-xl bg-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Últimas Transações</h3>
          <button className="text-primary text-sm font-medium hover:underline">Ver todas</button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.positive ? "bg-success/10" : "bg-destructive/10"}`}>
                  {t.positive ? <ArrowUp className="h-4 w-4 text-success" /> : <ArrowDown className="h-4 w-4 text-destructive" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.cat} · {t.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.positive ? "text-success" : "text-foreground"}`}>
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
