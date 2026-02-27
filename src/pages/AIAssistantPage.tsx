import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import iconLiberta from "@/assets/icone_liberta.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Olá! 👋 Sou o assistente financeiro do Liberta. Posso te ajudar com dicas financeiras, registrar lançamentos ou analisar seus gastos. Como posso te ajudar hoje?"
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated AI response
    setTimeout(() => {
      const responses = [
        "Analisando seus gastos do último mês, você gastou 35% em moradia, o que está dentro do recomendado. Porém, seus gastos com alimentação fora aumentaram 15% comparado ao mês anterior. Quer que eu sugira formas de economizar nessa categoria?",
        "Com base no seu fluxo de caixa, você pode aumentar seu aporte mensal para investimentos em R$ 200 sem comprometer suas despesas essenciais. Isso aceleraria sua meta de Reserva de Emergência em 3 meses!",
        "Lembrete: sua fatura do cartão vence em 3 dias, no valor de R$ 1.230,00. Posso te ajudar a organizar o pagamento?",
      ];
      setMessages(prev => [...prev, { role: "assistant", content: responses[Math.floor(Math.random() * responses.length)] }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold">Assistente Financeiro IA</h1>
        <p className="text-muted-foreground text-sm">Seu consultor financeiro pessoal, 24/7</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-primary/20" : "bg-secondary"}`}>
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-primary" />
              ) : (
                <img src={iconLiberta} alt="" className="h-5 w-5 rounded" />
              )}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-secondary text-secondary-foreground rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <img src={iconLiberta} alt="" className="h-5 w-5 rounded" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-border mt-2">
        <Input
          placeholder="Digite sua pergunta financeira..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          className="bg-secondary border-border"
        />
        <Button variant="hero" size="icon" onClick={handleSend} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
