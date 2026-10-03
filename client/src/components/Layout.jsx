import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
        >
          <span className="text-2xl">☰</span>
        </button>

        <div className="ml-3">
          <h1 className="font-semibold text-slate-900">Maint-AI </h1>

          <p className="text-[10px] text-slate-400">Maintenance System</p>
        </div>
      </header>

      
      <main className="lg:ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
