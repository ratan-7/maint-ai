import { useEffect, useState } from "react";
import { getEquipment, createIssue } from "../services/api";
import { useNavigate } from "react-router-dom";

function ReportIssue() {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    equipmentId: "",
    description: "",
    sensorReadings: [],
    operatingEvents: [],
  });

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await getEquipment();
        setEquipment(response.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load equipment");
      } finally {
        setLoadingEquipment(false);
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
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await createIssue(formData);

      const issueId = response.data.data?._id;

      setSuccess("Issue reported successfully.");

      setTimeout(() => {
        if (issueId) {
          navigate(`/issues/${issueId}`);
        }
      }, 700);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to report issue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              ⚠
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                Report Issue
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Report an equipment issue for maintenance analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
          <section className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold">
                01
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Equipment Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select the equipment where the issue was detected.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Equipment
              </label>

              <select
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleChange}
                required
                disabled={loadingEquipment}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingEquipment
                    ? "Loading equipment..."
                    : "Select equipment"}
                </option>

                {equipment.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} — {item.type}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-semibold">
                02
              </div>

              <div>
                <h2 className="font-semibold">Issue Details</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Describe the problem clearly.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Example: Pump is producing abnormal vibration and unusual noise..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg resize-none outline-none text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="text-xs text-gray-400 mt-1.5">
                Provide as much detail as possible.
              </p>
            </div>
          </section>

          <section className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-semibold">
                03
              </div>

              <div>
                <h2 className="font-semibold">Sensor Readings</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Sensor data can be added for rule-based and AI analysis.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-purple-100 bg-purple-50/50 p-4">
              <p className="text-sm text-purple-800">
                Sensor input UI will be connected to your exact backend sensor
                schema in the next step.
              </p>
            </div>
          </section>

          <section className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm font-semibold">
                04
              </div>

              <div>
                <h2 className="font-semibold">Operating Events</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Record any recent operating conditions or events.
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="Example: Pump restarted twice after a power interruption..."
              className="w-full mt-5 px-3 py-2.5 border border-gray-300 rounded-lg resize-none outline-none text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  operatingEvents: e.target.value ? [e.target.value] : [],
                })
              }
            />
          </section>

          <div className="px-4 sm:px-6 pt-5">
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200">
                <span className="text-red-600">!</span>

                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-green-50 border border-green-200">
                <span className="text-green-600">✓</span>

                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Reporting..." : "Report Issue"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ReportIssue;
