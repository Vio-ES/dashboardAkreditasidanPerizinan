// src/lib/api/modules.ts
//
// THE SWAP POINT (now wired to Supabase).
// Module *labels/icons* stay as static config (they're UI metadata,
// not data) — only the rows and counts come from the database, via
// the v_mod_* views defined in supabase-schema.sql.

import type { ModuleData, ModuleDefinition, ModuleRow } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { getModuleDefinitions } from "@/data/staticData";

const VIEW_BY_KEY: Record<string, string> = {
  "mod-pengajuan": "v_mod_pengajuan",
  "mod-lpk": "v_mod_lpk",
  "mod-verifikasi": "v_mod_verifikasi",
  "mod-penugasan": "v_mod_penugasan",
  "mod-asesmen": "v_mod_asesmen",
  "mod-review": "v_mod_review",
  "mod-keputusan": "v_mod_keputusan",
  "mod-sertifikat": "v_mod_sertifikat",
  "mod-pembiayaan": "v_mod_pembiayaan",
  "mod-monitoring": "v_mod_monitoring",
  "mod-laporan": "v_mod_laporan",
};

const TABLE_BY_KEY: Record<string, string> = {
  "mod-pengajuan": "pengajuan",
  "mod-lpk": "lpk",
  "mod-verifikasi": "verifikasi",
  "mod-penugasan": "penugasan",
  "mod-asesmen": "asesmen",
  "mod-review": "review",
  "mod-keputusan": "keputusan",
  "mod-sertifikat": "sertifikat",
  "mod-pembiayaan": "pembiayaan",
};

export async function fetchModuleDefinitions(): Promise<ModuleDefinition[]> {
  const definitions = getModuleDefinitions();

  const withCounts = await Promise.all(
    definitions.map(async (def: ModuleDefinition) => {
      const view = VIEW_BY_KEY[def.key];
      if (!view) return def;
      const { count, error } = await supabase
        .from(view)
        .select("*", { count: "exact", head: true });
      if (error) {
        console.error(`Failed to count ${view}`, error);
        return def;
      }
      return { ...def, count: count ?? 0 };
    })
  );
  return withCounts;
}

export async function fetchModuleData(key: string): Promise<ModuleData> {
  const definitions = getModuleDefinitions();
  const def = definitions.find((m: ModuleDefinition) => m.key === key);
  const view = VIEW_BY_KEY[key];
  if (!def || !view) throw new Error(`Unknown module: ${key}`);

  const { data, error } = await supabase.from(view).select("*");
  console.log("DEBUG", key, view, { data, error });
  if (error) throw new Error(`Failed to load ${key}: ${error.message}`);

  return { ...def, rows: (data ?? []) as ModuleRow[] };
}

export async function createModuleRow(
  key: string,
  payload: Record<string, unknown>
): Promise<void> {
  const table = TABLE_BY_KEY[key];
  if (!table) {
    throw new Error(
      `No writable table mapped for module "${key}" yet — add it to TABLE_BY_KEY.`
    );
  }
  // NOTE: payload here is whatever the "Tambah Data" form collects,
  // keyed by the *view's* display column names (e.g. "Nama LPK").
  // You'll want a small per-module mapper from display columns to
  // real column/foreign-key values (e.g. looking up lpk_id from a
  // chosen LPK name) before inserting — that logic belongs here,
  // not in the UI component.
  const { error } = await supabase.from(table).insert(payload);
  if (error) throw new Error(`Failed to create row in ${table}: ${error.message}`);
}