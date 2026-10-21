import { useParams } from "react-router-dom";
import { useLembagaDetail } from "@/hooks/useLembagaDetail";
import { Topbar } from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/Badge";

export function ModuleDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, error } = useLembagaDetail(id);

  if (isLoading) return <div>Memuat data...</div>;
  if (error) return <div>Gagal memuat: {error.message}</div>;

  return (
  <>
    <Topbar title={"Detail Lembaga"} subtitle={"Halaman ini berisi detail lembaga " + data.nama_lembaga} />
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-3 border-b-2 p-6 w-full">
        <img src="https://static.wikia.nocookie.net/reverse1999/images/d/d9/Ramona_Happy_Icon.png/revision/latest?cb=20260530145225" alt="" className="h-12"/>
        <div className="">
          <div>{data.vin}</div>
          <div className="flex items-center gap-3">
            <h2>{data.nama_lembaga}</h2>
            <Badge status={data.status_akreditasi_kelembagaan} />
            <Badge status={data.status_verifikasi_kelembagaan} />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-6">
        <h3>Profil Lembaga</h3>
        <div className="flex-1 space-y-4 gap-2">
          <div>Nama Lembaga</div>
          <div>{data.nama_lembaga}</div>
        </div>
        <div className="flex-1 space-y-4 gap-2">
          <div>Tipe Lembaga</div>
          <div>{data.status}</div>
        </div>
        <h3>Alamat Lembaga</h3>
        <div className="flex-1 space-y-4 gap-2">
          <div>{data.alamat}</div>
        </div>
        <h3>Program yang tersedia</h3>
        {data.list_program.map((c: string) => (
          <div key={c}>
            {c}
          </div>
          ))}
      </div>
    </div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </>
  );
}