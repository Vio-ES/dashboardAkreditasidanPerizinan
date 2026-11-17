import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtimeLembaga() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("lpk-bersih-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lpk_bersih",
        },
        (payload) => {
          console.log("realtime lpk:", payload);
        },
      )
      .subscribe((status, err) => console.log("realtime status:", status, err));
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
