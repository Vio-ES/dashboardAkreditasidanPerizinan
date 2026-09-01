import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileCheck2, FileStack, Users2, Award, ArrowRight, Bell } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { GaugeChart } from "@/components/charts/GaugeChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { useDashboardAsesorData, useNotifications } from "@/hooks/useDashboardData";
import type { PeriodKey } from "@/types";
import { fmt } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";
import { Calendar } from "@/components/calendar/Calendar";
import AgendaList from "@/components/calendar/AgendaList";

export function DashboardAssesorPage() {
  const [period, setPeriod] = useState<PeriodKey>("mei2026");
  const { data, isLoading } = useDashboardAsesorData(period);
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  // 1. Controls which month/year the calendar is currently looking at
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // 2. Controls the specific day selected by the user
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Dashboard Assesor" subtitle="Memuat data..." />
        <div className="flex-1 p-6 text-sm text-ink-faint">Memuat dashboard...</div>
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Dashboard Asesor"
        subtitle="Ringkasan aktivitas dan kinerja asesor dalam proses akreditasi LPK"
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={Building2} label="Total Penugasan Aktif" value={data.totalPenugasanAktif} delta={data.penugasanDeltaText} accent="blue" />
          <StatCard icon={FileStack} label="Sedang Berproses" value={data.sedangBerproses} delta={data.sedangBerprosesPct} accent="green" />
          <StatCard icon={FileCheck2} label="Selesai" value={data.selesai} delta={data.selesaiPct} accent="orange" />
          <StatCard icon={Award} label="Rata-rata SLA" value={data.rataRataSla} delta={data.slaStatusText} accent="purple" />
          <StatCard
            icon={Users2}
            label="Kinerja Asesmen"
            value={data.kinerjaAsesmenScore}
            accent="teal"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Donuts + gauge */}
          <div className="col-span-1 row-start-1 flex gap-4">
            <Panel title="Pengajuan Berdasarkan Jenis Layanan" onMore={() => navigate("/modul/mod-pengajuan")}>
              <DonutChart data={data.bebanKerjaSaya} total={data.totalPenugasanAktif} />
            </Panel>
            <Panel title="Status Pengajuan" onMore={() => navigate("/modul/mod-verifikasi")}>
              <DonutChart data={data.penugasanStatus} total={data.totalPenugasanAktif} />
            </Panel>
            <Panel title="SLA Pengajuan" onMore={() => navigate("/modul/mod-monitoring")} center>
              <GaugeChart pct={data.slaGaugePct} />
              <div className="mt-2 text-center text-xs text-ink-faint">
                SLA Terlampaui <b className="text-ink">{fmt(data.slaTerlampauiCount)}</b> dari {fmt(data.totalPenugasanAktif)}
              </div>
            </Panel>
          </div>
          {/* Trend*/}
          <div className="col-span-1 row-start-2 flex gap-4">
            <Panel title="Tren Pengajuan (12 Bulan Terakhir)">
              <TrendChart values={data.trendPerformance} months={data.trendMonths} />
            </Panel>
            <Panel title="Top 5 Provinsi — Pengajuan Terbanyak" onMore={() => navigate("/modul/mod-laporan")}>
              <div className="space-y-3">
                {data.kinerjaDimensi.map((p, i) => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-ink-faint">{i + 1}</span>
                    <span className="flex-1 text-sm text-ink">{p.label}</span>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${(p.score / data.kinerjaDimensi[0].score) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold text-ink">{fmt(p.score)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
          <div className="col-start-2 row-span-2 w-fit space-y-4">
            <Calendar
            currentDate={currentDate}
            onMonthChange={setCurrentDate}
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate}
            />
            <AgendaList
            currentDate={currentDate}
              selectedDate={selectedDate}
              events={data.agendaList}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 pb-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>Sumber Data: SI-LEMLATVOK Kemnaker RI | Data per {data.asOfDate}</span>
          <span>Data Real-time · Integrasi SIAPKerja · Akurat · Transparan · Akuntabel</span>
        </div>
      </div>
    </>
  );
}
