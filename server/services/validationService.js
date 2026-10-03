const validateSensorReadings = (sensorReadings = []) => {
  const errors = [];

  if (!Array.isArray(sensorReadings)) {
    return ["sensorReadings must be an array"];
  }

  for (const sensor of sensorReadings) {
    if (!sensor.name) {
      errors.push("Sensor name is required");
    }

    if (
      sensor.value === null ||
      sensor.value === undefined ||
      sensor.value === ""
    ) {
      errors.push(`${sensor.name || "Unknown sensor"} reading is missing`);
      continue;
    }

    if (typeof sensor.value !== "number" || Number.isNaN(sensor.value)) {
      errors.push(`${sensor.name} reading must be a valid number`);
    }

    if (!sensor.unit) {
      errors.push(`${sensor.name} unit is required`);
    }
  }

  return errors;
};

module.exports = {
  validateSensorReadings,
};
