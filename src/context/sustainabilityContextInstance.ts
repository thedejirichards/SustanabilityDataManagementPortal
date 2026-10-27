import { createContext } from 'react'
import type { PillarKey, RecordStatus, SustainabilityRecord } from '../data/sustainability'

export interface SustainabilityContextValue {
  records: SustainabilityRecord[]
  addRecord: (record: SustainabilityRecord) => void
  updateStatus: (id: string, status: RecordStatus) => void
  recordsForPillar: (pillar: PillarKey) => SustainabilityRecord[]
}

export const SustainabilityContext = createContext<SustainabilityContextValue | null>(null)
