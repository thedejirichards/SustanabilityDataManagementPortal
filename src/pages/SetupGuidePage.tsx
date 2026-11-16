import { useMemo, useState, type FormEvent } from 'react'
import { BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, Plus, ShieldCheck, Trash2, TrendingUp } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import { countries, pillars, type PillarKey } from '../data/sustainability'
import { useCurrentUser } from '../context/useCurrentUser'
import { useSustainability } from '../context/useSustainability'

type ReportStatus = 'Planned' | 'In progress' | 'Submitted' | 'Under internal review' | 'Externally assured'

interface ReportingCalendarEntry {
  id: string
  reportName: string
  period: string
  country: string
  subsidiary: string
  framework: string
  frameworkAlignment: string
  dueDate: string
  submittedAt: string
  status: ReportStatus
}

const calendarStorageKey = 'sdm.reportingCalendar'
const commonFieldNames = new Set(['period', 'country', 'subsidiary', 'businessUnit', 'location'])
const reportStatuses: ReportStatus[] = ['Planned', 'In progress', 'Submitted', 'Under internal review', 'Externally assured']
const frameworks = ['GRI Standards', 'ISSB / IFRS S1 and S2', 'GHG Protocol', 'UN Sustainable Development Goals', 'PCAF', 'Local regulatory', 'Other']

const additionalTrackers = [
  {
    title: 'Sustainability Champions',
    subtitle: 'Workforce coverage and employee activation',
    metrics: ['Entity workforce total', 'Active champions', 'Active champion coverage rate', 'Champion activities delivered', 'Ideas submitted', 'Engagement participants'],
    source: 'Capacity Building form · Tracker type: Sustainability champions',
  },
  {
    title: 'MSME & Financial Inclusion',
    subtitle: 'Access, reach, and quality by subsidiary',
    metrics: ['DFI funding received and utilized', 'MSMEs onboarded and financed', 'Women- and youth-owned MSMEs financed', 'Low-income and rural customers reached', 'First-time borrowers', 'Jobs created or supported', 'Inclusion quality and outcome'],
    source: 'Development Finance form · report country, entity, period, currency, and source evidence',
  },
  {
    title: 'Decarbonisation & Climate',
    subtitle: 'Baselines, actuals, and transition activities',
    metrics: ['Emissions baseline and actual by unit / scope', 'Energy use and renewable energy', 'Solar generation and installed capacity', 'Mobility and travel activity', 'Waste generated, recycled, and diverted', 'Offsets retired', 'Green-building certified floor area and certification'],
    source: 'Sustainable Operations form · emissions are entered as validated reported values; the portal does not infer them',
  },
]

function loadCalendar(): ReportingCalendarEntry[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(calendarStorageKey) ?? '[]')
    return Array.isArray(parsed) ? parsed as ReportingCalendarEntry[] : []
  } catch {
    return []
  }
}

