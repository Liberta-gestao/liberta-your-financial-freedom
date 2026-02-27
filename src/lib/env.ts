const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // Não derruba o app em produção, apenas loga para debug.
  // A tela principal trata o caso de configuração ausente.
  console.error("Configuração Supabase ausente: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
}

export const env = {
  supabaseUrl: url ?? "",
  supabaseAnonKey: anon ?? "",
};

export const envOk = Boolean(url && anon);

