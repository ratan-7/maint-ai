import { useEffect, useState } from "react";
import { getEquipment, getIssues } from "../services/api";

function Dashboard() {
  const [equipment, setEquipment] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [equipmentRes, issuesRes] = await Promise.all([
          getEquipment(),
          getIssues(),
        ]);

        setEquipment(equipmentRes?.data?.data || []);
        setIssues(issuesRes?.data?.data || []);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error?.response?.data || error?.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const highPriorityIssues = issues.filter(
    (issue) => issue?.priority === "HIGH" || issue?.priority === "CRITICAL",
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="h-7 w-7 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Maintenance Dashboard
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Overview of equipment health and maintenance activities
              </p>
            </div>

            {/* Profile */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                M
              </div>

              <div>
                <p className="text-sm font-medium">Maintenance</p>

                <p className="text-xs text-slate-500">Operations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {/* Stats */}
        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Equipment"
            value={equipment.length}
            subtitle="Registered equipment"
            icon="▣"
            iconStyle="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Open Issues"
            value={issues.length}
            subtitle="Reported issues"
            icon="!"
            iconStyle="bg-orange-50 text-orange-600"
          />

          <StatCard
            title="High Priority"
            value={highPriorityIssues.length}
            subtitle="Needs attention"
            icon="▲"
            iconStyle="bg-red-50 text-red-600"
          />

          <StatCard
            title="Work Orders"
            value="—"
            subtitle="Pending integration"
            icon="✓"
            iconStyle="bg-emerald-50 text-emerald-600"
          />
        </section>

      
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 sm:mt-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold">Recent Issues</h2>

                <p className="text-xs text-slate-500 mt-1">
                  Latest reported maintenance issues
                </p>
              </div>

              <button className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700">
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {issues.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="mx-auto h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">
                    ✓
                  </div>

                  <p className="text-sm font-medium mt-3">
                    No issues reported yet
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Reported issues will appear here.
                  </p>
                </div>
              ) : (
                issues
                  .slice(0, 6)
                  .map((issue) => <IssueRow key={issue._id} issue={issue} />)
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-slate-200">
              <h2 className="font-semibold">Equipment</h2>

              <p className="text-xs text-slate-500 mt-1">
                Recently registered equipment
              </p>
            </div>

            <div className="p-3 sm:p-4 space-y-1">
              {equipment.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-11 w-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold">
                    EQ
                  </div>

                  <p className="text-sm font-medium mt-3">No equipment found</p>

                  <p className="text-xs text-slate-500 mt-1">
                    Add equipment to see it here.
                  </p>
                </div>
              ) : (
                equipment
                  .slice(0, 5)
                  .map((item) => <EquipmentRow key={item._id} item={item} />)
              )}
            </div>
          </div>
        </section>

        {/* System Status */}
        <section className="mt-5 bg-white border border-slate-200 rounded-xl px-4 sm:px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-sm">System Status</h2>

              <p className="text-xs text-slate-500 mt-1">
                Current backend service status
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-700">
                Backend Connected
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, iconStyle }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>

          <p className="text-2xl sm:text-3xl font-semibold tracking-tight mt-2">
            {value}
          </p>
        </div>

        <div
          className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center text-sm font-semibold ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3">{subtitle}</p>
    </div>
  );
}

function IssueRow({ issue }) {
  const priority = issue?.priority || "PENDING";

  const priorityStyle = {
    CRITICAL: "bg-red-50 text-red-700 border-red-200",

    HIGH: "bg-orange-50 text-orange-700 border-orange-200",

    MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200",

    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",

    PENDING: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <div className="px-4 sm:px-5 py-4 hover:bg-slate-50 transition">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-5 line-clamp-2">
            {issue?.description || "Maintenance issue"}
          </p>

          <p className="text-xs text-slate-400 mt-1 truncate">
            Issue ID: {issue?._id || "—"}
          </p>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-md border text-[11px] font-medium ${
            priorityStyle[priority] || priorityStyle.PENDING
          }`}
        >
          {priority}
        </span>
      </div>
    </div>
  );
}

function EquipmentRow({ item }) {
  return (
    <div className="p-3 rounded-lg hover:bg-slate-50 transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600">
          EQ
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">
            {item?.name || "Unnamed Equipment"}
          </p>

          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {item?.type || "Unknown type"}

            {item?.location ? ` • ${item.location}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
