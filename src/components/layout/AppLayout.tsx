import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Landmark, Menu } from "lucide-react";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar with toggle button */}
        <header className="sticky top-0  z-10 flex md:hidden items-center justify-between p-4 border-b bg-navy">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} color="grey" />
          </button>
          <div className="flex lg:hidden items-center gap-2 pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-400 text-navy">
              <Landmark size={16} />
            </div>
            <div className="text-[10px] font-bold leading-tight text-ink-faint">
              KEMENTERIAN
              <br />
              KETENAGAKERJAAN
              <br />
              REPUBLIK INDONESIA
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
