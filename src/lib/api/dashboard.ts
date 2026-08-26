import type { DashboardData, Notification, PeriodKey } from "@/types";
import { DASHBOARD_DATA } from "@/data/staticData";

// --- THE SWAP POINT ---
// Right now this returns seeded mock data. When your backend is ready,
// replace the body with something like:
//
//   const res = await fetch(`/api/dashboard?period=${period}`);
//   if (!res.ok) throw new Error("Failed to load dashboard data");
//   return res.json();
//
// No component that calls this function needs to change.

const SIMULATED_LATENCY_MS = 300;

export async function fetchDashboardData(period: PeriodKey): Promise<DashboardData> {
  await delay(SIMULATED_LATENCY_MS);
  const data = DASHBOARD_DATA[period];
  if (!data) throw new Error(`Unknown period: ${period}`);
  return data;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "5 pengajuan baru menunggu verifikasi", time: "10 menit lalu", read: false },
  { id: "n2", title: "SLA pengajuan AKR-2026-0142 akan terlampaui besok", time: "1 jam lalu", read: false },
  { id: "n3", title: "Sertifikat SERT-2026-0703 telah diterbitkan", time: "3 jam lalu", read: true },
  { id: "n4", title: "Asesor Budi Santoso menyelesaikan asesmen lapangan", time: "Kemarin", read: true },
];

export async function fetchNotifications(): Promise<Notification[]> {
  await delay(SIMULATED_LATENCY_MS);
  return MOCK_NOTIFICATIONS;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
