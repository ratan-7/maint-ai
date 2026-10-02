const express = require("express");

const {
  createWorkOrder,
  getWorkOrderById,
  updateWorkOrder,
  approveWorkOrder,
  rejectWorkOrder,
} = require("../controllers/workOrderController");

const router = express.Router();

router.post("/", createWorkOrder);

router.get("/:id", getWorkOrderById);

router.put("/:id", updateWorkOrder);

router.patch("/:id/approve", approveWorkOrder);

router.patch("/:id/reject", rejectWorkOrder);

module.exports = router;
