const Issue = require("../models/Issue");
const Equipment = require("../models/Equipment");
const WorkOrder = require("../models/WorkOrder");

const {
  checkSensorRules,
  calculatePriority,
} = require("../services/ruleEngine");

const { searchKnowledge } = require("../services/knowledgeService");
const { analyzeWithAI } = require("../services/aiService");

const {
  validateSensorReadings,
  detectConflictingSensors,
} = require("../services/validationService");

const isValidObjectId = require("../utils/validateObjectId");

const createIssue = async (req, res) => {
  try {
    const { equipmentId, description, operatingEvents, sensorReadings } =
      req.body;

    if (!equipmentId || !description) {
      return res.status(400).json({
        success: false,
        message: "Equipment ID and description are required",
      });
    }

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    const validationErrors = validateSensorReadings(sensorReadings);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid sensor data",
        errors: validationErrors,
      });
    }

    const issue = await Issue.create({
      equipmentId,
      description,
      operatingEvents: operatingEvents || [],
      sensorReadings: sensorReadings || [],
    });

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    console.error("Create Issue Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create issue",
      error: error.message,
    });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("equipmentId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    console.error("Get Issues Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
      error: error.message,
    });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("equipmentId");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.error("Get Issue Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch issue",
      error: error.message,
    });
  }
};

const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("equipmentId");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (error) {
    console.error("Update Issue Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update issue",
      error: error.message,
    });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Delete Issue Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete issue",
      error: error.message,
    });
  }
};

const analyzeIssue = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const equipment = await Equipment.findById(issue.equipmentId);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    const validationErrors = validateSensorReadings(issue.sensorReadings);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid sensor data",
        errors: validationErrors,
      });
    }

    const conflicts = detectConflictingSensors(issue.sensorReadings);

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Conflicting sensor readings detected",
        conflicts,
        recommendation:
          "Verify sensor condition and readings before making a maintenance decision.",
      });
    }

    const ruleResults = checkSensorRules(issue.sensorReadings);

    const priority = calculatePriority(ruleResults);

    const searchQuery = `
      ${equipment.type || ""}
      ${issue.description || ""}
      ${(issue.operatingEvents || []).join(" ")}
    `;

    const knowledgeResults = searchKnowledge(searchQuery);

    let aiResult;

    try {
      aiResult = await analyzeWithAI({
        equipment,
        issue,
        ruleResults,
        knowledge: knowledgeResults,
      });
    } catch (aiError) {
      console.error("AI Error:", aiError);

      return res.status(503).json({
        success: false,
        message: "AI service is currently unavailable",

        priority,
        ruleResults,

        fallback: {
          message:
            "Deterministic analysis completed, but AI analysis could not be generated.",

          nextStep:
            "Review the rule results and inspect the equipment manually.",
        },
      });
    }

    issue.ruleResults = ruleResults;
    issue.priority = priority;
    issue.observations = aiResult.observations || [];
    issue.possibleCauses = aiResult.possibleCauses || [];
    issue.confirmedFindings = aiResult.confirmedFindings || [];
    issue.followUpQuestions = aiResult.followUpQuestions || [];
    issue.inspectionSteps = aiResult.inspectionSteps || [];
    await issue.save();

    let workOrder = null;

    const existingWorkOrder = await WorkOrder.findOne({
      issueId: issue._id,
    });

    if (existingWorkOrder) {
      console.log("Existing WorkOrder found:", existingWorkOrder._id);

      workOrder = existingWorkOrder;
    } else {
      const aiWorkOrder = aiResult.workOrder || {};

      const workOrderTitle =
        aiWorkOrder.title ||
        `Maintenance Work Order - ${equipment.name || "Equipment"}`;

      const workOrderDescription =
        aiWorkOrder.description ||
        issue.description ||
        "Maintenance required for reported issue.";

      const inspectionSteps =
        aiWorkOrder.inspectionSteps ||
        aiResult.inspectionSteps ||
        issue.inspectionSteps ||
        [];

      console.log("Creating WorkOrder:", {
        issueId: issue._id,
        equipmentId: issue.equipmentId,
        title: workOrderTitle,
        description: workOrderDescription,
        inspectionSteps,
        priority,
      });

      workOrder = await WorkOrder.create({
        issueId: issue._id,
        equipmentId: issue.equipmentId,
        title: workOrderTitle,
        description: workOrderDescription,
        inspectionSteps,
        priority,

        status: "DRAFT",
      });

      console.log("WORK ORDER CREATED:", workOrder._id);
    }

    const message = existingWorkOrder
      ? "Issue analyzed and existing work order returned"
      : "Issue analyzed and draft work order created successfully";

    return res.status(200).json({
      success: true,

      message,

      data: {
        issueId: issue._id,
        equipment,
        priority,
        ruleResults,
        observations: aiResult.observations || [],
        possibleCauses: aiResult.possibleCauses || [],
        confirmedFindings: aiResult.confirmedFindings || [],
        followUpQuestions: aiResult.followUpQuestions || [],
        inspectionSteps: aiResult.inspectionSteps || [],
        evidence: aiResult.evidence || [],
        workOrder,
      },
    });
  } catch (error) {
    console.error("Analyze Issue Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze issue",
      error: error.message,
    });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  analyzeIssue,
};
