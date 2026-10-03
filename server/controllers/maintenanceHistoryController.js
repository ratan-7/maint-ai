const MaintenanceHistory = require("../models/MaintenanceHistory");

const getEquipmentHistory = async (req, res) => {
  try {
    const history = await MaintenanceHistory.find({
      equipmentId: req.params.equipmentId,
    })
      .populate("issueId")
      .populate("workOrderId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance history",
      error: error.message,
    });
  }
};

module.exports = {
  getEquipmentHistory,
};
