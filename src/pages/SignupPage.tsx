import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import logoColorido from "@/assets/logo_liberta_colorido.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (error) throw error;
      toast.success("Conta criada!", { description: "Bem-vindo ao seu teste grátis de 4 dias." });
      navigate("/app");
    } catch (err) {
      toast.error("Não foi possível criar sua conta", { description: String((err as any)?.message ?? err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src={logoColorido} alt="Liberta" className="h-10 mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm mt-1">4 dias grátis. Sem cartão de crédito.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} className="h-11 bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-11 bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Min. 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} className="h-11 bg-secondary border-border" />
          </div>
          <Button variant="hero" className="w-full h-11" type="submit" disabled={busy}>
            Criar Conta Grátis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <button className="text-primary hover:underline font-medium" onClick={() => navigate("/login")}>Fazer login</button>
        </p>
      </div>
    </div>
  );
}
