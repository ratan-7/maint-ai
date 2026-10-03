import axios from "axios";

const API = axios.create({
  baseURL: "https://maint-ai-xquy.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createEquipment = (data) => API.post("/equipment", data);

export const getEquipment = () => API.get("/equipment");

export const getEquipmentById = (id) => API.get(`/equipment/${id}`);

export const getIssues = () => API.get("/issues");

export const getIssueById = (id) => API.get(`/issues/${id}`);

export const createIssue = (data) => API.post("/issues", data);

export const analyzeIssue = (id) => API.post(`/issues/${id}/analyze`);

export const createWorkOrder = (data) => API.post("/work-orders", data);

export const getWorkOrderById = (id) => API.get(`/work-orders/${id}`);

export const getWorkOrders = () => API.get("/work-orders");

export const approveWorkOrder = (id) => API.patch(`/work-orders/${id}/approve`);

export const rejectWorkOrder = (id, technicianNote) =>
  API.patch(`/work-orders/${id}/reject`, {
    technicianNote,
  });

export const getMaintenanceHistory = () => API.get("/maintenance-history");

export const getMaintenanceHistoryByEquipment = (equipmentId) =>
  API.get(`/maintenance-history/equipment/${equipmentId}`);

export default API;
