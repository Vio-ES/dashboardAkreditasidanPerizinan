// src/lib/api/dashboard.ts
//
// THE SWAP POINT (now wired to Supabase — partial, worked example).
//
// Three dashboards read from here:
//   - fetchDashboardData      -> general/admin dashboard (DashboardData)
//   - fetchDashboardLPK       -> LPK-facing view, same shape as above
//                                (matches your original mock, which
//                                 reused DASHBOARD_DATA for both)
//   - fetchDashboardAsesorData -> assessor-facing dashboard
//                                (DashboardAsesorData — a different,
//                                 larger shape)
//
// `status`, `jenis`, `topProvinces`, `penugasanAktifList` and
// `agendaList` below are real queries. Everything else is stubbed
// with TODOs — same pattern as before, extend as needed.

import type {
  AgendaItem,
  DashboardAsesorData,
  DashboardData,
  Notification,
  PenugasanItem,
  PeriodKey,
} from "@/types";
import { supabase } from "@/lib/supabaseClient";

function periodToDateRange(period: PeriodKey): { from: string; to: string } {
  const ranges: Record<PeriodKey, { from: string; to: string }> = {
    mei2026: { from: "2026-05-01", to: "2026-05-31" },
    apr2026: { from: "2026-04-01", to: "2026-04-30" },
    mar2026: { from: "2026-03-01", to: "2026-03-31" },
    q2026: { from: "2026-01-01", to: "2026-03-31" },
    y2026: { from: "2026-01-01", to: "2026-12-31" },
  };
  return ranges[period];
}

const PALETTE = ["#2f6fed", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function groupBy<T extends Record<string, unknown>>(
  rows: T[] | null,
  key: keyof T
): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const row of rows ?? []) {
    const label = String(row[key]);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts, ([label, value]) => ({ label, value }));
}

export async function fetchDashboardData(period: PeriodKey): Promise<DashboardData> {
  const { from, to } = periodToDateRange(period);

  const [statusRes, jenisRes, provincesRes] = await Promise.all([
    supabase
      .from("pengajuan")
      .select("status")
      .gte("tanggal_ajuan", from)
      .lte("tanggal_ajuan", to),
    supabase
      .from("pengajuan")
      .select("jenis_layanan")
      .gte("tanggal_ajuan", from)
      .lte("tanggal_ajuan", to),
    supabase.from("v_dashboard_top_provinces").select("*"),
  ]);

  if (statusRes.error) throw new Error(statusRes.error.message);
  if (jenisRes.error) throw new Error(jenisRes.error.message);
  if (provincesRes.error) throw new Error(provincesRes.error.message);

  const status = groupBy(statusRes.data, "status");
  const jenis = groupBy(jenisRes.data, "jenis_layanan");

  // TODO: replace placeholders with real queries the same way —
  // biaya (group pembiayaan by sumber_dana), sla/slaOver (compare
  // sla_deadline to today), trend (v_dashboard_trend), process
  // (count per tahap), workload, and the *Delta fields (compare to
  // the previous period's counts).
  return {
    period,
    label: period,
    asOfDate: new Date().toISOString().slice(0, 10),
    lpk: 0,
    lpkDelta: 0,
    akreditasi: status.reduce((sum, s) => sum + s.value, 0),
    akreditasiDelta: 0,
    aktif: status.find((s) => s.label === "Sedang Berproses")?.value ?? 0,
    aktifDelta: 0,
    sertifikat: status.find((s) => s.label === "Selesai")?.value ?? 0,
    sertifikatDelta: 0,
    asesor: 0,
    asesorNote: 0,
    jenis: jenis.map((j, i) => ({ ...j, color: PALETTE[i % PALETTE.length] })),
    status: status.map((s, i) => ({ ...s, color: PALETTE[i % PALETTE.length] })),
    biaya: [],
    sla: 0,
    slaOver: 0,
    trend: [],
    trendMonths: [],
    topProvinces: provincesRes.data ?? [],
    process: [],
    workload: "",
  };
}

// Your original mock reused the same DashboardData for the LPK view —
// keeping that here. Split this into its own query later if the LPK
// dashboard should show LPK-scoped data instead of the global view.
export async function fetchDashboardLPK(period: PeriodKey): Promise<DashboardData> {
  return fetchDashboardData(period);
}

export async function fetchDashboardAsesorData(
  period: PeriodKey,
  // No login yet, so this can't be tied to "the current assessor."
  // Once auth exists, pass the logged-in asesor's id here instead.
  asesorId?: string
): Promise<DashboardAsesorData> {
  // Fall back to the first assessor in the table so this at least
  // runs end to end before auth is wired up.
  let resolvedAsesorId = asesorId;
  let asesorName = "";
  if (!resolvedAsesorId) {
    const { data } = await supabase.from("asesor").select("id, nama").limit(1).single();
    resolvedAsesorId = data?.id;
    asesorName = data?.nama ?? "";
  }

  const [penugasanRes, agendaRes] = await Promise.all([
    supabase
      .from("v_mod_penugasan")
      .select("*")
      .eq("Asesor Ditugaskan", asesorName),
    supabase
      .from("agenda")
      .select("id, tanggal, waktu, judul, kategori")
      .eq("asesor_id", resolvedAsesorId ?? ""),
  ]);

  const penugasanAktifList: PenugasanItem[] = (penugasanRes.data ?? []).map(
    (row: any, i: number) => ({
      no: i + 1,
      kodePenugasan: row["ID Pengajuan"],
      lpk: row["Nama LPK"],
      jenisLayanan: "Akreditasi Baru",
      tahap: "Verifikasi",
      tglPenugasan: row["Tanggal Penugasan"],
      sla: "",
      status: row["Status"],
    })
  );

  const agendaList: AgendaItem[] = (agendaRes.data ?? []).map((row: any) => ({
    id: row.id,
    date: row.tanggal,
    time: row.waktu,
    title: row.judul,
    category: row.kategori,
  }));

  // TODO: everything below is a placeholder. Replace with real
  // aggregate queries the same way fetchDashboardData does —
  // bebanKerjaSaya/penugasanStatus (group penugasan by status),
  // sla figures (compare sla_deadline to today for this asesor),
  // trendPerformance (monthly counts), kinerjaDimensi (needs a
  // scoring source you haven't defined yet).
  return {
    period,
    label: period,
    asOfDate: new Date().toISOString().slice(0, 10),
    asesorName,
    asesorId: resolvedAsesorId ?? "",
    totalPenugasanAktif: penugasanAktifList.length,
    penugasanDeltaText: "",
    sedangBerproses: penugasanAktifList.filter((p) => p.status === "Sedang Berproses").length,
    sedangBerprosesPct: 0,
    selesai: penugasanAktifList.filter((p) => p.status === "Selesai").length,
    selesaiPct: 0,
    rataRataSla: 0,
    slaStatusText: "",
    kinerjaAsesmenScore: 0,
    bebanKerjaSaya: [],
    penugasanStatus: [],
    slaGaugePct: 0,
    slaTerlampauiCount: 0,
    trendPerformance: [],
    trendMonths: [],
    kinerjaDimensi: [],
    penugasanAktifList,
    agendaList,
  };
}

export async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifikasi")
    .select("id, judul, dibuat_pada, dibaca")
    .order("dibuat_pada", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []).map((n) => ({
    id: n.id,
    title: n.judul,
    time: n.dibuat_pada,
    read: n.dibaca,
  }));
}