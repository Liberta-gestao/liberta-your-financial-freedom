function requireEnv(name: string): string {
  const v = import.meta.env[name];
  if (!v || typeof v !== "string") {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return v;
}

export const env = {
  supabaseUrl: requireEnv("VITE_SUPABASE_URL"),
  supabaseAnonKey: requireEnv("VITE_SUPABASE_ANON_KEY"),
};

