import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import type { RecordStatus } from '../data/sustainability'

const reviewChecks = [
  'Required reporting fields are complete',
  'Reported values are consistent with the reporting period and units',
  'Source evidence has been reviewed or marked not applicable',
]

export default function ReviewDecisionPanel({ onDecision }: { onDecision: (status: RecordStatus, feedback: string, checks: string[]) => void }) {
  const [checks, setChecks] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  function decide(status: RecordStatus) {
    if (status === 'Approved' && checks.length !== reviewChecks.length) {
      setError('Complete each validation check before approving this submission.')
      return
    }
    if (status === 'Rejected' && !feedback.trim()) {
      setError('Add clear feedback so the branch knows what to correct.')
      return
    }
    setError('')
    onDecision(status, feedback.trim(), checks)
  }

  return (
    <section className="mt-5 border-t border-slate-200 pt-4" aria-label="Submission validation">
      <h3 className="text-sm font-bold text-slate-800">Review and validate</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">Check the submission and its source documents before recording a decision.</p>
      <div className="mt-3 space-y-2">
        {reviewChecks.map((check) => (
          <label key={check} className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
            <input type="checkbox" checked={checks.includes(check)} onChange={(event) => {
              setChecks((current) => event.target.checked ? [...current, check] : current.filter((item) => item !== check))
              setError('')
            }} className="mt-0.5 h-4 w-4 accent-brand-600" />
            <span>{check}</span>
          </label>
        ))}
      </div>
      <label className="mt-3 block text-xs font-semibold text-slate-700" htmlFor="review-feedback">Reviewer feedback <span className="font-normal text-slate-500">(required when rejecting)</span></label>
      <textarea id="review-feedback" value={feedback} onChange={(event) => { setFeedback(event.target.value); setError('') }} rows={3} placeholder="For a rejection, explain the corrections required by the branch." className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10" />
      {error && <p role="alert" className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => decide('Rejected')} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700"><RotateCcw className="h-4 w-4" /> Reject with feedback</button>
        <button type="button" onClick={() => decide('Approved')} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700"><Check className="h-4 w-4" /> Approve validated submission</button>
      </div>
    </section>
  )
}
