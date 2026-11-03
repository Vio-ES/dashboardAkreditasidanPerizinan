import { fetchKabupatenKota, fetchProvinces } from "@/lib/api/wilayah";
import { useQuery } from "@tanstack/react-query";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: Infinity,
  });
}

export function useKabupatenKota(provinsiId: number | undefined) {
  return useQuery({
    queryKey: ["kabupaten_kota", provinsiId],
    queryFn: () => fetchKabupatenKota(provinsiId!),
    staleTime: Infinity,
    enabled: provinsiId !== undefined,
  });
}
