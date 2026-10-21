import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { useCreateModuleRow, useModuleData } from "@/hooks/useModuleData";
import { Pagination } from "@/components/ui/Pagination";

export function ModulePage() {
  const { key = "" } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useModuleData(key, page, pageSize);
  
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();
  const createRow = useCreateModuleRow(key);

  useEffect(() => {
    setPage(1);
  }, [key, pageSize]);


  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Memuat modul..." subtitle="" />
        <div className="flex-1 p-6 text-sm text-ink-faint">Memuat data...</div>
      </>
    );
  }

  const handleSubmit = async () => {
    await createRow.mutateAsync({});
    setModalOpen(false);
    showToast("Berhasil disimpan");
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(page);
  };

  console.log(data.rows[0]);

  return (
    <>
      <Topbar title={data.title} subtitle={data.sub} />
      <div className="flex-1 space-y-4 p-6">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            <Plus size={16} />
            {data.addLabel}
          </button>
        </div>

        <DataTable cols={data.cols} rows={data.rows} statusKey={data.statusKey} moduleKey={key}/>
        <Pagination 
          page={page} 
          pageSize={pageSize} 
          setPage={setPage} 
          totalData={data?.count ?? 0}        
        />
      </div>

      <Modal open={modalOpen} title={data.addLabel} onClose={() => setModalOpen(false)}>
        <p className="mb-4 text-sm text-ink-soft">
          Formulir ini adalah placeholder — sambungkan ke endpoint <code className="text-xs">POST /api/modules/{key}</code>{" "}
          di <code className="text-xs">src/lib/api/modules.ts</code> saat backend siap.
        </p>
        <button
          onClick={handleSubmit}
          disabled={createRow.isPending}
          className="w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {createRow.isPending ? "Menyimpan..." : "Simpan"}
        </button>
      </Modal>
    </>
  );
}
