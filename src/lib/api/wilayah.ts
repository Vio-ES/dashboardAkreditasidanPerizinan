import { supabase } from "../supabaseClient";

export async function fetchProvinces() {
  const [provinsiRes] = await Promise.all([
    supabase
      .from("provinces")
      .select("id, nama")
      .order("nama", { ascending: true }),
  ]);

  if (provinsiRes.error) throw new Error(provinsiRes.error.message);

  return provinsiRes.data;
}

export async function fetchKabupatenKota(provinsiId: number) {
  const [KabupatenKota] = await Promise.all([
    supabase
      .from("kabupaten_kota")
      .select("id, nama, provinsi_id")
      .eq("provinsi_id", provinsiId)
      .order("nama", { ascending: true }),
  ]);

  if (KabupatenKota.error) throw new Error(KabupatenKota.error.message);

  return KabupatenKota.data;
}
