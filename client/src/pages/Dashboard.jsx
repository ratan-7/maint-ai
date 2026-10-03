import { useEffect } from "react";
import { getEquipment } from "../services/api";

function Dashboard() {
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await getEquipment();

        console.log("Equipment:", response.data);
      } catch (error) {
        console.error(
          "Failed to fetch equipment:",
          error.response?.data || error.message,
        );
      }
    };

    loadEquipment();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
