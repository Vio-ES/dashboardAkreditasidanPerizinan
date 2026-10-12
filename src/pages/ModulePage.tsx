import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { useCreateModuleRow, useModuleData } from "@/hooks/useModuleData";

export function ModulePage() {
  const { key = "" } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(60);
  const { data, isLoading } = useModuleData(key, page, pageSize);
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize);
  const start = Math.max(2, page-1);
  const end = Math.min(page+1, totalPages - 1);
  const middlePages = Array.from({ length: end - start + 1}, (_, index) => index + start);
  const from = pageSize * page - pageSize + 1; 
  const to = from + pageSize;
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

        <DataTable cols={data.cols} rows={data.rows} statusKey={data.statusKey} />
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <div>Menampilkan {from} - {to} dari {data?.count ?? 0}</div>
          <div className="join">
              {totalPages <= 3 && 
                Array.from({ length: totalPages}, (_, index) => index + 1)
                  .map((pageNum) => (
                    <button key={pageNum} onClick={() => setPage(pageNum)} className={`join-item btn btn-xs ${pageNum === page ? "btn-active" : ""}`}>
                      {pageNum}
                    </button>
                  ))
              }
              {totalPages > 3 && 
                <div className="flex items-center justify-between px-4 py-2 gap-4 text-sm">
                  <button onClick={() => setPage(page -  1)} disabled={page <= 1} className={`join-item btn btn-xs ${page <= 1 ? "hidden" : ""}`}><ChevronLeft/></button>
                  <button onClick={() => setPage(1)} className={`join-item btn btn-xs ${page === 1 ? "btn-active" : ""}`}>1</button>
                  <button className={`join-item btn btn-xs ${start === 2 ? "hidden" : "btn-disabled"}`}>...</button>
                  {middlePages.map((pageNum) => (
                    <button key={pageNum} onClick={() => setPage(pageNum)} className={`join-item btn btn-xs ${pageNum === page ? "btn-active" : ""}`}>
                      {pageNum}
                    </button>
                  ))}
                  <button className={`join-item btn btn-xs ${end === totalPages-1 ? "hidden" : "btn-disabled"}`}>...</button>
                  <button onClick={() => setPage(totalPages)} className={`join-item btn btn-xs ${page === totalPages ? "btn-active" : ""}`}>{totalPages}</button>
                  <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className={`join-item btn btn-xs ${page >= totalPages ? "hidden" : ""}`}><ChevronRight/></button>
                </div>
              }
          </div>
        </div>
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
