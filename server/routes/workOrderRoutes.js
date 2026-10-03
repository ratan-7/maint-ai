const express = require("express");

const {
  createWorkOrder,
  getWorkOrders,
  getWorkOrderById,
  updateWorkOrder,
  approveWorkOrder,
  rejectWorkOrder,
} = require("../controllers/workOrderController");

const router = express.Router();

router.post("/", createWorkOrder);

router.get("/", getWorkOrders);

router.get("/:id", getWorkOrderById);

router.put("/:id", updateWorkOrder);

router.patch("/:id/approve", approveWorkOrder);

router.patch("/:id/reject", rejectWorkOrder);

module.exports = router;
