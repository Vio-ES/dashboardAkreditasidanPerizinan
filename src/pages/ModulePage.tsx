import { useState } from "react";
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
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useModuleData(key, page, pageSize);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();
  const createRow = useCreateModuleRow(key);


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
        <div className="flex items-center justify-end px-4 py-3 text-sm">
          <div className="join">
              {data.count / pageSize < 3 && 
                Array.from({ length: data.count / pageSize }, (_, index) => index + 1)
                  .map((pageNum) => (
                    <button key={pageNum} className="join-item">
                      {pageNum}
                    </button>
                  ))
              }
              {data.count / pageSize > 3 && 
                <div className="flex items-center justify-between px-4 py-2 gap-4 text-sm">
                  <button><ChevronLeft/></button>
                  <button>1</button>
                  <button>2</button>
                  <button>3</button>
                  <button className="join-item btn btn-disabled">...</button>
                  <button>99</button>
                  <button><ChevronRight/></button>
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
