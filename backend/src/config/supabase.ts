import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://jhxtkrbgkzfkklcijegt.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Please set SUPABASE_KEY or SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}

// Create Supabase client with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Create Supabase client for user operations (with anon key if provided)
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabaseClient = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : supabase;

export default supabase;












