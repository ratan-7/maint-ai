const Issue = require("../models/Issue");
const Equipment = require("../models/Equipment");
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

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete issue",
      error: error.message,
    });
  }
};

const analyzeIssue = async (req, res) => {
  try {
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
      ${equipment.type}
      ${issue.description}
      ${issue.operatingEvents.join(" ")}
    `;

    const knowledgeResults = searchKnowledge(searchQuery);

    const aiResult = await analyzeWithAI({
      equipment,
      issue,
      ruleResults,
      knowledge: knowledgeResults,
    });

    issue.ruleResults = ruleResults;
    issue.priority = priority;
    issue.observations = aiResult.observations || [];
    issue.possibleCauses = aiResult.possibleCauses || [];
    issue.confirmedFindings = aiResult.confirmedFindings || [];
    issue.followUpQuestions = aiResult.followUpQuestions || [];
    issue.inspectionSteps = aiResult.inspectionSteps || [];

    await issue.save();

    res.status(200).json({
      success: true,
      message: "Issue analyzed successfully",

      data: {
        issueId: issue._id,
        equipment,
        priority,
        ruleResults,

        observations: aiResult.observations,
        possibleCauses: aiResult.possibleCauses,
        confirmedFindings: aiResult.confirmedFindings,
        followUpQuestions: aiResult.followUpQuestions,
        inspectionSteps: aiResult.inspectionSteps,
        evidence: aiResult.evidence,

        workOrder: aiResult.workOrder,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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
