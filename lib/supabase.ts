import { createClient } from '@supabase/supabase-js';

// El modo demo permite presentar la plantilla antes de conectar Supabase.
// En producción, las variables reales de Vercel toman prioridad.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
