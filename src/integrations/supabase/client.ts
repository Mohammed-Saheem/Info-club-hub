// Supabase client - only used if Supabase is configured
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Only create Supabase client if both URL and key are provided
let supabase: SupabaseClient<Database> | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

export { supabase };