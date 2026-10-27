import { useMemo, useState } from 'react'
import { Check, ClipboardCheck, Eye, RotateCcw, Search } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import { canReview, formatPeriod, pillarByKey, pillars, type RecordStatus, type SustainabilityRecord } from '../data/sustainability'
import { useSustainability } from '../context/useSustainability'
import { useCurrentUser } from '../context/useCurrentUser'

const PAGE_SIZE = 8
const statuses: RecordStatus[] = ['Submitted', 'In review', 'Approved', 'Returned']

export default function SubmissionsPage() {
  const { records, updateStatus } = useSustainability()
  const { currentUser } = useCurrentUser()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [pillar, setPillar] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SustainabilityRecord | null>(null)
  const canAct = canReview(currentUser.role)

  const filteredRecords = useMemo(() => records.filter((record) => {
    const query = `${record.id} ${record.name} ${record.country} ${record.submittedBy} ${record.category}`.toLowerCase()
    return (status === 'all' || record.status === status)
      && (pillar === 'all' || record.pillar === pillar)
      && query.includes(search.trim().toLowerCase())
  }).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)), [records, status, pillar, search])
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const pageRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const submittedCount = records.filter((record) => record.status === 'Submitted').length
  const inReviewCount = records.filter((record) => record.status === 'In review').length
  const approvedCount = records.filter((record) => record.status === 'Approved').length

  function changeStatus(record: SustainabilityRecord, next: RecordStatus) {
    updateStatus(record.id, next)
    setSelected((current) => current?.id === record.id ? { ...current, status: next } : current)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, 'Submissions & reviews']} />
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">Submissions & reviews</h1><p className="mt-1.5 text-sm text-slate-500">Follow submitted sustainability records through the review workflow.</p></div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-[10px] font-semibold text-brand-700"><ClipboardCheck className="h-3.5 w-3.5" /> {canAct ? 'Reviewer preview' : 'Contributor view'}</span>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p className="text-xs leading-5 text-brand-900"><span className="font-bold">Workflow demonstration.</span> Review actions update the current browser session only. Production role permissions, evidence controls, audit history and routing require server-side authorization and workflow services.</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Submitted</p><p className="mt-1 text-2xl font-bold text-brand-700">{submittedCount}</p><p className="mt-1 text-[10px] text-slate-400">Awaiting initial review</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">In review</p><p className="mt-1 text-2xl font-bold text-amber-600">{inReviewCount}</p><p className="mt-1 text-[10px] text-slate-400">Currently being reviewed</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Approved</p><p className="mt-1 text-2xl font-bold text-emerald-700">{approvedCount}</p><p className="mt-1 text-[10px] text-slate-400">Illustrative approved records</p></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-5">
          <div><h2 className="text-sm font-bold text-slate-900">Submission register</h2><p className="mt-1 text-[10px] text-slate-500">{filteredRecords.length} matching {filteredRecords.length === 1 ? 'record' : 'records'}</p></div>
          <div className="flex flex-wrap gap-2">
            <label className="relative block min-w-48 flex-1 sm:flex-none">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search submissions" className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-[11px] outline-none placeholder:text-slate-400 focus:border-brand-500" />
            </label>
            <select aria-label="Filter by pillar" value={pillar} onChange={(event) => { setPillar(event.target.value); setPage(1) }} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All pillars</option>{pillars.map((item) => <option key={item.key} value={item.key}>{item.shortTitle}</option>)}</select>
            <select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-3">Record</th><th className="px-4 py-3">Pillar</th><th className="px-4 py-3">Reporting period</th><th className="px-4 py-3">Submitted by</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody>
              {pageRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-3.5"><p className="max-w-52 truncate text-xs font-semibold text-slate-800">{record.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{record.id}</p></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600">{pillarByKey[record.pillar].shortTitle}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600">{formatPeriod(record.period)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600">{record.submittedBy}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">{record.submittedAt}</td>
                  <td className="whitespace-nowrap px-4 py-3.5"><StatusBadge status={record.status} /></td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button type="button" onClick={() => setSelected(record)} aria-label={`View ${record.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Eye className="h-4 w-4" /></button>
                      {canAct && (record.status === 'Submitted' || record.status === 'In review') && <>
                        <button type="button" onClick={() => changeStatus(record, 'Approved')} title="Approve" className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"><Check className="h-3.5 w-3.5" /><span className="hidden sm:inline">Approve</span></button>
                        <button type="button" onClick={() => changeStatus(record, 'Returned')} title="Return for correction" className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Return</span></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
              {pageRecords.length === 0 && <tr><td colSpan={7} className="px-6 py-14 text-center text-xs text-slate-500">No submissions match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={pageCount} onPageChange={setPage} />
      </section>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name ?? 'Submission details'}>
        {selected && <div className="pr-6">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-600">{pillarByKey[selected.pillar].shortTitle} · {selected.id}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{selected.name}</h2>
          <div className="mt-3"><StatusBadge status={selected.status} /></div>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {[['Reporting period', formatPeriod(selected.period)], ['Country', selected.country], ['Subsidiary', selected.subsidiary], ['Business unit', selected.businessUnit], ['Location', selected.location], ['Submitted by', selected.submittedBy], ...Object.entries(selected.values).filter(([, value]) => value).map(([key, value]) => [key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`), value])].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5"><dt className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-xs font-medium text-slate-700">{value}</dd></div>)}
          </dl>
          {canAct && (selected.status === 'Submitted' || selected.status === 'In review') && <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => changeStatus(selected, 'Returned')} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw className="h-3.5 w-3.5" /> Return</button><button type="button" onClick={() => changeStatus(selected, 'Approved')} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"><Check className="h-3.5 w-3.5" /> Approve</button></div>}
          <p className="mt-4 text-[10px] leading-4 text-slate-400">Demo review actions update this session only; audit history and server-side access controls are not connected.</p>
        </div>}
      </Modal>
    </div>
  )
}
