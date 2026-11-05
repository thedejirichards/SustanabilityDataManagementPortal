import { useContext } from 'react'
import { UsersContext } from './usersContextInstance'

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within a UsersProvider')
  return ctx
}
