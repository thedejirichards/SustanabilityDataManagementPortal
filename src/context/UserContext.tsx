import { useState, type ReactNode } from 'react'
import { users, type AppUser } from '../data/users'
import { UserContext } from './userContextInstance'

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(users[0])

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
}
