import { Navigate, Route, Routes } from "react-router-dom";

import ClustersPage from "./pages/ClustersPage";
import NamespacesPage from "./pages/NamespacesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clusters" replace />} />

      <Route path="/clusters" element={<ClustersPage />} />

      <Route path="/clusters/:clusterId" element={<NamespacesPage />} />

      <Route path="*" element={<Navigate to="/clusters" replace />} />
    </Routes>
  );
}
