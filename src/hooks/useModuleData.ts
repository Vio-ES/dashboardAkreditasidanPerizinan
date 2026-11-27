import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createModuleRow,
  fetchFilterOptions,
  fetchModuleData,
  fetchModuleDefinitions,
} from "@/lib/api/modules";
import { ModuleFilters } from "@/types";

export function useModuleDefinitions() {
  return useQuery({
    queryKey: ["module-definitions"],
    queryFn: fetchModuleDefinitions,
  });
}

export function useModuleData(
  key: string,
  page: number,
  pageSize: number,
  filters: ModuleFilters,
) {
  return useQuery({
    queryKey: ["module", key, page, pageSize, filters],
    queryFn: () => fetchModuleData(key, page, pageSize, filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(key),
  });
}

export function useFilterOptions(key: string, column: string) {
  return useQuery({
    // module digunakan di query agar ikut terbaharui saat ada data baru
    // berkaitan dengan invalidateQueries di useCreateModuleRow
    queryKey: ["module", key, column],
    queryFn: () => fetchFilterOptions(key, column),
    enabled: Boolean(key) && Boolean(column),
  });
}

export function useCreateModuleRow(key: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      createModuleRow(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module", key] });
    },
  });
}
