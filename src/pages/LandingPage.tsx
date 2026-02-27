import { motion, type Variants } from "framer-motion";
import { ArrowRight, BarChart3, Brain, Shield, Smartphone, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import { useNavigate } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const features = [
  { icon: BarChart3, title: "Dashboard de BI", desc: "Gráficos interativos e relatórios avançados do seu fluxo financeiro." },
  { icon: Brain, title: "Insights por IA", desc: "Análise inteligente que identifica padrões e sugere economia." },
  { icon: Target, title: "Metas Financeiras", desc: "Defina, acompanhe e conquiste seus objetivos de economia." },
  { icon: Zap, title: "Simulador de Investimentos", desc: "Simule rendimentos em renda fixa, variável e muito mais." },
  { icon: Smartphone, title: "Lançamentos por WhatsApp", desc: "Registre transações enviando uma mensagem simples." },
  { icon: Shield, title: "Conexão Bancária Segura", desc: "Sincronize contas via Open Finance com total segurança." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container flex items-center justify-between h-16">
          <img src={logoWhite} alt="Liberta" className="h-7" />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preço</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Entrar</Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/signup")}>
              Teste Grátis <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" /> Sua liberdade financeira começa aqui
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Controle suas finanças com{" "}
            <span className="text-gradient">inteligência</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            O Liberta combina IA avançada, dashboards de BI e automações inteligentes para você tomar as melhores decisões financeiras.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Button variant="hero" size="lg" className="text-base px-8 h-12" onClick={() => navigate("/signup")}>
              Comece Grátis por 4 Dias <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 h-12">
              Ver Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Ferramentas poderosas para transformar sua vida financeira.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Simples e acessível</h2>
            <p className="text-muted-foreground mb-10">Comece grátis. Sem cartão de crédito.</p>

            <div className="rounded-2xl border border-primary/30 bg-card p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
              <div className="mb-6">
                <span className="text-5xl font-display font-bold text-gradient">R$ 21,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="text-sm text-left space-y-3 mb-8">
                {["Dashboard de BI completo", "Insights por IA ilimitados", "Simulador de investimentos", "Assistente financeiro IA", "Lançamentos via WhatsApp", "Conexão bancária Open Finance"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="w-full h-12 text-base" onClick={() => navigate("/signup")}>
                Iniciar Teste Grátis de 4 Dias
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logoWhite} alt="Liberta" className="h-5 opacity-60" />
          <p className="text-sm text-muted-foreground">© 2026 Liberta. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
