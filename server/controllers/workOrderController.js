const WorkOrder = require("../models/WorkOrder");
const Issue = require("../models/Issue");
const Equipment = require("../models/Equipment");
const MaintenanceHistory = require("../models/MaintenanceHistory");

const createWorkOrder = async (req, res) => {
  try {
    const { issueId, title, description, inspectionSteps, priority } = req.body;

    if (!issueId || !title || !description || !priority) {
      return res.status(400).json({
        success: false,
        message: "Issue ID, title, description and priority are required",
      });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const workOrder = await WorkOrder.create({
      issueId,
      equipmentId: issue.equipmentId,
      title,
      description,
      inspectionSteps: inspectionSteps || [],
      priority,
      status: "DRAFT",
    });

    res.status(201).json({
      success: true,
      message: "Draft work order created",
      data: workOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create work order",
      error: error.message,
    });
  }
};

const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("issueId")
      .populate("equipmentId");

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: workOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch work order",
      error: error.message,
    });
  }
};

const updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found",
      });
    }

    if (workOrder.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft work orders can be edited",
      });
    }

    Object.assign(workOrder, req.body);

    await workOrder.save();

    res.status(200).json({
      success: true,
      message: "Work order updated",
      data: workOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update work order",
      error: error.message,
    });
  }
};

const approveWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found",
      });
    }

    if (workOrder.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft work orders can be approved",
      });
    }

    workOrder.status = "APPROVED";

    await workOrder.save();

    await MaintenanceHistory.create({
      equipmentId: workOrder.equipmentId,
      issueId: workOrder.issueId,
      workOrderId: workOrder._id,
      action: "APPROVED",
      description: workOrder.description,
    });

    res.status(200).json({
      success: true,
      message: "Work order approved by technician",
      data: workOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve work order",
      error: error.message,
    });
  }
};

const rejectWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found",
      });
    }

    if (workOrder.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft work orders can be rejected",
      });
    }

    workOrder.status = "REJECTED";
    workOrder.technicianNote = req.body.technicianNote || "";

    await workOrder.save();

    res.status(200).json({
      success: true,
      message: "Work order rejected by technician",
      data: workOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject work order",
      error: error.message,
    });
  }
};

module.exports = {
  createWorkOrder,
  getWorkOrderById,
  updateWorkOrder,
  approveWorkOrder,
  rejectWorkOrder,
};
