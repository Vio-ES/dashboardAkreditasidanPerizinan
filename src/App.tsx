import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { ModulePage } from "@/pages/ModulePage";
import { DashboardAssesorPage } from "./pages/DashboardAssesorPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboardassesor" element={<DashboardAssesorPage/>} />
        <Route path="/modul/:key" element={<ModulePage />} />
      </Route>
    </Routes>
  );
}
