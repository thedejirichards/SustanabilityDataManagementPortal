import { createContext } from 'react'
import type { AppUser } from '../data/users'

export interface UserContextValue {
  currentUser: AppUser
  setCurrentUser: (user: AppUser) => void
}

export const UserContext = createContext<UserContextValue | null>(null)
