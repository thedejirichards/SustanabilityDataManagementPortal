import { useMemo, useState, type ReactNode } from 'react'
import { users as demoUsers, type UserAdditionRequest } from '../data/users'
import { UsersContext, type UsersContextValue } from './usersContextInstance'

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(demoUsers)
  const [userAdditionRequests, setUserAdditionRequests] = useState<UserAdditionRequest[]>([])

  const value = useMemo<UsersContextValue>(() => ({
    users,
    userAdditionRequests,
    addUser: (user) => setUsers((current) => [
      { ...user, id: `user-${Date.now().toString().slice(-6)}`, lastActive: '—' },
      ...current,
    ]),
    requestUserAddition: (user, requestedBy, requestedById) => setUserAdditionRequests((current) => [
      {
        ...user,
        id: `uar-${Date.now().toString().slice(-6)}`,
        requestedBy,
        requestedById,
        requestedAt: new Date().toISOString().slice(0, 10),
        decisionStatus: 'Pending',
      },
      ...current,
    ]),
    approveUserAddition: (requestId, decidedBy) => {
      const request = userAdditionRequests.find((item) => item.id === requestId && item.decisionStatus === 'Pending')
      if (!request) return
      const decidedAt = new Date().toISOString().slice(0, 10)
      setUserAdditionRequests((current) => current.map((item) => (
        item.id === requestId ? { ...item, decisionStatus: 'Approved', decidedBy, decidedAt } : item
      )))
      setUsers((current) => [
        {
          id: `user-${Date.now().toString().slice(-6)}`,
          name: request.name,
          email: request.email,
          role: request.role,
          status: request.status,
          department: request.department,
          lastActive: '—',
        },
        ...current,
      ])
    },
    rejectUserAddition: (requestId, decidedBy) => {
      const decidedAt = new Date().toISOString().slice(0, 10)
      setUserAdditionRequests((current) => current.map((request) => (
        request.id === requestId && request.decisionStatus === 'Pending'
          ? { ...request, decisionStatus: 'Rejected', decidedBy, decidedAt }
          : request
      )))
    },
    updateUser: (id, updates) => setUsers((current) => current.map((user) => user.id === id ? { ...user, ...updates } : user)),
    updateUserRole: (id, role) => setUsers((current) => current.map((user) => user.id === id ? { ...user, role } : user)),
    updateUserStatus: (id, status) => setUsers((current) => current.map((user) => user.id === id ? { ...user, status } : user)),
  }), [users, userAdditionRequests])

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}
