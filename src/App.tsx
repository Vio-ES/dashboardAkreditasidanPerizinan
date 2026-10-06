import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { ModulePage } from "@/pages/ModulePage";
import { DashboardAssesorPage } from "./pages/DashboardAssesorPage";
import { DashboardLPK } from "./pages/DashboardLPK";
import LoginPage from "./pages/LoginPage";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { RequireAuth } from "./components/layout/RequireAuth";
import { LoadingPage } from "./pages/LoadingPage";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // BLOK 1: fungsi pengambil session awal
    const loadData = async () => {
      try {
        await new Promise((r) => setTimeout(r, 2000)); // SEMENTARA: hapus nanti
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    // BLOK 2: jalankan fungsi di atas
    loadData();

    // BLOK 3: pasang bel, lalu cabut di cleanup
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if(loading) return (<LoadingPage />)

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<RequireAuth session={session} />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboardassesor" element={<DashboardAssesorPage/>} />
          <Route path="/dashboardLPK" element={<DashboardLPK/>} />
          <Route path="/modul/:key" element={<ModulePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
