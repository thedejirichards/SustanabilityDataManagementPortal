export type AppRole = 'Data Contributor' | 'Sustainability Reviewer' | 'Portal Administrator'
export type UserStatus = 'Active' | 'Suspended' | 'Invited'
export type AdminType = 'maker' | 'checker'

export interface AppUser {
  id: string
  name: string
  email: string
  role: AppRole
  status: UserStatus
  department: string
  lastActive: string
  adminType?: AdminType
}

export const appRoles: AppRole[] = ['Data Contributor', 'Sustainability Reviewer', 'Portal Administrator']
export const userStatuses: UserStatus[] = ['Active', 'Suspended', 'Invited']

export type UserAdditionDecision = 'Pending' | 'Approved' | 'Rejected'

export interface UserAdditionRequest {
  id: string
  name: string
  email: string
  role: AppRole
  status: UserStatus
  department: string
  requestedBy: string
  requestedById: string
  requestedAt: string
  decisionStatus: UserAdditionDecision
  decidedBy?: string
  decidedAt?: string
}

// Demo identities only. Production identity and permissions must come from the Access SSO service.
export const users: AppUser[] = [
  {
    id: 'contributor',
    name: 'Amara Okafor',
    email: 'amara.okafor@example.test',
    role: 'Data Contributor',
    status: 'Active',
    department: 'Sustainability',
    lastActive: '2026-10-24',
  },
  {
    id: 'reviewer',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@example.test',
    role: 'Sustainability Reviewer',
    status: 'Active',
    department: 'Risk & Compliance',
    lastActive: '2026-10-23',
  },
  {
    id: 'administrator',
    name: 'Chidi Okafor (Maker)',
    email: 'chidi.okafor.maker@example.test',
    role: 'Portal Administrator',
    status: 'Active',
    department: 'Group Operations',
    lastActive: '2026-10-25',
    adminType: 'maker',
  },
  {
    id: 'administrator-checker',
    name: 'Ibrahim Musa (Checker)',
    email: 'ibrahim.musa.checker@example.test',
    role: 'Portal Administrator',
    status: 'Active',
    department: 'Group Operations',
    lastActive: '2026-10-25',
    adminType: 'checker',
  },
]

export function canManageUsers(role: AppRole) {
  return role === 'Portal Administrator'
}
