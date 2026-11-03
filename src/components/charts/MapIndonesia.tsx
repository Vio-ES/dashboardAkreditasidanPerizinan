import { ExtendedFeatureCollection, geoIdentity, geoPath } from "d3-geo";
import data from "../../../asset/indonesia-38-provinces.json";
import { ProvinceCount } from "@/types";

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

export function MapIndonesia({ dataProvinsi }: MapIndonesiaProps) {
  const daftar = new Map();
  dataProvinsi.forEach((d) => daftar.set(d.province, d.count));
  console.log(daftar.get("BALI"));

  return (
    <div>
      <svg viewBox="0 0 800 400" className="w-full">
        {features.map((feature) => {
          const nama = feature.properties?.PROVINSI ?? "";
          const namaKapital = nama.toUpperCase();
          const jumlah = daftar.get(namaKapital) ?? 0;
          return (
            <path
              key={feature.properties?.PROVINSI}
              d={pathGenerator(feature) ?? ""}
              fill={getColor(jumlah)}
              stroke="#000"
              strokeWidth={0.5}
            >
              <title>{namaKapital + ": " + jumlah + " lembaga"}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
