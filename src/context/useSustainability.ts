import { useContext } from 'react'
import { SustainabilityContext } from './sustainabilityContextInstance'

export function useSustainability() {
  const context = useContext(SustainabilityContext)
  if (!context) throw new Error('useSustainability must be used within a SustainabilityProvider')
  return context
}
