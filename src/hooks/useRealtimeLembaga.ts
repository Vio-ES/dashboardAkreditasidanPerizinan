import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtimeLembaga() {
  const queryClient = useQueryClient();
  const DEBOUNCE_MS = 2000;
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const channel = supabase
      .channel("lpk-bersih-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lpk_bersih",
        },
        () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            // console.log("invalidate jalan");
            queryClient.invalidateQueries({ queryKey: ["module"] });
          }, DEBOUNCE_MS);
          // console.log("realtime lpk:", payload);
        },
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || "TIMED_OUT")
          console.log("realtime status:", status, err);
      });
    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
