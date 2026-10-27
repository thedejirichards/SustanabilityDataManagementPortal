import { useMemo, useState, type ReactNode } from 'react'
import { demoRecords } from '../data/sustainability'
import { SustainabilityContext, type SustainabilityContextValue } from './sustainabilityContextInstance'

export function SustainabilityProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState(demoRecords)

  const value = useMemo<SustainabilityContextValue>(() => ({
    records,
    addRecord: (record) => setRecords((current) => [record, ...current]),
    updateStatus: (id, status) => setRecords((current) => current.map((record) => record.id === id ? { ...record, status } : record)),
    recordsForPillar: (pillar) => records.filter((record) => record.pillar === pillar),
  }), [records])

  return <SustainabilityContext.Provider value={value}>{children}</SustainabilityContext.Provider>
}
