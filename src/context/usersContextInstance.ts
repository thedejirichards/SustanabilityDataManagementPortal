import { createContext } from 'react'
import type { AppRole, AppUser, UserAdditionRequest, UserStatus } from '../data/users'

export interface UsersContextValue {
  users: AppUser[]
  userAdditionRequests: UserAdditionRequest[]
  addUser: (user: Omit<AppUser, 'id' | 'lastActive'>) => void
  requestUserAddition: (user: Omit<AppUser, 'id' | 'lastActive' | 'adminType'>, requestedBy: string, requestedById: string) => void
  approveUserAddition: (requestId: string, decidedBy: string) => void
  rejectUserAddition: (requestId: string, decidedBy: string) => void
  updateUser: (id: string, updates: Partial<Omit<AppUser, 'id'>>) => void
  updateUserRole: (id: string, role: AppRole) => void
  updateUserStatus: (id: string, status: UserStatus) => void
}

export const UsersContext = createContext<UsersContextValue | null>(null)
