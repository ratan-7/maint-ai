const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    operatingEvents: [
      {
        type: String,
      },
    ],

    sensorReadings: [
      {
        name: String,
        value: Number,
        unit: String,
      },
    ],

    observations: [String],

    possibleCauses: [String],

    confirmedFindings: [String],

    followUpQuestions: [String],

    inspectionSteps: [String],

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Issue", issueSchema);
