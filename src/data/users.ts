export type AppRole = 'Data Contributor' | 'Sustainability Reviewer' | 'Portal Administrator' | 'Country Managing Director / Head of Subsidiary'
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
  country?: string
  subsidiary?: string
}

export const appRoles: AppRole[] = ['Data Contributor', 'Sustainability Reviewer', 'Portal Administrator', 'Country Managing Director / Head of Subsidiary']
export const userStatuses: UserStatus[] = ['Active', 'Suspended', 'Invited']

export type UserAdditionDecision = 'Pending' | 'Approved' | 'Rejected'

export interface UserAdditionRequest {
  id: string
  name: string
  email: string
  role: AppRole
  status: UserStatus
  department: string
  country?: string
  subsidiary?: string
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
  {
    id: 'country-md-kenya',
    name: 'Ralph Opara',
    email: 'ralph.opara@accessbankplc.com',
    role: 'Country Managing Director / Head of Subsidiary',
    status: 'Active',
    department: 'Country Leadership',
    lastActive: '2026-10-05',
    country: 'Kenya',
    subsidiary: 'Access Bank (Kenya) PLC',
  },
]

export function canManageUsers(role: AppRole) {
  return role === 'Portal Administrator'
}
