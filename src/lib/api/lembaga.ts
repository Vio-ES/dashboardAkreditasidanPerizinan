import { supabase } from "@/lib/supabaseClient";

export async function fetchLembagaDetail(id: string) {
  const { data, error } = await supabase
    .from("lpk_bersih")
    .select("*")
    .eq("uuid", id)
    .single();

  if (error) throw new Error(`Failed to load lembaga: ${error.message}`);
  return data;
}