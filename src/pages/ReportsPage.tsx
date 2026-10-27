import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowRight, BarChart3, FileSpreadsheet, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import { formatPeriod, pillars, periods, type RecordStatus } from '../data/sustainability'
import { useSustainability } from '../context/useSustainability'

const statuses: RecordStatus[] = ['Submitted', 'In review', 'Approved', 'Returned']

export default function ReportsPage() {
  const { records } = useSustainability()
  const [period, setPeriod] = useState('all')
  const [pillar, setPillar] = useState('all')
  const filteredRecords = useMemo(() => records.filter((record) =>
    (period === 'all' || record.period === period) && (pillar === 'all' || record.pillar === pillar),
  ), [records, period, pillar])

  const byPillar = pillars.map((item) => ({
    ...item,
    count: filteredRecords.filter((record) => record.pillar === item.key).length,
  }))
  const maxCount = Math.max(1, ...byPillar.map((item) => item.count))
  const approvedCount = filteredRecords.filter((record) => record.status === 'Approved').length
  const pendingCount = filteredRecords.filter((record) => record.status === 'Submitted' || record.status === 'In review').length

  function exportCsv() {
    const headers = ['Record ID', 'Pillar', 'Record name', 'Category', 'Reporting period', 'Country', 'Subsidiary', 'Business unit', 'Location', 'Status', 'Submitted by', 'Submitted date']
    const rows = filteredRecords.map((record) => [
      record.id,
      pillars.find((item) => item.key === record.pillar)?.title ?? record.pillar,
      record.name,
      record.category,
      formatPeriod(record.period),
      record.country,
      record.subsidiary,
      record.businessUnit,
      record.location,
      record.status,
      record.submittedBy,
      record.submittedAt,
    ])
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sustainability-demo-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, 'Reports & analytics']} />
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">Reports & analytics</h1><p className="mt-1.5 text-sm text-slate-500">Explore the sustainability data register and export filtered records.</p></div>
        <button type="button" onClick={exportCsv} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"><ArrowDownToLine className="h-4 w-4" /> Export CSV</button>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5"><Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /><p className="text-xs leading-5 text-brand-900"><span className="font-bold">Demonstration report.</span> Exported records are illustrative only. No configured target values or approved emissions calculations are available.</p></div>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><BarChart3 className="h-4 w-4" /></span><div><p className="text-xs font-bold text-slate-800">Report filters</p><p className="mt-0.5 text-[10px] text-slate-400">Updates all summary views below</p></div></div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Filter reporting period" value={period} onChange={(event) => setPeriod(event.target.value)} className="h-9 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All reporting periods</option>{periods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
          <select aria-label="Filter pillar" value={pillar} onChange={(event) => setPillar(event.target.value)} className="h-9 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All pillars</option>{pillars.map((item) => <option key={item.key} value={item.key}>{item.shortTitle}</option>)}</select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Records in report</p><p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{filteredRecords.length}</p><p className="mt-1 text-[10px] text-slate-400">Illustrative submissions</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Approved</p><p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700">{approvedCount}</p><p className="mt-1 text-[10px] text-slate-400">In the selected view</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Awaiting review</p><p className="mt-1 text-3xl font-bold tracking-tight text-amber-600">{pendingCount}</p><p className="mt-1 text-[10px] text-slate-400">Submitted or in review</p></div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-slate-900">Records by sustainability pillar</h2><p className="mt-1 text-[10px] text-slate-500">Submission counts · demonstration data</p></div><span className="rounded-lg bg-slate-50 p-2 text-slate-400"><BarChart3 className="h-4 w-4" /></span></div>
          <div className="mt-6 space-y-4">
            {byPillar.map((item) => {
              const Icon = item.icon
              return <div key={item.key}>
                <div className="mb-1.5 flex items-center justify-between gap-3"><span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-slate-700"><Icon className="h-4 w-4 shrink-0 text-brand-600" />{item.shortTitle}</span><span className="text-[11px] font-bold text-slate-800">{item.count}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500 transition-[width]" style={{ width: `${(item.count / maxCount) * 100}%` }} /></div>
              </div>
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900">Review status</h2><p className="mt-1 text-[10px] text-slate-500">Record counts in the current filtered report</p>
          <div className="mt-5 space-y-2">
            {statuses.map((item) => {
              const count = filteredRecords.filter((record) => record.status === item).length
              const colors: Record<RecordStatus, string> = { Submitted: 'bg-brand-500', 'In review': 'bg-amber-500', Approved: 'bg-emerald-500', Returned: 'bg-rose-500' }
              return <div key={item} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3"><span className="flex items-center gap-2.5 text-xs font-medium text-slate-700"><span className={`h-2 w-2 rounded-full ${colors[item]}`} />{item}</span><span className="text-xs font-bold text-slate-800">{count}</span></div>
            })}
          </div>
          <Link to="/submissions" className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-600 hover:underline">Open submission register <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center"><div><h2 className="text-sm font-bold text-slate-900">Filtered record export</h2><p className="mt-1 text-[10px] text-slate-500">Export includes record metadata and workflow status.</p></div><button type="button" onClick={exportCsv} className="inline-flex w-fit items-center gap-1.5 text-[10px] font-semibold text-brand-600 hover:underline"><FileSpreadsheet className="h-3.5 w-3.5" /> Download CSV</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-3">Pillar</th><th className="px-4 py-3">Record</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Category</th><th className="px-5 py-3">Status</th></tr></thead><tbody>
          {filteredRecords.slice(0, 10).map((record) => <tr key={record.id} className="border-t border-slate-100"><td className="whitespace-nowrap px-5 py-3 text-[11px] text-slate-500">{pillars.find((item) => item.key === record.pillar)?.shortTitle}</td><td className="max-w-52 truncate px-4 py-3 text-[11px] font-semibold text-slate-700">{record.name}</td><td className="whitespace-nowrap px-4 py-3 text-[11px] text-slate-500">{formatPeriod(record.period)}</td><td className="whitespace-nowrap px-4 py-3 text-[11px] text-slate-500">{record.country}</td><td className="whitespace-nowrap px-4 py-3 text-[11px] text-slate-500">{record.category}</td><td className="whitespace-nowrap px-5 py-3 text-[11px] text-slate-500">{record.status}</td></tr>)}
          {filteredRecords.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-500">No records match the selected report filters.</td></tr>}
        </tbody></table></div>
        {filteredRecords.length > 10 && <p className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">Showing 10 of {filteredRecords.length} records. The CSV includes all matching records.</p>}
      </section>
    </div>
  )
}
