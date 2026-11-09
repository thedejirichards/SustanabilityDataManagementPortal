import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import SustainabilityDashboardPage from './pages/SustainabilityDashboardPage'
import PillarPage from './pages/PillarPage'
import SubmissionsPage from './pages/SubmissionsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import UserManagementPage from './pages/UserManagementPage'
import { pillars, type PillarDefinition } from './data/sustainability'
import { canManageUsers } from './data/users'
import { useCurrentUser } from './context/useCurrentUser'

function DataCaptureRoute({ pillar }: { pillar: PillarDefinition }) {
  const { currentUser } = useCurrentUser()
  if (canManageUsers(currentUser.role)) return <Navigate to="/dashboard" replace />
  return <PillarPage pillar={pillar} />
}

function AdminRestrictedRoute({ children }: { children: ReactElement }) {
  const { currentUser } = useCurrentUser()
  if (canManageUsers(currentUser.role)) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<SustainabilityDashboardPage />} />
        {pillars.map((pillar) => (
          <Route key={pillar.key} path={pillar.path} element={<DataCaptureRoute pillar={pillar} />} />
        ))}
        <Route path="/submissions" element={<AdminRestrictedRoute><SubmissionsPage /></AdminRestrictedRoute>} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
