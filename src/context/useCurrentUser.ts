import { useContext } from 'react'
import { UserContext } from './userContextInstance'

export function useCurrentUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useCurrentUser must be used within a UserProvider')
  return ctx
}
