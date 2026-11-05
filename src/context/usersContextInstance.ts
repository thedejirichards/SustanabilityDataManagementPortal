import { createContext } from 'react'
import type { AppRole, AppUser, UserStatus } from '../data/users'

export interface UsersContextValue {
  users: AppUser[]
  addUser: (user: Omit<AppUser, 'id' | 'lastActive'>) => void
  updateUser: (id: string, updates: Partial<Omit<AppUser, 'id'>>) => void
  updateUserRole: (id: string, role: AppRole) => void
  updateUserStatus: (id: string, status: UserStatus) => void
}

export const UsersContext = createContext<UsersContextValue | null>(null)
