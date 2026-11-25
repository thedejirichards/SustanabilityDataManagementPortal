import { createContext } from 'react'
import type { PillarKey, RecordStatus, SustainabilityRecord, VerificationStage } from '../data/sustainability'
import type { AppRole } from '../data/users'

export interface ReviewNotification {
  id: string
  recordId: string
  recordName: string
  recipient: string
  branch: string
  status: 'Approved' | 'Rejected'
  reviewer: string
  feedback: string
  createdAt: string
  read: boolean
}

export interface SustainabilityContextValue {
  records: SustainabilityRecord[]
  notifications: ReviewNotification[]
  addRecord: (record: SustainabilityRecord) => void
  updateStatus: (id: string, status: RecordStatus, reviewer: string, feedback: string, checks: string[], reviewerRole: AppRole) => void
  forwardToSustainabilityReview: (id: string, reviewer: string, reviewerDepartment: string, feedback: string, checks: string[]) => void
  updateVerificationStage: (id: string, stage: VerificationStage, reviewer: string, reference?: string) => void
  markNotificationRead: (id: string) => void
  recordsForPillar: (pillar: PillarKey) => SustainabilityRecord[]
}

export const SustainabilityContext = createContext<SustainabilityContextValue | null>(null)
