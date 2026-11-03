import type { ModuleData, ModuleDefinition } from "@/types";
import { getModuleData as getSeededModuleData, getModuleDefinitions } from "@/data/staticData";

// --- THE SWAP POINT ---
// Replace the bodies below with real requests, e.g.:
//   const res = await fetch(`/api/modules/${key}`);
//   return res.json();
// Every page/component only imports from this file, never from
// src/data/staticData directly, so the swap stays contained here.

const SIMULATED_LATENCY_MS = 250;

export async function fetchModuleDefinitions(): Promise<ModuleDefinition[]> {
  await delay(SIMULATED_LATENCY_MS);
  return getModuleDefinitions();
}

export async function fetchModuleData(key: string): Promise<ModuleData> {
  await delay(SIMULATED_LATENCY_MS);
  const data = getSeededModuleData(key);
  if (!data) throw new Error(`Unknown module: ${key}`);
  return data;
}

export async function createModuleRow(key: string, _payload: Record<string, unknown>): Promise<void> {
  // Placeholder for POST /api/modules/:key. Wire this up to your
  // backend's create endpoint once it exists; for now it's a no-op
  // so the "Tambah Data" flow in the UI has somewhere to call.
  await delay(SIMULATED_LATENCY_MS);
  console.info(`[mock] would create row in ${key}`, _payload);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
