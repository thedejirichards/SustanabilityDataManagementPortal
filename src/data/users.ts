export type AppRole = 'Data Contributor' | 'Sustainability Reviewer' | 'Portal Administrator'

export interface AppUser {
  id: string
  name: string
  email: string
  role: AppRole
}

// Demo identities only. Production identity and permissions must come from the Access SSO service.
export const users: AppUser[] = [
  {
    id: 'contributor',
    name: 'Amara Okafor',
    email: 'amara.okafor@example.test',
    role: 'Data Contributor',
  },
  {
    id: 'reviewer',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@example.test',
    role: 'Sustainability Reviewer',
  },
  {
    id: 'administrator',
    name: 'Chidi Okafor',
    email: 'chidi.okafor@example.test',
    role: 'Portal Administrator',
  },
]
