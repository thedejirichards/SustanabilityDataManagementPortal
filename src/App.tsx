import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import SustainabilityDashboardPage from './pages/SustainabilityDashboardPage'
import PillarPage from './pages/PillarPage'
import SubmissionsPage from './pages/SubmissionsPage'
import ReportsPage from './pages/ReportsPage'
import SetupGuidePage from './pages/SetupGuidePage'
import SettingsPage from './pages/SettingsPage'
import UserManagementPage from './pages/UserManagementPage'
import NominationFormPage from './pages/NominationFormPage'
import { pillars, type PillarDefinition } from './data/sustainability'
import { canManageUsers } from './data/users'
import { useCurrentUser } from './context/useCurrentUser'

function DataCaptureRoute({ pillar }: { pillar: PillarDefinition }) {
  const { currentUser } = useCurrentUser()
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  if (canManageUsers(currentUser.role)) return <Navigate to="/dashboard" replace />
  return <PillarPage pillar={pillar} />
}

function DashboardRoute() {
  const { currentUser } = useCurrentUser()
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  return <SustainabilityDashboardPage />
}

function CountryNominationRoute() {
  const { currentUser } = useCurrentUser()
  if (currentUser.role !== 'Country Managing Director / Head of Subsidiary') return <Navigate to="/dashboard" replace />
  return <NominationFormPage />
}

function StaffOnlyRoute({ children }: { children: ReactElement }) {
  const { currentUser } = useCurrentUser()
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  return children
}

function AdminRestrictedRoute({ children }: { children: ReactElement }) {
  const { currentUser } = useCurrentUser()
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  if (canManageUsers(currentUser.role)) return <Navigate to="/dashboard" replace />
  return children
}

function AdminOnlyRoute({ children }: { children: ReactElement }) {
  const { currentUser } = useCurrentUser()
  if (!canManageUsers(currentUser.role)) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/nomination" element={<CountryNominationRoute />} />
        {pillars.map((pillar) => (
          <Route key={pillar.key} path={pillar.path} element={<DataCaptureRoute pillar={pillar} />} />
        ))}
        <Route path="/submissions" element={<AdminRestrictedRoute><SubmissionsPage /></AdminRestrictedRoute>} />
        <Route path="/setup-guide" element={<StaffOnlyRoute><SetupGuidePage /></StaffOnlyRoute>} />
        <Route path="/reports" element={<StaffOnlyRoute><ReportsPage /></StaffOnlyRoute>} />
        <Route path="/settings" element={<AdminOnlyRoute><SettingsPage /></AdminOnlyRoute>} />
        <Route path="/users" element={<StaffOnlyRoute><UserManagementPage /></StaffOnlyRoute>} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
