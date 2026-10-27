import type { RecordStatus } from '../data/sustainability'

const classes: Record<RecordStatus, string> = {
  Submitted: 'bg-brand-50 text-brand-700 ring-brand-100',
  'In review': 'bg-amber-50 text-amber-700 ring-amber-100',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Returned: 'bg-rose-50 text-rose-700 ring-rose-100',
}

export default function StatusBadge({ status }: { status: RecordStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${classes[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
