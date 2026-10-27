import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FilePlus2,
  Leaf,
  SlidersHorizontal,
  Target,
} from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import StatusBadge from '../components/StatusBadge'
import { businessUnits, countries, formatPeriod, pillarByKey, pillars, periods, subsidiaries, type SustainabilityRecord } from '../data/sustainability'
import { useSustainability } from '../context/useSustainability'

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10">
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
      </span>
    </label>
  )
}

function MetricCard({ label, value, note, icon: Icon, tone, suffix }: { label: string; value: string; note: string; icon: typeof FilePlus2; tone: 'blue' | 'green' | 'amber' | 'orange'; suffix?: ReactNode }) {
  const tones = {
    blue: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    orange: 'bg-orange-50 text-orange-600',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-[19px] w-[19px]" strokeWidth={1.8} /></span>
        {suffix}
      </div>
      <p className="mt-4 text-[11px] font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-[27px] font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">{note}</p>
    </div>
  )
}

function ActivityChart({ records }: { records: SustainabilityRecord[] }) {
  const points = periods.slice().reverse().map(({ value, label }) => ({
    key: value,
    label: label.split(' ')[0].slice(0, 3),
    count: records.filter((record) => record.period === value).length,
  }))
  const maxCount = Math.max(3, ...points.map((point) => point.count))
  const coordinates = points.map((point, index) => ({
    ...point,
    x: 52 + (index * 482) / Math.max(points.length - 1, 1),
    y: 174 - (point.count / maxCount) * 126,
  }))
  const path = coordinates.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${path} L ${coordinates.at(-1)?.x ?? 534} 184 L ${coordinates[0]?.x ?? 52} 184 Z`

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-brand-600" /> Records submitted</span>
        <span className="text-slate-400">Record count · demonstration data</span>
      </div>
      <div className="mt-3 w-full overflow-hidden">
        <svg viewBox="0 0 590 222" role="img" aria-label="Demonstration record submissions by month" className="h-[205px] w-full overflow-visible">
          <defs>
            <linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#265696" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#265696" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {[48, 91, 134, 177].map((y) => <line key={y} x1="48" x2="546" y1={y} y2={y} stroke="#eef1f5" strokeDasharray="4 5" />)}
          {areaPath && <path d={areaPath} fill="url(#activity-fill)" />}
          <path d={path} fill="none" stroke="#265696" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
          {coordinates.map((point) => (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r="5" fill="white" stroke="#265696" strokeWidth="2.5" />
              <text x={point.x} y="211" fill="#98a2b3" fontSize="10" textAnchor="middle">{point.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

function ActivityRow({ record }: { record: SustainabilityRecord }) {
  const pillar = pillarByKey[record.pillar]
  const Icon = pillar.icon
  return (
    <tr className="border-t border-slate-100">
      <td className="whitespace-nowrap px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className="block max-w-56 truncate text-xs font-semibold text-slate-800">{record.name}</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">{pillar.shortTitle} · {record.id}</span>
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">{formatPeriod(record.period)}</td>
      <td className="whitespace-nowrap px-4 py-3.5"><StatusBadge status={record.status} /></td>
      <td className="whitespace-nowrap px-5 py-3.5 text-right">
        <Link to={pillar.path} className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800">View <ArrowRight className="h-3 w-3" /></Link>
      </td>
    </tr>
  )
}

export default function SustainabilityDashboardPage() {
  const { records } = useSustainability()
  const [period, setPeriod] = useState('all')
  const [country, setCountry] = useState('all')
  const [subsidiary, setSubsidiary] = useState('all')
  const [businessUnit, setBusinessUnit] = useState('all')
  const [pillar, setPillar] = useState('all')

  const filteredRecords = useMemo(() => records.filter((record) =>
    (period === 'all' || record.period === period)
    && (country === 'all' || record.country === country)
    && (subsidiary === 'all' || record.subsidiary === subsidiary)
    && (businessUnit === 'all' || record.businessUnit === businessUnit)
    && (pillar === 'all' || record.pillar === pillar),
  ), [records, period, country, subsidiary, businessUnit, pillar])
  const approvedCount = filteredRecords.filter((record) => record.status === 'Approved').length
  const reviewCount = filteredRecords.filter((record) => record.status === 'In review' || record.status === 'Submitted').length
  const activePillars = pillars.filter((item) => filteredRecords.some((record) => record.pillar === item.key)).length
  const recentRecords = filteredRecords.slice().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5)
  const operationsCount = filteredRecords.filter((record) => record.pillar === 'operations').length

  return (
    <div className="space-y-6">
      <Breadcrumb items={['Overview']} />

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">Sustainability overview</h1>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">Demo workspace</span>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">A consolidated view of sustainability activity, submissions and data readiness across the Group.</p>
        </div>
        <Link to="/operations" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700">
          <FilePlus2 className="h-4 w-4" /> Add data
        </Link>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5">
        <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p className="text-xs leading-5 text-brand-900"><span className="font-bold">Demonstration data.</span> All records and activity counts shown here are illustrative and do not represent Access Holdings performance. Targets and emissions are not configured.</p>
      </div>

      <section aria-label="Dashboard filters" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <h2 className="text-xs font-bold text-slate-800">Reporting filters</h2>
          <span className="text-[10px] text-slate-400">Apply across the overview</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <FilterSelect label="Reporting period" value={period} onChange={setPeriod} options={[{ value: 'all', label: 'All periods' }, ...periods.map((item) => ({ value: item.value, label: item.label }))]} />
          <FilterSelect label="Country" value={country} onChange={setCountry} options={[{ value: 'all', label: 'All countries' }, ...countries.map((value) => ({ value, label: value }))]} />
          <FilterSelect label="Subsidiary" value={subsidiary} onChange={setSubsidiary} options={[{ value: 'all', label: 'All subsidiaries' }, ...subsidiaries.map((value) => ({ value, label: value }))]} />
          <FilterSelect label="Business unit" value={businessUnit} onChange={setBusinessUnit} options={[{ value: 'all', label: 'All business units' }, ...businessUnits.map((value) => ({ value, label: value }))]} />
          <FilterSelect label="Sustainability pillar" value={pillar} onChange={setPillar} options={[{ value: 'all', label: 'All pillars' }, ...pillars.map((item) => ({ value: item.key, label: item.shortTitle }))]} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Sustainability indicators">
        <MetricCard label="Records in view" value={filteredRecords.length.toLocaleString()} note="Illustrative records matching the filters" icon={FilePlus2} tone="blue" suffix={<span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-500"><ArrowUpRight className="h-3 w-3" /> Demo</span>} />
        <MetricCard label="Approved submissions" value={approvedCount.toLocaleString()} note="Approved in the demonstration dataset" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Awaiting review" value={reviewCount.toLocaleString()} note="Submitted or currently in review" icon={Clock3} tone="amber" suffix={<Link to="/submissions" className="text-[10px] font-semibold text-brand-600 hover:underline">Review queue</Link>} />
        <MetricCard label="Pillars with activity" value={`${activePillars} / ${pillars.length}`} note="Pillars with at least one matching record" icon={BarChart3} tone="orange" />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Submission activity</p>
              <p className="mt-1 text-[11px] text-slate-500">Monthly record volume · demonstration data</p>
            </div>
            <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">{period === 'all' ? 'All reporting periods' : formatPeriod(period)}</span>
          </div>
          <ActivityChart records={filteredRecords} />
          <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400">
            <span>Counts reflect records, not impact totals.</span>
            <Link to="/reports" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">View reports <ArrowRight className="h-3 w-3" /></Link>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Operations & emissions</p>
              <p className="mt-1 text-[11px] text-slate-500">Operational source records and factor readiness</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Leaf className="h-[18px] w-[18px]" /></span>
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Emissions · YTD</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-400">Not available</p>
            <p className="mx-auto mt-2 max-w-[235px] text-[10px] leading-4 text-slate-500">Approved emission factors and reporting units are not configured.</p>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-50/70 px-3.5 py-3">
            <div>
              <p className="text-xs font-semibold text-brand-900">{operationsCount} source records</p>
              <p className="mt-0.5 text-[10px] text-brand-700">In the current filtered view</p>
            </div>
            <Link to="/operations" aria-label="View operations data" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm hover:text-brand-800"><ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-auto pt-5">
            <Link to="/settings" className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 hover:text-brand-600"><Target className="h-3.5 w-3.5" /> Review factors & target configuration <ArrowRight className="ml-auto h-3 w-3" /></Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.9fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent submissions</h2>
              <p className="mt-1 text-[10px] text-slate-500">Latest records across the sustainability pillars</p>
            </div>
            <Link to="/submissions" className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-600 hover:underline">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[610px] text-left">
              <thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-2.5">Record</th><th className="px-4 py-2.5">Period</th><th className="px-4 py-2.5">Status</th><th className="px-5 py-2.5 text-right"> </th></tr></thead>
              <tbody>{recentRecords.map((record) => <ActivityRow key={record.id} record={record} />)}</tbody>
            </table>
            {recentRecords.length === 0 && <div className="px-6 py-10 text-center text-xs text-slate-500">No records match these filters.</div>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-sm font-bold text-slate-900">Pillar activity</h2><p className="mt-1 text-[10px] text-slate-500">Demonstration records by area</p></div>
            <Link to="/reports" aria-label="Open reports" className="rounded-lg bg-slate-50 p-2 text-slate-500 hover:text-brand-600"><ArrowDownRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-4 space-y-1">
            {pillars.map((item) => {
              const count = filteredRecords.filter((record) => record.pillar === item.key).length
              const Icon = item.icon
              const percent = filteredRecords.length ? (count / filteredRecords.length) * 100 : 0
              return (
                <Link key={item.key} to={item.path} className="block rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3"><span className="truncate text-[11px] font-semibold text-slate-700">{item.shortTitle}</span><span className="text-[11px] font-bold text-slate-800">{count}</span></span>
                      <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} /></span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50/70 px-3 py-2.5 text-[10px] leading-4 text-amber-800"><CircleHelp className="mt-0.5 h-3.5 w-3.5 shrink-0" />Configured monthly and year-to-date targets are not available in this workspace.</div>
        </div>
      </section>
    </div>
  )
}
