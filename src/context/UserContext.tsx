import { useState, type ReactNode } from 'react'
import { users, type AppUser } from '../data/users'
import { UserContext } from './userContextInstance'

const STORAGE_KEY = 'sdm.currentUserId'

function getDefaultUser(): AppUser {
  return users.find((user) => user.id === 'reviewer') ?? users[0]
}

function loadInitialUser(): AppUser {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY)
    return users.find((user) => user.id === saved) ?? getDefaultUser()
  } catch {
    return getDefaultUser()
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AppUser>(loadInitialUser)

  const setCurrentUser = (user: AppUser) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, user.id)
    } catch {
      // Demo-only persistence; ignore storage failures.
    }
    setCurrentUserState(user)
  }

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
}
