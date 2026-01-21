import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // We will assume this is generated or use generic for now

// Environment variables should be used here
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
