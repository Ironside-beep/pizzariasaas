// client.ts - Ajustado para usar a ANON_KEY corretamente
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Pega os valores do .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Logs de verificação no console do navegador
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_KEY present?:', !!SUPABASE_KEY);

// Cria o client do Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export default supabase;
