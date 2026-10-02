const express = require("express");

const {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/equipmentController");

const router = express.Router();

router.post("/", createEquipment);

router.get("/", getAllEquipment);

router.get("/:id", getEquipmentById);

router.put("/:id", updateEquipment);

router.delete("/:id", deleteEquipment);

module.exports = router;
