import { useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MultiSelectDropdown } from "../ui/MultiSelectDropdown";

interface GrafikLembagaGabunganProps {
  data: Record<string, number>[];
}

const jenisLembaga = ["LPKS", "BLKLN", "UPTD", "BLKK"];
const jenisTahun = ["2019", "2020"];

const statusWarna = [
  { nama: "Terakreditasi", label: "Terakreditasi" },
  { nama: "BelumTerakreditasi", label: "Belum Terakreditasi" },
  { nama: "BelumAdaData", label: "Belum Ada Data" },
];

const warnaLembaga: Record<string, string[]> = {
  LPKS: ["#15406A", "#56849F", "#A0BECD"],
  BLKLN: ["#426B3C", "#65A853", "#B7D6A8"],
  UPTD: ["#78551D", "#B88735", "#E5C98A"],
  BLKK: ["#713D67", "#A66A98", "#D9B6D2"],
};

export function GrafikLembagaGabungan({ data }: GrafikLembagaGabunganProps) {
  const [jenis, setJenis] = useState<string[]>(jenisLembaga);
  const [satuTahun, setTahun] = useState<string[]>(jenisTahun);

  function toggle(
    tombol: string,
    kelompok: string[],
    terpilih: string[],
    func: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    if (terpilih.length === kelompok.length) {
      func([tombol]);
      return;
    }
    const baru = terpilih.includes(tombol)
      ? terpilih.filter((b) => b !== tombol)
      : [...terpilih, tombol];
    func(baru.length === 0 ? kelompok : baru);
  }

  return (
    <div className="h-fit min-w-0 space-y-4">
      <div className="flex flex-col gap-3">
        {/* Filter jenis lembaga */}
        <MultiSelectDropdown
          label="Jenis Lembaga"
          options={jenisLembaga}
          selected={jenis}
          onChange={setJenis}
        />

        <MultiSelectDropdown
          label="Tahun"
          options={jenisTahun}
          selected={satuTahun}
          onChange={setTahun}
        />
      </div>
      <div className="h-[240px] w-full sm:h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.filter((item) => satuTahun.includes(String(item.tahun)))}
            barGap={2}
            barCategoryGap="20%"
            margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
          >
            <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />

            <YAxis width={45} tick={{ fontSize: 11 }} />

            <Tooltip shared={false} labelStyle={{ display: "none" }} />

            <Legend
              payload={jenisLembaga
                .filter((j) => jenis.includes(j))
                .map((j) => ({
                  value: j,
                  type: "square" as const,
                  color: warnaLembaga[j][1],
                }))}
            />

            {jenisLembaga
              .filter((p) => jenis.includes(p))
              .flatMap((p) =>
                statusWarna.map((j, index) => (
                  <Bar
                    key={p + "_" + j.nama}
                    dataKey={p + "_" + j.nama}
                    name={p + " - " + j.label}
                    stackId={p}
                    fill={warnaLembaga[p][index]}
                    maxBarSize={30}
                  />
                )),
              )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
