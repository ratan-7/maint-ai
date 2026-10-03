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

const detectConflictingSensors = (sensorReadings = []) => {
  const conflicts = [];

  const groupedSensors = {};

  for (const sensor of sensorReadings) {
    const name = sensor.name?.toLowerCase();

    if (!name) continue;

    if (!groupedSensors[name]) {
      groupedSensors[name] = [];
    }

    groupedSensors[name].push(sensor);
  }

  for (const [sensorName, sensors] of Object.entries(groupedSensors)) {
    if (sensors.length < 2) continue;

    const values = sensors.map((sensor) => sensor.value);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const difference = Math.abs(max - min);

    const average = (max + min) / 2;

    if (average > 0 && difference / average > 0.2) {
      conflicts.push({
        sensor: sensorName,
        readings: sensors,
        message: `Conflicting ${sensorName} sensor readings detected.`,
      });
    }
  }

  return conflicts;
};

module.exports = {
  validateSensorReadings,
  detectConflictingSensors,
};
