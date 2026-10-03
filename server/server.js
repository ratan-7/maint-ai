const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const equipmentRoutes = require("./routes/equipmentRoutes");
const issueRoutes = require("./routes/issueRoutes");
const workOrderRoutes = require("./routes/workOrderRoutes");
const maintenanceHistoryRoutes = require("./routes/maintenanceHistoryRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "MaintAI API is running",
  });
});

app.use("/api/equipment", equipmentRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/work-orders", workOrderRoutes);
app.use("/api/maintenance-history", maintenanceHistoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
