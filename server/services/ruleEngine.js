const checkSensorRules = (sensorReadings = []) => {
  const results = [];

  for (const sensor of sensorReadings) {
    const { name, value, unit } = sensor;

    if (name.toLowerCase() === "temperature") {
      let status = "NORMAL";
      let message = "Temperature is within normal range.";

      if (value > 90) {
        status = "CRITICAL";
        message = "Temperature exceeds the critical threshold of 90°C.";
      } else if (value > 75) {
        status = "WARNING";
        message = "Temperature exceeds the warning threshold of 75°C.";
      }

      results.push({
        sensor: name,
        value,
        unit,
        status,
        message,
      });
    }

  
    if (name.toLowerCase() === "vibration") {
      let status = "NORMAL";
      let message = "Vibration is within normal range.";

      if (value > 7) {
        status = "HIGH";
        message = "Vibration exceeds the high threshold of 7 mm/s.";
      } else if (value > 4) {
        status = "WARNING";
        message = "Vibration exceeds the warning threshold of 4 mm/s.";
      }

      results.push({
        sensor: name,
        value,
        unit,
        status,
        message,
      });
    }
  }

  return results;
};


const calculatePriority = (ruleResults) => {
  if (ruleResults.some((result) => result.status === "CRITICAL")) {
    return "CRITICAL";
  }

  if (ruleResults.some((result) => result.status === "HIGH")) {
    return "HIGH";
  }

  if (ruleResults.some((result) => result.status === "WARNING")) {
    return "MEDIUM";
  }

  return "LOW";
};

module.exports = {
  checkSensorRules,
  calculatePriority,
};
