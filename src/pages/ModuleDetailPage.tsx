import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { useLembagaDetail } from "@/hooks/useLembagaDetail";
import { Topbar } from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/Badge";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card bg-card p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string | number | null;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 text-sm text-ink">{value || "-"}</div>
    </div>
  );
}

export function ModuleDetailPage() {
  const { key = "", id = "" } = useParams();
  const { data, isLoading, error } = useLembagaDetail(id);

  if (isLoading) return <div className="p-6 text-sm text-ink-faint">Memuat data...</div>;
  if (error || !data) {
    return (
      <div className="p-6 text-sm text-ink-faint">
        Gagal memuat: {error?.message ?? "Data tidak ditemukan"}
      </div>
    );
  }

  const programs: string[] = data.list_program ?? [];

  return (
    <>
      <Topbar
        title="Detail Lembaga"
        subtitle={`Halaman ini berisi detail lembaga ${data.nama_lembaga}`}
      />
      <div className="flex-1">
        <Link
            to={`/modul/${key}`}
            className="inline-flex items-center gap-2 p-4 text-sm font-medium text-accent hover:underline"
        >
            <ArrowLeft size={16} />
            Kembali ke daftar
        </Link>
        <div className="flex items-center gap-4 border-b border-line bg-card px-6 py-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface text-ink-faint">
            <Building2 size={28} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-ink-faint">VIN {data.vin}</div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-ink">{data.nama_lembaga}</h2>
              <Badge status={String(data.status_akreditasi_kelembagaan)} />
              <Badge status={String(data.status_verifikasi_kelembagaan)} />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Profil Lembaga">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Lembaga" value={data.nama_lembaga} wide />
                <Field label="Tipe Lembaga" value={data.status} />
                <Field label="VIN" value={data.vin} />
              </div>
            </Card>

            <Card title="Akreditasi & Verifikasi">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status Akreditasi" value={data.status_akreditasi_kelembagaan} />
                <Field label="Status Verifikasi" value={data.status_verifikasi_kelembagaan} />
                <Field label="Tahun Akreditasi" value={data.tahun_akreditasi} />
              </div>
            </Card>
          </div>

          <Card title="Alamat Lembaga">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Alamat" value={data.alamat} wide />
              <Field label="Kabupaten / Kota" value={data.kabupaten_kota} />
              <Field label="Provinsi" value={data.provinsi} />
            </div>
          </Card>

          <Card title={`Program yang Tersedia (${programs.length})`}>
            {programs.length === 0 ? (
              <p className="text-sm text-ink-faint">Belum ada program.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {programs.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink"
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}