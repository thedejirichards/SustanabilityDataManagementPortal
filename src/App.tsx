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
import { canViewPillar, pillars, type PillarDefinition } from './data/sustainability'
import { canManageUsers, getInputterHomePath } from './data/users'
import { useCurrentUser } from './context/useCurrentUser'

function DataCaptureRoute({ pillar }: { pillar: PillarDefinition }) {
  const { currentUser } = useCurrentUser()
  const inputterHomePath = getInputterHomePath(currentUser.role, currentUser.department)
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  if (!canViewPillar(currentUser.role, pillar.key, currentUser.department)) return <Navigate to={inputterHomePath ?? '/dashboard'} replace />
  if (canManageUsers(currentUser.role)) return <Navigate to="/dashboard" replace />
  return <PillarPage pillar={pillar} />
}

function DashboardRoute() {
  const { currentUser } = useCurrentUser()
  const inputterHomePath = getInputterHomePath(currentUser.role, currentUser.department)
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  if (inputterHomePath) return <Navigate to={inputterHomePath} replace />
  return <SustainabilityDashboardPage />
}

function CountryNominationRoute() {
  const { currentUser } = useCurrentUser()
  const inputterHomePath = getInputterHomePath(currentUser.role, currentUser.department)
  if (currentUser.role !== 'Country Managing Director / Head of Subsidiary') {
    return <Navigate to={inputterHomePath ?? '/dashboard'} replace />
  }
  return <NominationFormPage />
}

function StaffOnlyRoute({ children }: { children: ReactElement }) {
  const { currentUser } = useCurrentUser()
  const inputterHomePath = getInputterHomePath(currentUser.role, currentUser.department)
  if (currentUser.role === 'Country Managing Director / Head of Subsidiary') return <Navigate to="/nomination" replace />
  if (inputterHomePath) return <Navigate to={inputterHomePath} replace />
  return children
}

function AdminOnlyRoute({ children }: { children: ReactElement }) {
  const { currentUser } = useCurrentUser()
  const inputterHomePath = getInputterHomePath(currentUser.role, currentUser.department)
  if (inputterHomePath) return <Navigate to={inputterHomePath} replace />
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
        <Route path="/submissions" element={<StaffOnlyRoute><SubmissionsPage /></StaffOnlyRoute>} />
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
