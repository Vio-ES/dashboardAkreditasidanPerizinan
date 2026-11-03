import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileCheck2, FileStack } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { useDashboardLPK, useNotifications } from "@/hooks/useDashboardData";
import type { PeriodKey } from "@/types";
import { Panel } from "@/components/ui/Panel";
import { ProvinceChart } from "@/components/charts/ProvinceChart";
import { GrafikLembagaGabungan } from "@/components/charts/GrafikLembagaGabungan";

const STATUS_PEMERINTAH = ["UPTD", "BLKK"];
const STATUS_SWASTA = ["LPKS", "BLKLN"];
const JENIS_LEMBAGA = ["LPKS", "BLKLN", "UPTD", "BLKK"];
type grafik = "bar" | "peta";

export function DashboardLPK() {
  const [period, setPeriod] = useState<PeriodKey>("y2020");
  const { data, isLoading } = useDashboardLPK(period);
  const [grafik, setGrafik] = useState<grafik>("bar");
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  if (isLoading || !data) {
    return (
      <>
        <Topbar
          title="Dashboard Nasional Akreditasi LPK"
          subtitle="Memuat data..."
        />
        <div className="flex-1 p-6 text-sm text-ink-faint">
          Memuat dashboard...
        </div>
      </>
    );
  }

  const dataPemerintah = data.byStatus.filter((slice) =>
    STATUS_PEMERINTAH.includes(slice.label),
  );
  const dataSwasta = data.byStatus.filter((slice) =>
    STATUS_SWASTA.includes(slice.label),
  );
  const totalPemerintah = dataPemerintah.reduce(
    (accumulator, currentValue) => accumulator + currentValue.value,
    0,
  );
  const totalSwasta = dataSwasta.reduce(
    (accumulator, currentValue) => accumulator + currentValue.value,
    0,
  );

  {
    data.byProvinsi.map((d) => console.log(d));
  }

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
          <StatCard
            icon={Building2}
            label="Total LPK Terdaftar"
            value={data.lpk}
            delta={data.lpkDelta}
            accent="blue"
          />
          <StatCard
            icon={FileStack}
            label="Total Akreditasi"
            value={data.akreditasi}
            delta={data.akreditasiDelta}
            accent="green"
          />
          <StatCard
            icon={FileCheck2}
            label="Total Verifikasi"
            value={data.verifikasi}
            delta={data.verifikasiDelta}
            accent="orange"
          />
        </div>

        {/* Donuts + gauge */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4">
          <Panel
            title="Jumlah Lembaga Pelatihan Pemerintah"
            onMore={() => navigate("/modul/mod-lpk")}
          >
            <DonutChart data={dataPemerintah} total={totalPemerintah} />
          </Panel>
          <Panel
            title="Jumlah Lembaga Pelatihan Swasta"
            onMore={() => navigate("/modul/mod-lpk")}
          >
            <DonutChart data={dataSwasta} total={totalSwasta} />
          </Panel>
          <div className="col-span-2">
            <Panel title="Jumlah Lembaga Per Tahun">
              <GrafikLembagaGabungan data={data.GrafikGabunganRow} />
              {/* <GrafikLembagaTahun data={data.grafikTahun.LPKS} /> */}
            </Panel>
          </div>
        </div>

        {/* Sebaran + top provinces */}
        <div className="bg-white rounded-md">
          <div className="flex gap-3 p-4">
            <button
              onClick={() => setGrafik("bar")}
              className="btn btn-sm active:btn-accent"
            >
              Bar
            </button>
            <button
              onClick={() => setGrafik("peta")}
              className="btn btn-sm active:btn-accent"
            >
              Peta
            </button>
          </div>
          {grafik === "bar" && (
            <Panel
              title="Jumlah Lembaga Per Provinsi Top 5"
              onMore={() => navigate("/modul/mod-lpk")}
            >
              <div className="space-y-3">
                {/* delete the slice for all data shown */}
                <ProvinceChart data={data.byProvinsi.slice(0, 5)} />
              </div>
            </Panel>
          )}
          {grafik === "peta" && (
            <Panel
              title="Sebaran Lembaga Per Provinsi Indonesia"
              onMore={() => navigate("/modul/mod-lpk")}
            >
              <div className="space-y-3">
                <ProvinceChart data={data.byProvinsi.slice(0, 5)} />
              </div>
            </Panel>
          )}
        </div>

        <div className="flex flex-col gap-1 pb-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            Sumber Data: SI-LEMLATVOK Kemnaker RI | Data per {data.asOfDate}
          </span>
          <span>
            Data Real-time · Integrasi SIAPKerja · Akurat · Transparan ·
            Akuntabel
          </span>
        </div>
      </div>
    </>
  );
}
