import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { useCreateModuleRow, useModuleData } from "@/hooks/useModuleData";
import { Pagination } from "@/components/ui/Pagination";
import { fetchAllModuleRows } from "@/lib/api/modules";
import { toCSV } from "@/lib/utils";
import { LembagaForm } from "@/components/forms/LembagaForm";
import { LembagaFormData, ModuleFilters } from "@/types";
import { UserContext } from "@/lib/AuthContext";

export function ModulePage() {
  const role = useContext(UserContext);

  const { key = "" } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ModuleFilters>({});
  const { data, isLoading } = useModuleData(key, page, pageSize, filters);

  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const createRow = useCreateModuleRow(key);

  useEffect(() => {
    setPage(1);
  }, [key, pageSize, filters]);

  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Memuat modul..." subtitle="" />
        <div className="flex-1 p-6 text-sm text-ink-faint">Memuat data...</div>
      </>
    );
  }

  const handleSubmit = async (lembaga: LembagaFormData) => {
    await createRow.mutateAsync(lembaga);
    setModalOpen(false);
    showToast("Berhasil disimpan");
  };

  const handleDownload = async () => {
    const rows = await fetchAllModuleRows(key);
    const csv = toCSV(rows);
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = key + ".csv"; //mod-lpk.csv
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(page);
  };

  const handleFilterChange = (
    column: string,
    value: string | number | null,
  ) => {
    setFilters({ ...filters, [column]: value });
  };

  return (
    <>
      <Topbar title={data.title} subtitle={data.sub} />
      <div className="flex-1 space-y-4 p-6 bg-[#F4F7FA]">
        <div className="flex items-center justify-end gap-3">
          {data.addLabel && role === "admin" && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-dark"
            >
              <Plus size={16} />
              {data.addLabel}
            </button>
          )}
          <button
            onClick={() => handleDownload()}
            className="flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            <Download size={16} />
            Unduh CSV
          </button>
        </div>

        <DataTable
          cols={data.cols}
          rows={data.rows}
          statusKey={data.statusKey}
          moduleKey={key}
          filterRules={data.filterRules}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <Pagination
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          totalData={data?.count ?? 0}
        />
      </div>

      {data.addLabel && (
        <Modal
          open={modalOpen}
          title={data.addLabel}
          onClose={() => setModalOpen(false)}
        >
          <LembagaForm onSubmit={handleSubmit} />
          {/** <p className="mb-4 text-sm text-ink-soft">
          Formulir ini adalah placeholder — sambungkan ke endpoint{" "}
          <code className="text-xs">POST /api/modules/{key}</code> di{" "}
          <code className="text-xs">src/lib/api/modules.ts</code> saat backend
          siap.
        </p>
        <button
          onClick={handleSubmit}
          disabled={createRow.isPending}
          className="w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {createRow.isPending ? "Menyimpan..." : "Simpan"}
        </button>**/}
        </Modal>
      )}
    </>
  );
}
