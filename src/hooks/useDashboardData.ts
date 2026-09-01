import { useQuery } from "@tanstack/react-query";
import type { PeriodKey } from "@/types";
import { fetchDashboardAsesorData, fetchDashboardData, fetchNotifications } from "@/lib/api/dashboard";

export function useDashboardData(period: PeriodKey) {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: () => fetchDashboardData(period),
  });
}

export function useDashboardAsesorData(period: PeriodKey) {
  return useQuery({
    queryKey: ["dashboardasesor", period],
    queryFn: () => fetchDashboardAsesorData(period),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });
}
