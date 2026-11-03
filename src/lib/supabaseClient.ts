 // src/lib/supabaseClient.ts
//
// Reads the project URL and anon key from Vite env vars.
// Set these in .env (local) and in Vercel's Environment Variables (deployed):
//   VITE_SUPABASE_URL=https://xxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);