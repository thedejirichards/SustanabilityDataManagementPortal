import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import SustainabilityDashboardPage from './pages/SustainabilityDashboardPage'
import PillarPage from './pages/PillarPage'
import SubmissionsPage from './pages/SubmissionsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import { pillars } from './data/sustainability'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<SustainabilityDashboardPage />} />
        {pillars.map((pillar) => (
          <Route key={pillar.key} path={pillar.path} element={<PillarPage pillar={pillar} />} />
        ))}
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
