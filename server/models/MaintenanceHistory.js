const mongoose = require("mongoose");

const maintenanceHistorySchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkOrder",
      required: true,
    },

    action: {
      type: String,
      enum: ["APPROVED", "REJECTED", "COMPLETED"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    technicianNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MaintenanceHistory", maintenanceHistorySchema);