function toNumber(value: string | undefined) {
  if (!value) return 0
  const parsed = Number.parseFloat(value.replaceAll(',', ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function sumByUnit(records: { values: Record<string, string> }[], valueKey: string, unitKey: string) {
  const totals = new Map<string, number>()
  records.forEach((record) => {
    const value = toNumber(record.values[valueKey])
    const unit = record.values[unitKey]?.trim()
    if (value && unit) totals.set(unit, (totals.get(unit) ?? 0) + value)
  })
  return [...totals.entries()].map(([unit, total]) => `${total.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit}`).join(' · ') || 'No approved values yet'
}

function averageByUnit(records: { values: Record<string, string> }[], metricKey: string, unitKey: string) {
  const grouped = new Map<string, number[]>()
  records.forEach((record) => {
    const value = toNumber(record.values[metricKey])
    if (value <= 0) return
    const unit = record.values[unitKey]?.trim() || '%'
    grouped.set(unit, [...(grouped.get(unit) ?? []), value])
  })
  if (grouped.size === 0) return 'No approved values yet'
  return [...grouped.entries()].map(([unit, values]) => {
    const average = values.reduce((sum, value) => sum + value, 0) / values.length
    return `${average.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit} · ${values.length} ${values.length === 1 ? 'record' : 'records'}`
  }).join(' · ')
}

export default function SetupGuidePage() {
  const { currentUser } = useCurrentUser()
  const { records } = useSustainability()
  const [calendar, setCalendar] = useState<ReportingCalendarEntry[]>(loadCalendar)
  const [reportName, setReportName] = useState('')
  const [period, setPeriod] = useState('FY2026')
  const [country, setCountry] = useState(currentUser.country ?? '')
  const [subsidiary, setSubsidiary] = useState(currentUser.subsidiary ?? '')
  const [framework, setFramework] = useState(frameworks[0])
  const [frameworkAlignment, setFrameworkAlignment] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<ReportStatus>('Planned')

  const approvedRecords = useMemo(() => records.filter((record) => record.status === 'Approved'), [records])
  const approvedPillarRecords = (pillar: PillarKey) => approvedRecords.filter((record) => record.pillar === pillar)
  const operationsTotals = sumByUnit(approvedPillarRecords('operations'), 'consumptionValue', 'unit')
  const financeRecords = approvedPillarRecords('finance')
  const disbursementTotals = sumByUnit(financeRecords, 'amountDisbursed', 'currency')
  const financedTotals = sumByUnit(financeRecords, 'amountFinanced', 'currency')
  const financedEmissionsTotals = sumByUnit(financeRecords, 'financedEmissions', 'financedEmissionsUnit')
  const csiBeneficiaries = approvedPillarRecords('csi').reduce((total, record) => total + toNumber(record.values.livesImpacted), 0)
  const capacityParticipants = approvedPillarRecords('volunteering').reduce((total, record) => total + toNumber(record.values.participantsTotal ?? record.values.participatingStaff), 0)
  const ratesAndIntensities = [
    { label: 'Operations · people / DEI rate', value: averageByUnit(approvedPillarRecords('operations'), 'peopleMetricRate', 'rateUnit') },
    { label: 'Capacity building · completion rate', value: averageByUnit(approvedPillarRecords('volunteering'), 'completionRate', '') },
    { label: 'Sustainability champions · coverage', value: averageByUnit(approvedPillarRecords('volunteering'), 'championCoverageRate', '') },
  ]

  function persistCalendar(next: ReportingCalendarEntry[]) {
    setCalendar(next)
    try {
      window.localStorage.setItem(calendarStorageKey, JSON.stringify(next))
    } catch {
      // Calendar tracking remains usable for the current view if storage is unavailable.
    }
  }

  function addReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const entry: ReportingCalendarEntry = {
      id: `report-${Date.now()}`,
      reportName: reportName.trim(),
      period: period.trim(),
      country,
      subsidiary: subsidiary.trim(),
      framework,
      frameworkAlignment: frameworkAlignment.trim(),
      dueDate,
      submittedAt: '',
      status,
    }
    persistCalendar([entry, ...calendar])
    setReportName('')
    setFrameworkAlignment('')
    setDueDate('')
    setStatus('Planned')
  }

  function updateCalendarEntry(id: string, updates: Partial<ReportingCalendarEntry>) {
    persistCalendar(calendar.map((entry) => entry.id === id ? { ...entry, ...updates } : entry))
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, 'Setup & guide']} />
      <section className="flex items-start gap-3.5">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><BookOpen className="h-5 w-5" /></span>
        <div><h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">Sustainability reporting setup & guide</h1><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">Use this guide to prepare subsidiary reporting, understand the KPI capture sheets, maintain reporting deadlines, and follow evidence through verification.</p></div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p className="text-sm leading-6 text-brand-900"><span className="font-bold">Aggregation guide.</span> Group volumes sum by metric and unit. Rates and intensities average by the same measure and unit. Keep reporting boundaries, period, subsidiary, unit and evidence with each submission. Board summaries below are read-only and use approved records only.</p>
      </div>

      <section className="space-y-3" aria-label="Five sustainability reporting pillars">
        <div><h2 className="text-lg font-bold text-slate-900">Five reporting pillars</h2><p className="mt-1 text-xs text-slate-500">Open each pillar for its current capture fields and completion guidance.</p></div>
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          const metricFields = pillar.fields.filter((field) => !commonFieldNames.has(field.name))
          return <details key={pillar.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden sm:px-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-800">{pillar.title}<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{metricFields.length} fields</span></span><span className="mt-1 block text-xs leading-5 text-slate-500">{pillar.description}</span><span className="mt-1 block text-xs text-slate-500">Categories: {pillar.categories.join(' · ')}</span></span>
            </summary>
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-5">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {metricFields.map((field) => <li key={field.name} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5"><span className="text-xs font-semibold text-slate-800">{field.label}{field.required && <span className="ml-1 text-rose-600">*</span>}</span>{field.hint && <span className="mt-1 block text-xs leading-5 text-slate-500">{field.hint}</span>}</li>)}
              </ul>
              <p className="mt-3 text-xs leading-5 text-slate-500">{pillar.formDescription}</p>
            </div>
          </details>
        })}
      </section>

      <section className="space-y-3">
        <div><h2 className="text-lg font-bold text-slate-900">Additional sustainability trackers</h2><p className="mt-1 text-xs text-slate-500">These reporting views use the detailed fields in the five pillar forms.</p></div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          {additionalTrackers.map((tracker) => <article key={tracker.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><h3 className="text-sm font-bold text-slate-800">{tracker.title}</h3><p className="mt-1 text-xs text-slate-500">{tracker.subtitle}</p><ul className="mt-3 space-y-2">{tracker.metrics.map((metric) => <li key={metric} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />{metric}</li>)}</ul><p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">{tracker.source}</p></article>)}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><CalendarDays className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900">Sustainability reports calendar</h2><p className="mt-1 text-xs text-slate-500">Maintain report due dates, framework alignment, submission dates and reporting status by subsidiary.</p></div></div>
        <form onSubmit={addReport} className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold text-slate-700">Report name *<input required value={reportName} onChange={(event) => setReportName(event.target.value)} placeholder="Annual sustainability report" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-xs font-semibold text-slate-700">Reporting period *<input required value={period} onChange={(event) => setPeriod(event.target.value)} placeholder="FY2026" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-xs font-semibold text-slate-700">Country *<select required value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500"><option value="">Select country</option>{countries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-700">Subsidiary / entity *<input required value={subsidiary} onChange={(event) => setSubsidiary(event.target.value)} placeholder="Subsidiary name" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-xs font-semibold text-slate-700">Framework *<select required value={framework} onChange={(event) => setFramework(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500">{frameworks.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-700">Framework alignment *<input required value={frameworkAlignment} onChange={(event) => setFrameworkAlignment(event.target.value)} placeholder="Sections, standards, or disclosure topics" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-xs font-semibold text-slate-700">Due date *<input required type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-xs font-semibold text-slate-700">Initial status<select value={status} onChange={(event) => setStatus(event.target.value as ReportStatus)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-brand-500">{reportStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <div className="xl:col-span-4"><button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white hover:bg-brand-700"><Plus className="h-4 w-4" /> Add to reporting calendar</button></div>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left"><thead><tr className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500"><th className="px-5 py-3">Report / framework</th><th className="px-4 py-3">Entity / period</th><th className="px-4 py-3">Due date</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Reporting status</th><th className="px-5 py-3"></th></tr></thead><tbody>
            {calendar.map((entry) => <tr key={entry.id} className="border-t border-slate-100"><td className="px-5 py-3.5"><p className="text-sm font-semibold text-slate-800">{entry.reportName}</p><p className="mt-1 text-xs text-slate-500">{entry.framework} · {entry.frameworkAlignment}</p></td><td className="px-4 py-3.5 text-xs text-slate-600">{entry.subsidiary} · {entry.country}<br />{entry.period}</td><td className="px-4 py-3.5 text-xs text-slate-600">{entry.dueDate}</td><td className="px-4 py-3.5"><input type="date" aria-label={`Submission date for ${entry.reportName}`} value={entry.submittedAt} onChange={(event) => updateCalendarEntry(entry.id, { submittedAt: event.target.value })} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs" /></td><td className="px-4 py-3.5"><select aria-label={`Status for ${entry.reportName}`} value={entry.status} onChange={(event) => updateCalendarEntry(entry.id, { status: event.target.value as ReportStatus })} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs">{reportStatuses.map((item) => <option key={item}>{item}</option>)}</select></td><td className="px-5 py-3.5 text-right"><button type="button" onClick={() => persistCalendar(calendar.filter((item) => item.id !== entry.id))} aria-label={`Remove ${entry.reportName}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></td></tr>)}
            {calendar.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">No reports scheduled yet. Add a reporting obligation above.</td></tr>}
          </tbody></table>
        </div>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Calendar entries are stored in this browser only. No reporting deadlines have been preconfigured.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><TrendingUp className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900">Consolidation summary</h2><p className="mt-1 text-xs text-slate-500">Board-facing read-only rollup of approved submissions. Do not overwrite computed summary values.</p></div></div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ['Operations · activity volumes', operationsTotals],
            ['Development Finance · amounts disbursed', disbursementTotals],
            ['Sustainable lending · amount financed', financedTotals],
            ['PCAF · financed emissions', financedEmissionsTotals],
            ['CSI · actual beneficiaries', `${csiBeneficiaries.toLocaleString()} people`],
            ['Capacity Building · participants', `${capacityParticipants.toLocaleString()} participants`],
            ['Thought Leadership & Awards · records', `${approvedPillarRecords('advocacy').length} approved engagements / recognitions`],
          ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><p className="text-xs font-semibold text-slate-600">{label}</p><p className="mt-2 text-lg font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">From approved records only</p></div>)}
        </div>
        <div className="border-t border-slate-100 px-4 py-4 sm:px-5"><h3 className="text-xs font-bold text-slate-800">Rates and intensities · arithmetic average by measure</h3><div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">{ratesAndIntensities.map((metric) => <div key={metric.label} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5"><p className="text-xs text-slate-500">{metric.label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{metric.value}</p></div>)}</div></div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ShieldCheck className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900">Verification before sign-off</h2><p className="mt-1 text-xs leading-5 text-slate-500">Reviewers progress each record’s evidence through the stages below. The record approval action remains unavailable until external assurance is recorded.</p></div></div>
        <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ['1 · Unverified', 'Submission received with supporting evidence attached. No validation has been recorded yet.'],
            ['2 · Internal Review', 'Sustainability reviewer checks completeness, reporting period, units, source files and reported values.'],
            ['3 · Externally Assured', 'Record the assurance reference after independent assurance. Required before reviewer sign-off.'],
          ].map(([title, description]) => <li key={title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><p className="text-xs font-bold text-slate-800">{title}</p><p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p></li>)}
        </ol>
      </section>

      <p className="flex items-center gap-2 text-xs text-slate-500"><ClipboardCheck className="h-4 w-4 text-brand-600" />Setup & calendar configuration is local to this demonstration workspace; production SSO, shared storage, assurance evidence retention and report scheduling services must be connected for Group-wide use.</p>
    </div>
  )
}
