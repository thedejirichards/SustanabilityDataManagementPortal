import { useMemo, useState, type ReactNode } from 'react'
import { demoRecords } from '../data/sustainability'
import { SustainabilityContext, type ReviewNotification, type SustainabilityContextValue } from './sustainabilityContextInstance'

export function SustainabilityProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState(demoRecords)
  const [notifications, setNotifications] = useState<ReviewNotification[]>([])

  const value = useMemo<SustainabilityContextValue>(() => ({
    records,
    notifications,
    addRecord: (record) => setRecords((current) => [record, ...current]),
    updateStatus: (id, status, reviewer, feedback, checks) => {
      if (status === 'Submitted') return
      const reviewedAt = new Date().toISOString()
      const record = records.find((item) => item.id === id)
      if (!record || record.status !== 'Submitted') return
      setRecords((current) => current.map((item) => item.id === id ? {
        ...item,
        status,
        reviewedBy: reviewer,
        reviewedAt,
        reviewFeedback: feedback,
        reviewChecks: checks,
      } : item))
      setNotifications((current) => [{
        id: `${id}-${Date.now()}`,
        recordId: id,
        recordName: record.name,
        recipient: record.submittedBy,
        branch: record.location,
        status,
        reviewer,
        feedback,
        createdAt: reviewedAt,
        read: false,
      }, ...current])
    },
    markNotificationRead: (id) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification)),
    recordsForPillar: (pillar) => records.filter((record) => record.pillar === pillar),
  }), [records, notifications])

  return <SustainabilityContext.Provider value={value}>{children}</SustainabilityContext.Provider>
}
