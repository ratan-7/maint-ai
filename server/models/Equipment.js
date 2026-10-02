const { Schema, model } = require("mongoose");

const equipmentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },

    identifier: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "MAINTENANCE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

const equipmentModel = model("Equipment", equipmentSchema);
module.exports = equipmentModel;
