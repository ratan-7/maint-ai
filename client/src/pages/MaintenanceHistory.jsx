import { useEffect, useState } from "react";
import {
  getMaintenanceHistory,
  getMaintenanceHistoryByEquipment,
  getEquipment,
} from "../services/api";

function MaintenanceHistory() {
  const [history, setHistory] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await getEquipment();

        setEquipment(response.data?.data || []);
      } catch (error) {
        console.error("Equipment error:", error);
      }
    };

    loadEquipment();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (selectedEquipment) {
        response = await getMaintenanceHistoryByEquipment(selectedEquipment);
      } else {
        response = await getMaintenanceHistory();
      }

      setHistory(response.data?.data || []);
    } catch (error) {
      console.error(
        "Maintenance history error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to load maintenance history",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();
  }, [selectedEquipment]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              🔧
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Maintenance History
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                View previous maintenance activities and records
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-sm">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Filter by Equipment
              </label>

              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Equipment</option>

                {equipment.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} — {item.type}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSelectedEquipment("")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              Clear Filter
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                !
              </div>

              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Maintenance Records
              </p>

              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {history.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              📋
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">
              Loading maintenance history...
            </p>
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
              📋
            </div>

            <h2 className="font-medium text-gray-900">
              No maintenance records found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Maintenance history will appear here after work is completed.
            </p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:px-5">
                      Equipment
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:px-5">
                      Action
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:px-5">
                      Description
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:px-5">
                      Issue
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:px-5">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {history.map((record) => (
                    <tr
                      key={record._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 sm:px-5">
                        <p className="font-medium text-gray-900">
                          {record.equipmentId?.name ||
                            record.equipmentId ||
                            "—"}
                        </p>

                        {record.equipmentId?.type && (
                          <p className="mt-1 text-xs text-gray-400">
                            {record.equipmentId.type}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 sm:px-5">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                            record.action === "APPROVED"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : record.action === "COMPLETED"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : record.action === "REJECTED"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-gray-200 bg-gray-100 text-gray-700"
                          }`}
                        >
                          {record.action || "—"}
                        </span>
                      </td>

                      <td className="max-w-sm px-4 py-4 sm:px-5">
                        <p className="line-clamp-2 text-gray-600">
                          {record.description || "—"}
                        </p>
                      </td>

                      <td className="max-w-xs px-4 py-4 sm:px-5">
                        {record.issueId ? (
                          <p className="line-clamp-2 text-gray-600">
                            {record.issueId.description ||
                              record.issueId._id ||
                              "—"}
                          </p>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-gray-500 sm:px-5">
                        {record.createdAt
                          ? new Date(record.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center sm:hidden">
              <p className="text-xs text-gray-400">
                ← Swipe horizontally to view all columns →
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MaintenanceHistory;
