// Central data-shape definitions.
// Both the mock data layer (src/lib/api) and a future real API must
// conform to these types — that's what makes swapping them a
// one-file change instead of a rewrite.

export type PeriodKey = "mei2026" | "apr2026" | "mar2026" | "q2026" | "y2026";

export interface PeriodOption {
  key: PeriodKey;
  label: string;
}

export interface ChartSlice {
  label: string;
  value: number;
  color: string; // hex, e.g. "#2f6fed"
}

export interface ProcessStep {
  label: string;
  value: number;
  pct: number | null; // null = terminal step (e.g. Sertifikat), no drop-off shown
}

export interface ProvinceCount {
  province: string;
  count: number;
}

export interface DashboardData {
  period: PeriodKey;
  label: string;
  asOfDate: string;

  lpk: number;
  lpkDelta: number;
  akreditasi: number;
  akreditasiDelta: number;
  aktif: number;
  aktifDelta: number;
  sertifikat: number;
  sertifikatDelta: number;
  asesor: number;
  asesorNote: number;

  jenis: ChartSlice[];
  status: ChartSlice[];
  biaya: ChartSlice[];

  sla: number;
  slaOver: number;

  trend: number[]; // 12 months
  trendMonths: string[];

  topProvinces: ProvinceCount[];
  process: ProcessStep[];
  workload: string;
}

// --- Tipe Data Tabel Penugasan Aktif Asesor ---
export interface PenugasanItem {
  no: number;
  kodePenugasan: string;
  lpk: string;
  jenisLayanan: "Akreditasi Baru" | "Reakreditasi" | "Penambahan Program";
  tahap: "Verifikasi" | "Asesmen" | "Review" | "Menunggu Keputusan";
  tglPenugasan: string;
  sla: string;
  status: "Belum Dimulai" | "Sedang Berproses" | "Selesai";
}

// --- Tipe Data Agenda Kalender Asesor ---
export interface AgendaItem {
  id: number;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  category: "Asesmen" | "Review" | "Verifikasi";
}

export interface AgendaListProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: AgendaItem[];
}

export interface CalendarProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

// --- Tipe Data Dimensi Kinerja Asesor ---
export interface KinerjaDimensi {
  label: string;
  score: number; // e.g., 4.8
}

// --- Dashboard Data Khusus Asesor (Selaras dengan Gambar) ---
export interface DashboardAsesorData {
  period: PeriodKey;
  label: string;
  asOfDate: string;
  
  // Header / Profil Info
  asesorName: string;
  asesorId: string;
  
  // Top Stats
  totalPenugasanAktif: number;
  penugasanDeltaText: string;
  sedangBerproses: number;
  sedangBerprosesPct: number;
  selesai: number;
  selesaiPct: number;
  rataRataSla: number;
  slaStatusText: string;
  kinerjaAsesmenScore: number; // e.g., 4.8
  
  // Charts
  bebanKerjaSaya: ChartSlice[];
  penugasanStatus: ChartSlice[];
  slaGaugePct: number;
  slaTerlampauiCount: number;
  
  // Tren & Dimensi Kinerja
  trendPerformance: number[];
  trendMonths: string[];
  kinerjaDimensi: KinerjaDimensi[];
  
  // Widgets Data
  penugasanAktifList: PenugasanItem[];
  agendaList: AgendaItem[];
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

export type ModuleRow = Record<string, string | number>;

export interface ModuleDefinition {
  key: string;
  navLabel: string;
  title: string;
  sub: string;
  addLabel: string;
  cols: string[];
  statusKey: string;
  icon: string; // lucide-react icon name
  showBadge: boolean;
  count: number; // row count, shown as a sidebar badge when showBadge is true
}

export interface ModuleData extends ModuleDefinition {
  rows: ModuleRow[];
}
