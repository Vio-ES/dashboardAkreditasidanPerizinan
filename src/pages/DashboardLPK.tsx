import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileCheck2, FileStack, Users2, Award, ArrowRight, Bell } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { GaugeChart } from "@/components/charts/GaugeChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { useDashboardLPK, useNotifications } from "@/hooks/useDashboardData";
import type { PeriodKey } from "@/types";
import { fmt } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";
import { ProvinceChart } from "@/components/charts/ProvinceChart";

const STATUS_PEMERINTAH = ['UPTD', 'BLKK'];
const STATUS_SWASTA = ['LPKS', 'BLKLN'];

export function DashboardLPK() {
  const [period, setPeriod] = useState<PeriodKey>("mei2026");
  const { data, isLoading } = useDashboardLPK(period);
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Dashboard Nasional Akreditasi LPK" subtitle="Memuat data..." />
        <div className="flex-1 p-6 text-sm text-ink-faint">Memuat dashboard...</div>
      </>
    );
  }

  const dataPemerintah = data.byStatus.filter((slice) => STATUS_PEMERINTAH.includes(slice.label));
  const dataSwasta = data.byStatus.filter((slice) => STATUS_SWASTA.includes(slice.label));
  const totalPemerintah = dataPemerintah.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
  const totalSwasta = dataSwasta.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);

  return (
    <>
      <Topbar
        title="Dashboard Nasional Lembaga"
        subtitle="Software Pengelolaan Akreditasi Lembaga Pelatihan Vokasi"
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stat cards */}
        <div className="flex overflow-x-auto gap-2.5 snap-x snap-mandatory lg:grid lg:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={Building2} label="Total LPK Terdaftar" value={data.lpk} delta={data.lpkDelta} accent="blue" />
          <StatCard icon={FileStack} label="Total Akreditasi" value={data.akreditasi} delta={data.akreditasiDelta} accent="green" />
          <StatCard icon={FileCheck2} label="Total Verifikasi" value={data.verifikasi} delta={data.verifikasiDelta} accent="orange" />
        </div>

        {/* Donuts + gauge */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          <Panel title="Jumlah Lembaga Pelatihan Pemerintah" onMore={() => navigate("/modul/mod-lpk")}>
            <DonutChart data={dataPemerintah} total={totalPemerintah} />
          </Panel>
          <Panel title="Jumlah Lembaga Pelatihan Swasta" onMore={() => navigate("/modul/mod-lpk")}>
            <DonutChart data={dataSwasta} total={totalSwasta} />
          </Panel>
          {/* <Panel title="Jumlah Lembaga Per Provinsi">
          </Panel>*/}
        </div>

        {/* Trend + top provinces */}
        <div className="">

          <Panel title="Jumlah Lembaga Per Provinsi" onMore={() => navigate("/modul/mod-lpk")}>
            <div className="space-y-3">
              {/* delete the slice for all data shown */}
              <ProvinceChart data={data.byProvinsi.slice(0, 10)}/>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-1 pb-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>Sumber Data: SI-LEMLATVOK Kemnaker RI | Data per {data.asOfDate}</span>
          <span>Data Real-time · Integrasi SIAPKerja · Akurat · Transparan · Akuntabel</span>
        </div>
      </div>
    </>
  );
}
