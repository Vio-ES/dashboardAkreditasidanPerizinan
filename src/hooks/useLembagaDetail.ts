import { useQuery } from "@tanstack/react-query";
import { fetchLembagaDetail } from "@/lib/api/lembaga";

export function useLembagaDetail(id: string) {
  return useQuery({
    queryKey: ["lembaga", id],
    queryFn: () => fetchLembagaDetail(id),
    enabled: Boolean(id),
  });
}