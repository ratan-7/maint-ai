const express = require("express");

const router = express.Router();

const {
  getMaintenanceHistory,
  getEquipmentHistory,
} = require("../controllers/maintenanceHistoryController");

router.get("/", getMaintenanceHistory);

router.get("/equipment/:equipmentId", getEquipmentHistory);

module.exports = router;
