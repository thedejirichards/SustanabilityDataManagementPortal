export type AppRole = 'Data Contributor' | 'Sustainability Reviewer' | 'Portal Administrator'
export type UserStatus = 'Active' | 'Suspended' | 'Invited'

export interface AppUser {
  id: string
  name: string
  email: string
  role: AppRole
  status: UserStatus
  department: string
  lastActive: string
}

export const appRoles: AppRole[] = ['Data Contributor', 'Sustainability Reviewer', 'Portal Administrator']
export const userStatuses: UserStatus[] = ['Active', 'Suspended', 'Invited']

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
    name: 'Chidi Okafor',
    email: 'chidi.okafor@example.test',
    role: 'Portal Administrator',
    status: 'Active',
    department: 'Group Operations',
    lastActive: '2026-10-25',
  },
  {
    id: 'contributor-2',
    name: 'Kelechi Eze',
    email: 'kelechi.eze@example.test',
    role: 'Data Contributor',
    status: 'Active',
    department: 'Retail Banking',
    lastActive: '2026-10-21',
  },
  {
    id: 'reviewer-2',
    name: 'Ngozi Adeyemi',
    email: 'ngozi.adeyemi@example.test',
    role: 'Sustainability Reviewer',
    status: 'Invited',
    department: 'Corporate Banking',
    lastActive: '—',
  },
  {
    id: 'contributor-3',
    name: 'Daniel Mensah',
    email: 'daniel.mensah@example.test',
    role: 'Data Contributor',
    status: 'Suspended',
    department: 'People & Culture',
    lastActive: '2026-09-12',
  },
]

export function canManageUsers(role: AppRole) {
  return role === 'Portal Administrator'
}
