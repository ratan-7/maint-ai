import { useEffect, useState } from "react";
import { getIssues, approveIssue, rejectIssue } from "../services/api";

function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getIssues();
      setIssues(response?.data?.data || []);
    } catch (error) {
      console.error("Issues error:", error);

      setError(error?.response?.data?.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadIssues();
  }, []);

  const handleApprove = async (issueId) => {
    try {
      setProcessingId(issueId);
      setError("");

      await approveIssue(issueId);

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId
            ? {
                ...issue,
                status: "APPROVED",
              }
            : issue,
        ),
      );
    } catch (error) {
      console.error("Approve issue error:", error);

      setError(error?.response?.data?.message || "Failed to approve issue");
    } finally {
      setProcessingId("");
    }
  };

  const handleReject = async (issueId) => {
    try {
      setProcessingId(issueId);
      setError("");

      await rejectIssue(issueId);

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId
            ? {
                ...issue,
                status: "REJECTED",
              }
            : issue,
        ),
      );
    } catch (error) {
      console.error("Reject issue error:", error);

      setError(error?.response?.data?.message || "Failed to reject issue");
    } finally {
      setProcessingId("");
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200";

      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "LOW":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";

      case "PENDING":
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Issue Management
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Review, approve or reject reported maintenance issues
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Issues</p>

            <p className="text-3xl font-bold mt-2">{issues.length}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-yellow-700">Pending</p>

            <p className="text-3xl font-bold text-yellow-700 mt-2">
              {
                issues.filter(
                  (issue) => !issue.status || issue.status === "PENDING",
                ).length
              }
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-emerald-700">Approved</p>

            <p className="text-3xl font-bold text-emerald-700 mt-2">
              {issues.filter((issue) => issue.status === "APPROVED").length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500 mt-4">Loading issues...</p>
          </div>
        )}

        {!loading && issues.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="mx-auto h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
              !
            </div>

            <h2 className="font-semibold text-lg mt-4">No issues reported</h2>

            <p className="text-sm text-slate-500 mt-1">
              Reported maintenance issues will appear here.
            </p>
          </div>
        )}

        {!loading && issues.length > 0 && (
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-lg">Reported Issues</h2>

              <p className="text-xs text-slate-500 mt-1">
                Review issues and take appropriate action.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-500">
                      Issue
                    </th>

                    <th className="text-left px-5 py-3 font-semibold text-slate-500">
                      Equipment
                    </th>

                    <th className="text-left px-5 py-3 font-semibold text-slate-500">
                      Priority
                    </th>

                    <th className="text-left px-5 py-3 font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 font-semibold text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => {
                    const priority = issue.priority || "PENDING";

                    const status = issue.status || "PENDING";

                    const isProcessing = processingId === issue._id;

                    return (
                      <tr
                        key={issue._id}
                        className="hover:bg-blue-50/40 transition"
                      >
                        <td className="px-5 py-5 max-w-sm">
                          <p className="font-semibold text-slate-900">
                            {issue.description || "Maintenance issue"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {issue._id}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-medium">
                            {issue.equipmentId?.name ||
                              issue.equipmentId ||
                              "Unknown"}
                          </p>

                          {issue.equipmentId?.type && (
                            <p className="text-xs text-slate-400 mt-1">
                              {issue.equipmentId.type}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${getPriorityStyle(
                              priority,
                            )}`}
                          >
                            {priority}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                              status,
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          {status === "PENDING" && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleReject(issue._id)}
                                disabled={isProcessing}
                                className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                              >
                                Reject
                              </button>

                              <button
                                onClick={() => handleApprove(issue._id)}
                                disabled={isProcessing}
                                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                              >
                                {isProcessing ? "Processing..." : "Approve"}
                              </button>
                            </div>
                          )}

                          {status === "APPROVED" && (
                            <div className="text-right text-xs font-semibold text-emerald-600">
                              ✓ Approved
                            </div>
                          )}

                          {status === "REJECTED" && (
                            <div className="text-right text-xs font-semibold text-red-600">
                              ✕ Rejected
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && issues.length > 0 && (
          <div className="md:hidden space-y-4">
            {issues.map((issue) => {
              const priority = issue.priority || "PENDING";

              const status = issue.status || "PENDING";

              const isProcessing = processingId === issue._id;

              return (
                <div
                  key={issue._id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 break-words">
                        {issue.description || "Maintenance issue"}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 break-all">
                        ID: {issue._id}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 inline-flex px-2 py-1 rounded-full border text-[10px] font-semibold ${getStatusStyle(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-400">Equipment</p>

                      <p className="text-sm font-medium mt-1 break-words">
                        {issue.equipmentId?.name ||
                          issue.equipmentId ||
                          "Unknown"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-400">Priority</p>

                      <span
                        className={`inline-flex mt-1 px-2 py-1 rounded-full border text-[10px] font-semibold ${getPriorityStyle(
                          priority,
                        )}`}
                      >
                        {priority}
                      </span>
                    </div>
                  </div>
                  {status === "PENDING" && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => handleReject(issue._id)}
                        disabled={isProcessing}
                        className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleApprove(issue._id)}
                        disabled={isProcessing}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {isProcessing ? "Processing..." : "Approve"}
                      </button>
                    </div>
                  )}

                  {status === "APPROVED" && (
                    <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
                      ✓ Issue Approved
                    </div>
                  )}

                  {status === "REJECTED" && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center text-sm font-semibold text-red-700">
                      ✕ Issue Rejected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Issues;
