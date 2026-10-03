const express = require("express");

const {
  getEquipmentHistory,
} = require("../controllers/maintenanceHistoryController");

const router = express.Router();

router.get("/equipment/:equipmentId", getEquipmentHistory);

module.exports = router;
