import { ModuleRow } from "@/types";

export function fmt(n: number): string {
  return n.toLocaleString("id-ID");
}

export function escapeCsv(n: unknown) {
  if (n === null || n === undefined) {
    return "";
  }
  let text = String(n);
  text = text.replace(/"/g, '""');
  if(text.includes(",") || text.includes('"') || text.includes("\n")){
    return `"${text}"`;
  }
  return text;
}

export function toCSV(rows: ModuleRow[]) {
  if(rows.length === 0){
    return "";
  }
  const headers = (Object.keys(rows[0]));
  const header = headers.map(h => escapeCsv(h) ).join(",");
  const data = rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(","));
  return ([header, ...data]).join("\n");
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function statusTone(status: string): "green" | "orange" | "red" | "blue" | "purple" {
  const s = status.toLowerCase();
  if (["terverifikasi", "disetujui", "selesai", "terbit", "cair", "normal"].some((k) => s.includes(k))) return "green";
  if (["ditolak", "kritis", "terlampaui"].some((k) => s.includes(k))) return "red";
  if (["menunggu", "pending", "perhatian", "diproses", "dalam proses", "ditinjau"].some((k) => s.includes(k))) return "orange";
  if (["terjadwal"].some((k) => s.includes(k))) return "blue";
  return "purple";
}
