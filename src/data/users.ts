export type AppRole = 'Data Inputter' | 'Group Head' | 'Sustainability Inputter' | 'Sustainability Reviewer' | 'Portal Administrator' | 'Country Managing Director / Head of Subsidiary'
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

export const appRoles: AppRole[] = ['Data Inputter', 'Group Head', 'Sustainability Inputter', 'Sustainability Reviewer', 'Portal Administrator', 'Country Managing Director / Head of Subsidiary']
export const userStatuses: UserStatus[] = ['Active', 'Suspended', 'Invited']

export const financeInputterDepartments = [
  'Corporate',
  'Project Finance',
  'Retail',
  'SME Banking',
  'CSI',
  'Risk',
  'Business',
  'Credit',
  'Treasury',
]

export function getInputterAllowedPillars(role: AppRole, department: string) {
  if (role !== 'Data Inputter' && role !== 'Group Head') return null
  if (department === 'Corporate Communications') return ['advocacy'] as const
  if (department === 'CSI Unit') return ['csi'] as const
  if (department === 'Risk') return ['operations', 'finance'] as const
  return financeInputterDepartments.includes(department) ? ['finance'] as const : ['operations'] as const
}

export function getInputterHomePath(role: AppRole, department: string) {
  const allowedPillars = getInputterAllowedPillars(role, department)
  if (!allowedPillars) return null
  if (allowedPillars.some((pillar) => pillar === 'finance')) return '/development-finance'
  if (allowedPillars.some((pillar) => pillar === 'csi')) return '/corporate-social-investment'
  if (allowedPillars.some((pillar) => pillar === 'advocacy')) return '/thought-leadership-awards'
  return '/operations'
}

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
export const dataInputterDepartments = [
  'CSI Unit',
  'Corporate Communications',
  'HR',
  'Compliance',
  'Facilities',
  'Legal',
  'HSE',
  'Operations',
  'Fleet',
  'Procurement',
  'Admin',
  'IT',
  'Audit',
  ...financeInputterDepartments,
]

const departmentDemoNames: Record<string, { inputter: string; groupHead: string }> = {
  HR: { inputter: 'Dami Adebayo - HR', groupHead: 'Bolu Okafor - HR' },
  Compliance: { inputter: 'Chinwe Okoro - Compliance', groupHead: 'Oluwaseun Akinyemi - Compliance' },
  Facilities: { inputter: 'Ngozi Nwosu - Facilities', groupHead: 'Emeka Nwosu - Facilities' },
  Legal: { inputter: 'Nneka Okafor - Legal', groupHead: 'Olumide Akinola - Legal' },
  HSE: { inputter: 'Chika Umeh - HSE', groupHead: 'Babatunde Akinyemi - HSE' },
  'CSI Unit': { inputter: 'CSI Inputter', groupHead: 'CSI Group Head' },
  'Corporate Communications': { inputter: 'Corporate Communications Inputter', groupHead: 'Corporate Communications Group Head' },
  Operations: { inputter: 'Ayo Alade - Operations', groupHead: 'Benita Okafo - Operations' },
  Fleet: { inputter: 'Ayo Obadimu - Fleet', groupHead: 'Chinedu Obi - Fleet' },
  Procurement: { inputter: 'Ikenna Nwachukwu - Procurement', groupHead: 'Folake Adebayo - Procurement' },
  Admin: { inputter: 'Seyi Oladipo - Admin', groupHead: 'Uchechi Okafor - Admin' },
  IT: { inputter: 'Oluwaseun Adeyemi - IT', groupHead: 'Chibuzo Nnamdi - IT' },
  Risk: { inputter: 'Aisha Mohammed - Risk', groupHead: 'Musa Bello - Risk' },
  Audit: { inputter: 'Adaobi Eze - Audit', groupHead: 'Okechukwu Ibe - Audit' },
  'Project Finance': { inputter: 'Project Finance Inputter', groupHead: 'Project Finance Group Head' },
  Retail: { inputter: 'Retail Inputter', groupHead: 'Retail Group Head' },
  'SME Banking': { inputter: 'SME Banking Inputter', groupHead: 'SME Banking Group Head' },
  Business: { inputter: 'Business Inputter', groupHead: 'Business Group Head' },
  Credit: { inputter: 'Credit Inputter', groupHead: 'Credit Group Head' },
  Treasury: { inputter: 'Treasury Inputter', groupHead: 'Treasury Group Head' },
}

const dataInputterUsers: AppUser[] = dataInputterDepartments.filter((department) => department !== 'Corporate' && department !== 'CSI').flatMap((department): AppUser[] => {
  const departmentId = department.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const demoNames = departmentDemoNames[department]
  const inputter: AppUser = {
    id: `data-inputter-${departmentId}`,
    name: demoNames.inputter,
    email: `data.inputter.${departmentId}@example.test`,
    role: 'Data Inputter',
    status: 'Active',
    department,
    lastActive: '—',
  }
  const groupHead: AppUser = {
    id: `group-head-${departmentId}`,
    name: demoNames.groupHead,
    email: `group.head.${departmentId}@example.test`,
    role: 'Group Head',
    status: 'Active',
    department,
    lastActive: '—',
  }
  return [inputter, groupHead]
})

export const users: AppUser[] = [
  {
    id: 'branch-rep',
    name: 'Branch Rep',
    email: 'branch.rep@example.test',
    role: 'Data Inputter',
    status: 'Active',
    department: 'Operations',
    lastActive: '—',
  },
  {
    id: 'ebs',
    name: 'EBS',
    email: 'ebs@example.test',
    role: 'Group Head',
    status: 'Active',
    department: 'Operations',
    lastActive: '—',
  },
  {
    id: 'sustainability-inputter',
    name: 'Sustainability Inputter',
    email: 'sustainability.inputter@example.test',
    role: 'Sustainability Inputter',
    status: 'Active',
    department: 'Sustainability',
    lastActive: '—',
  },
  ...dataInputterUsers,
  {
    id: 'reviewer',
    name: 'Esther Mfonabasi Graham - Risk & Compliance',
    email: 'esther.mfonabasi.graham@example.test',
    role: 'Sustainability Reviewer',
    status: 'Active',
    department: 'Risk & Compliance',
    lastActive: '2026-10-23',
  },
  {
    id: 'administrator',
    name: 'Chidi Okafor - Group Operations',
    email: 'chidi.okafor.maker@example.test',
    role: 'Portal Administrator',
    status: 'Active',
    department: 'Group Operations',
    lastActive: '2026-10-25',
    adminType: 'maker',
  },
  {
    id: 'administrator-checker',
    name: 'Ibrahim Musa - Group Operations',
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
