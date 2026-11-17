import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { ModulePage } from "@/pages/ModulePage";
import { DashboardAssesorPage } from "./pages/DashboardAssesorPage";
import { DashboardLPK } from "./pages/DashboardLPK";
import LoginPage from "./pages/LoginPage";
import { Session } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { RequireAuth } from "./components/layout/RequireAuth";
import { LoadingPage } from "./pages/LoadingPage";
import { ModuleDetailPage } from "./pages/ModuleDetailPage";
import { UserContext } from "./lib/AuthContext";
import { useRealtimeLembaga } from "./hooks/useRealtimeLembaga";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "asesor" | null | undefined>(
    undefined,
  );
  const user = useContext(UserContext);

  useEffect(() => {
    // BLOK 1: fungsi pengambil session awal
    const loadData = async () => {
      try {
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
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session === null) {
      setRole(undefined);
      return;
    }
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        console.log(data, error);
        setRole(data?.role ?? null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [session]);

  useRealtimeLembaga();

  if (loading || (session && role === undefined)) return <LoadingPage />;

  return (
    <UserContext.Provider value={role ?? null}>
      <Routes>
        <Route
          path="/login"
          element={
            session ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<RequireAuth session={session} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route
              path="/dashboardassesor"
              element={<DashboardAssesorPage />}
            />
            <Route path="/dashboardLPK" element={<DashboardLPK />} />
            <Route path="/modul/:key" element={<ModulePage />} />
            <Route path="/modul/:key/:id" element={<ModuleDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}
