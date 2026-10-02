const express = require("express");
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueController");

router.post("/", createIssue);

router.get("/", getAllIssues);

router.get("/:id", getIssueById);

router.put("/:id", updateIssue);

router.delete("/:id", deleteIssue);

module.exports = router;
