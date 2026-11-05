import { useMemo, useState, type ReactNode } from 'react'
import { users as demoUsers } from '../data/users'
import { UsersContext, type UsersContextValue } from './usersContextInstance'

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(demoUsers)

  const value = useMemo<UsersContextValue>(() => ({
    users,
    addUser: (user) => setUsers((current) => [
      { ...user, id: `user-${Date.now().toString().slice(-6)}`, lastActive: '—' },
      ...current,
    ]),
    updateUser: (id, updates) => setUsers((current) => current.map((user) => user.id === id ? { ...user, ...updates } : user)),
    updateUserRole: (id, role) => setUsers((current) => current.map((user) => user.id === id ? { ...user, role } : user)),
    updateUserStatus: (id, status) => setUsers((current) => current.map((user) => user.id === id ? { ...user, status } : user)),
  }), [users])

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}
