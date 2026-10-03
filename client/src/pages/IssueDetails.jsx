import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIssueById, analyzeIssue } from "../services/api";

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssue = async () => {
      try {
        const response = await getIssueById(id);
        setIssue(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load issue");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  const handleAnalyze = async () => {
    setError("");
    setAnalyzing(true);

    try {
      const response = await analyzeIssue(id);

      setIssue((prev) => ({
        ...prev,
        ...response.data.data,
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to analyze issue");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-4">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl">
            !
          </div>

          <h2 className="font-semibold text-lg mt-4">Issue not found</h2>

          <p className="text-sm text-slate-500 mt-2">
            The requested issue could not be found.
          </p>

          <button
            onClick={() => navigate("/report-issue")}
            className="mt-5 w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Report New Issue
          </button>
        </div>
      </div>
    );
  }

  const priority = issue.priority || "PENDING";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-blue-600 transition mb-4"
          >
            ← Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-slate-400 mb-1">Issue ID</p>

              <h1 className="text-lg sm:text-xl font-semibold break-all">
                {issue._id}
              </h1>
            </div>

            <div className="self-start sm:self-auto">
              <PriorityBadge priority={priority} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            <div className="flex gap-2">
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="font-semibold text-lg">Issue Details</h2>

                <p className="text-sm text-slate-500 mt-1">
                  Reported equipment problem
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? "Analyzing..." : "Analyze Issue"}
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-500 mb-2">
                Description
              </p>

              <p className="text-sm sm:text-base leading-6 text-slate-700 break-words">
                {issue.description || "No description provided."}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                !
              </div>

              <h2 className="font-semibold">Priority</h2>
            </div>

            <div className="mt-5">
              <PriorityBadge priority={priority} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="font-semibold">Rule Results</h2>

            {issue.ruleResults?.length ? (
              <div className="mt-4 space-y-2">
                {issue.ruleResults.map((rule, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-slate-700 break-words"
                  >
                    {typeof rule === "string" ? rule : JSON.stringify(rule)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 mt-3">
                No rule analysis available yet.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 mt-5">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                AI
              </div>

              <div>
                <h2 className="font-semibold">AI Analysis</h2>

                <p className="text-sm text-slate-500 mt-1">
                  Diagnostic analysis generated from the issue data
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <AnalysisList title="Observations" items={issue.observations} />

            <AnalysisList
              title="Possible Causes"
              items={issue.possibleCauses}
            />

            <AnalysisList
              title="Confirmed Findings"
              items={issue.confirmedFindings}
            />

            <AnalysisList
              title="Inspection Steps"
              items={issue.inspectionSteps}
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 mt-5">
          <h2 className="font-semibold">Follow-up Questions</h2>

          {issue.followUpQuestions?.length ? (
            <ul className="mt-4 space-y-3">
              {issue.followUpQuestions.map((question, index) => (
                <li
                  key={index}
                  className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-slate-700 break-words"
                >
                  <span className="font-medium text-amber-700 mr-2">
                    {index + 1}.
                  </span>

                  {question}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 mt-3">
              No follow-up questions.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

function AnalysisList({ title, items }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/50">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

      {items?.length ? (
        <ul className="mt-3 space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="text-sm text-slate-600 pl-3 border-l-2 border-blue-300 break-words leading-6"
            >
              {typeof item === "string" ? item : JSON.stringify(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 mt-3">Not available yet.</p>
      )}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    CRITICAL: "bg-red-50 text-red-700 border-red-200",

    HIGH: "bg-orange-50 text-orange-700 border-orange-200",

    MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200",

    LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",

    PENDING: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-semibold ${
        styles[priority] || styles.PENDING
      }`}
    >
      {priority}
    </span>
  );
}

export default IssueDetails;
