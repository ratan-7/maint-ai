import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import ReportIssue from "./pages/ReportIssue";
import IssueDetails from "./pages/IssueDetails";
import WorkOrders from "./pages/WorkOrders";
import MaintenanceHistory from "./pages/MaintenanceHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/equipment" element={<Equipment />} />

          <Route path="/report-issue" element={<ReportIssue />} />

          <Route path="/issues/:id" element={<IssueDetails />} />

          <Route path="/work-orders" element={<WorkOrders />} />

          <Route path="/maintenance-history" element={<MaintenanceHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
