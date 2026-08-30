import { Navigate, Route, Routes } from "react-router-dom";

import ClustersPage from "./pages/ClustersPage";
import NamespacesPage from "./pages/NamespacesPage";
import AppsPage from "./pages/AppsPage";
import AppDetailPage from "./pages/AppDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clusters" replace />} />

      <Route path="/clusters" element={<ClustersPage />} />

      <Route path="/clusters/:clusterId" element={<NamespacesPage />} />

      <Route
        path="/clusters/:clusterId/namespaces/:namespaceId"
        element={<AppsPage />}
      />

      <Route
        path="/clusters/:clusterId/namespaces/:namespaceId/apps/:appId"
        element={<AppDetailPage />}
      />
    </Routes>
  );
}
