import { NavLink } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: "⌂",
    },
    {
      name: "Equipment",
      path: "/equipment",
      icon: "▣",
    },
    {
      name: "Report Issue",
      path: "/report-issue",
      icon: "＋",
    },
    {
      name: "Work Orders",
      path: "/work-orders",
      icon: "☷",
    },
    {
      name: "Maintenance History",
      path: "/maintenance-history",
      icon: "◷",
    },
  ];

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-64
          bg-white
          border-r
          border-slate-200
          transition-transform
          duration-300
          ease-in-out

          ${open ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Maint-AI</h1>

            <p className="text-xs text-slate-400">Maintenance System</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-xl text-slate-500"
          >
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span className="w-5 text-center">{link.icon}</span>

              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
