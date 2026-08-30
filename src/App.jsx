import { Navigate, Route, Routes } from 'react-router-dom'

import ClustersPage from './pages/ClustersPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clusters" replace />} />

      <Route path="/clusters" element={<ClustersPage />} />

      <Route
        path="*"
        element={<Navigate to="/clusters" replace />}
      />
    </Routes>
  )
}