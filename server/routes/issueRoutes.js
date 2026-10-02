const express = require("express");
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  analyzeIssue,
} = require("../controllers/issueController");

const { searchKnowledgeBase } = require("../controllers/knowledgeController");

router.post("/", createIssue);

router.get("/", getAllIssues);

router.get("/knowledge/search", searchKnowledgeBase);

router.get("/:id", getIssueById);

router.put("/:id", updateIssue);

router.delete("/:id", deleteIssue);

router.post("/:id/analyze", analyzeIssue);

module.exports = router;
