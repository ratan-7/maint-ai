import { useEffect, useState } from "react";
import {
  getWorkOrders,
  approveWorkOrder,
  rejectWorkOrder,
} from "../services/api";

function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState("");

  const loadWorkOrders = async () => {
    try {
      setError("");

      const response = await getWorkOrders();

      setWorkOrders(response.data.data || []);
    } catch (error) {
      console.error(
        "Work orders error:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Failed to load work orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWorkOrders();
  }, []);

  const handleApprove = async (id) => {
    try {
      setError("");
      setApprovingId(id);

      const response = await approveWorkOrder(id);

      const updatedOrder = response.data.data;

      setWorkOrders((prev) =>
        prev.map((order) => (order._id === id ? updatedOrder : order)),
      );
    } catch (error) {
      console.error(
        "Approve work order error:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Failed to approve work order");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setError("");
      setApprovingId(id);

      const response = await rejectWorkOrder(id);

      const updatedOrder = response.data.data;

      setWorkOrders((prev) =>
        prev.map((order) => (order._id === id ? updatedOrder : order)),
      );
    } catch (error) {
      console.error(
        "Reject work order error:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Failed to reject work order");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-xl sm:text-2xl font-semibold">Work Orders</h1>

          <p className="text-sm text-gray-500 mt-1">
            Review and manage maintenance work orders
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Total Work Orders" value={workOrders.length} />

          <SummaryCard
            title="Draft"
            value={
              workOrders.filter((order) => order.status === "DRAFT").length
            }
          />

          <SummaryCard
            title="Approved"
            value={
              workOrders.filter((order) => order.status === "APPROVED").length
            }
          />
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            <div className="flex justify-center">
              <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>

            <p className="text-sm text-gray-500 mt-3">Loading work orders...</p>
          </div>
        )}

        {!loading && workOrders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-xl">—</span>
            </div>

            <h2 className="font-medium mt-4">No work orders found</h2>

            <p className="text-sm text-gray-500 mt-1">
              Work orders created from issue analysis will appear here.
            </p>
          </div>
        )}

        {!loading && workOrders.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-medium">Work Order List</h2>

              <p className="text-xs text-gray-500 mt-1">
                {workOrders.length} record
                {workOrders.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                      Work Order
                    </th>

                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                      Description
                    </th>

                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                      Priority
                    </th>

                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {workOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          WO-{order._id.slice(-6)}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {order._id}
                        </p>
                      </td>
                      <td className="px-5 py-4 max-w-sm">
                        <p className="text-gray-700 truncate">
                          {order.description || "No description"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {order.priority ? (
                          <PriorityBadge priority={order.priority} />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        {order.status === "DRAFT" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(order._id)}
                              disabled={approvingId === order._id}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                              {approvingId === order._id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              onClick={() => handleReject(order._id)}
                              disabled={approvingId === order._id}
                              className="px-3 py-2 bg-white text-red-600 border border-red-200 rounded-md text-xs font-medium hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",

    APPROVED: "bg-blue-50 text-blue-700 border-blue-200",

    REJECTED: "bg-red-50 text-red-700 border-red-200",

    COMPLETED: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md border text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    LOW: "bg-gray-100 text-gray-700 border-gray-200",

    MEDIUM: "bg-blue-50 text-blue-700 border-blue-200",

    HIGH: "bg-orange-50 text-orange-700 border-orange-200",

    CRITICAL: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md border text-xs font-medium ${
        styles[priority] || "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {priority}
    </span>
  );
}

export default WorkOrders;
