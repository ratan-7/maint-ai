import { useEffect, useState } from "react";
import { getEquipment, createEquipment } from "../services/api";

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await getEquipment();
        setEquipment(response?.data?.data || []);
      } catch (error) {
        console.error(
          "Equipment error:",
          error?.response?.data || error?.message,
        );

        setError(error?.response?.data?.message || "Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await createEquipment(formData);

      setEquipment((prev) => [...prev, response?.data?.data]);

      setFormData({
        name: "",
        type: "",
        location: "",
      });

      setShowForm(false);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to create equipment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-xl sm:text-2xl font-semibold">Equipment</h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor registered equipment
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 w-full sm:w-auto">
            <p className="text-sm text-slate-500">Total equipment</p>

            <p className="text-2xl font-semibold mt-1">{equipment.length}</p>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
            className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
          >
            + Add Equipment
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {showForm && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            onClick={() => setShowForm(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Add Equipment</h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Register new equipment
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Equipment Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Pump-01"
                    required
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Type
                  </label>

                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="e.g. Pump"
                    required
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Plant A"
                    required
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Creating..." : "Create Equipment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <div className="inline-block h-6 w-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />

            <p className="text-sm text-slate-500 mt-3">Loading equipment...</p>
          </div>
        )}

        {!loading && equipment.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              EQ
            </div>

            <p className="font-medium mt-4">No equipment found</p>

            <p className="text-sm text-slate-500 mt-1">
              Add your first equipment to get started.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              + Add Equipment
            </button>
          </div>
        )}

        {!loading && equipment.length > 0 && (
          <>
            <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium text-slate-500">
                        Equipment
                      </th>

                      <th className="text-left px-5 py-3 font-medium text-slate-500">
                        Type
                      </th>

                      <th className="text-left px-5 py-3 font-medium text-slate-500">
                        Location
                      </th>

                      <th className="text-left px-5 py-3 font-medium text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {equipment.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600">
                              EQ
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {item.name || "Unnamed"}
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">
                                {item._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {item.type || "—"}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {item.location || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:hidden space-y-3">
              {equipment.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600">
                        EQ
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {item.name || "Unnamed"}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {item._id}
                        </p>
                      </div>
                    </div>

                    <StatusBadge />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">Type</p>

                      <p className="text-sm font-medium text-slate-700 mt-1">
                        {item.type || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Location</p>

                      <p className="text-sm font-medium text-slate-700 mt-1">
                        {item.location || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium whitespace-nowrap">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

export default Equipment;
