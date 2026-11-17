import { ExtendedFeatureCollection, geoIdentity, geoPath } from "d3-geo";
import data from "../../asset/indonesia-38-provinces.json";
import { ProvinceCount } from "@/types";
import { useState } from "react";

interface MapIndonesiaProps {
  dataProvinsi: ProvinceCount[];
}

const geoData = data as unknown as ExtendedFeatureCollection;
const features = geoData.features;
const height = 400;
const width = 800;

const projection = geoIdentity()
  .reflectY(true)
  .fitSize([width, height], geoData);

const pathGenerator = geoPath().projection(projection);

function getColor(jumlah: number) {
  if (jumlah >= 60) return "#1e40af";
  if (jumlah >= 30) return "#3b82f6";
  if (jumlah >= 10) return "#93c5fd";
  if (jumlah >= 1) return "#dbeafe";
  return "#f0f2f5";
}

interface Choice {
  name: string;
  count: number;
  x: number;
  y: number;
}

export function MapIndonesia({ dataProvinsi }: MapIndonesiaProps) {
  const [chosen, setChosen] = useState<Choice | null>(null);

  const daftar = new Map();
  dataProvinsi.forEach((d) => daftar.set(d.province, d.count));

  return (
    <div onClick={() => setChosen(null)}>
      <svg viewBox="0 0 800 400" className="w-full">
        {features.map((feature) => {
          const nama = feature.properties?.PROVINSI ?? "";
          const namaKapital = nama.toUpperCase();
          const jumlah = daftar.get(namaKapital) ?? 0;
          return (
            <path
              key={feature.properties?.PROVINSI}
              d={pathGenerator(feature) ?? ""}
              onMouseMove={(e) =>
                setChosen({
                  name: namaKapital,
                  count: jumlah,
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseLeave={() => setChosen(null)}
              fill={getColor(jumlah)}
              stroke="#000"
              strokeWidth={0.5}
              onClick={(e) => {
                e.stopPropagation();
                setChosen({
                  name: namaKapital,
                  count: jumlah,
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
            ></path>
          );
        })}
      </svg>
      {chosen && (
        <div
          className="hidden md:block fixed bg-slate-200 px-2 py-1 text-black rounded-lg pointer-events-none"
          style={{ left: chosen.x + 12, top: chosen.y + 12 }}
        >
          <div className="font-semibold">{chosen.name}</div>
          <div> {chosen.count} lembaga</div>
        </div>
      )}
      {chosen ? (
        <div className="block md:hidden bg-slate-200 px-2 py-1 text-black rounded-lg pointer-events-none">
          <div className="font-semibold">{chosen.name}</div>
          <div> {chosen.count} lembaga</div>
        </div>
      ) : (
        <div className="block md:hidden bg-slate-200 px-2 py-1 text-black text-center rounded-lg pointer-events-none">
          Tap provinsi untuk melihat jumlah
        </div>
      )}
    </div>
  );
}
