import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, CircleHelp, Eye, FilePlus2, Search, X } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import { formatPeriod, type FormField, type PillarDefinition, type RecordStatus, type SustainabilityRecord } from '../data/sustainability'
import { useSustainability } from '../context/useSustainability'
import { useCurrentUser } from '../context/useCurrentUser'

const PAGE_SIZE = 6
const statusOptions: RecordStatus[] = ['Submitted', 'In review', 'Approved', 'Returned']

function parseOption(option: string) {
  const separator = option.indexOf('|')
  return separator === -1 ? { value: option, label: option } : { value: option.slice(0, separator), label: option.slice(separator + 1) }
}

function renderCell(record: SustainabilityRecord, key: string) {
  if (key === 'period') return formatPeriod(record.period)
  if (key === 'country') return record.country
  if (key === 'location') return record.location
  if (key === 'category') return record.category
  if (key === 'status') return <StatusBadge status={record.status} />
  if (key === 'scope') {
    const scope = record.category === 'Diesel' || record.category === 'Petrol' ? 'Scope 1' : record.category === 'Electricity' ? 'Scope 2' : 'Scope 3'
    return <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{scope}</span>
  }
  if (key === 'unitValue') {
    const value = record.values.consumptionValue
    const unit = record.values.unit
    return value ? `${value} ${unit ?? ''}` : '—'
  }
  if (key === 'submittedBy') return record.submittedBy
  if (key === 'impact') return record.values.livesImpacted ?? record.values.beneficiaries ?? record.values.participatingStaff ?? '—'
  return record.name
}

function getColumns(pillar: PillarDefinition) {
  if (pillar.key === 'operations') return [{ key: 'name', label: 'Record' }, { key: 'category', label: 'Type' }, { key: 'scope', label: 'Scope' }, { key: 'unitValue', label: 'Source value' }, { key: 'location', label: 'Location' }, { key: 'period', label: 'Period' }, { key: 'status', label: 'Status' }]
  if (pillar.key === 'finance') return [{ key: 'name', label: 'Customer / activity' }, { key: 'category', label: 'Finance type' }, { key: 'country', label: 'Country' }, { key: 'period', label: 'Period' }, { key: 'status', label: 'Status' }]
  if (pillar.key === 'csi') return [{ key: 'name', label: 'Initiative' }, { key: 'category', label: 'Focus area' }, { key: 'location', label: 'Location' }, { key: 'impact', label: 'Lives impacted' }, { key: 'status', label: 'Status' }]
  if (pillar.key === 'volunteering') return [{ key: 'name', label: 'Initiative' }, { key: 'category', label: 'Focus area' }, { key: 'country', label: 'Country' }, { key: 'impact', label: 'Participants' }, { key: 'status', label: 'Status' }]
  return [{ key: 'name', label: 'Engagement / recognition' }, { key: 'category', label: 'Type' }, { key: 'location', label: 'Location' }, { key: 'period', label: 'Period' }, { key: 'status', label: 'Status' }]
}

function groupRecordCounts(records: SustainabilityRecord[], getLabel: (record: SustainabilityRecord) => string) {
  const counts = new Map<string, number>()
  records.forEach((record) => {
    const label = getLabel(record) || 'Not captured'
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function getBreakdowns(pillar: PillarDefinition, records: SustainabilityRecord[]) {
  if (pillar.key === 'finance') return [
    { title: 'Geographical distribution', values: groupRecordCounts(records, (record) => record.country) },
    { title: 'Finance activity mix', values: groupRecordCounts(records, (record) => record.category) },
  ]
  if (pillar.key === 'csi') return [
    { title: 'Initiatives by focus area', values: groupRecordCounts(records, (record) => record.category) },
    { title: 'Records by implementation location', values: groupRecordCounts(records, (record) => record.values.implementationLocation || record.location) },
    { title: 'Community population segments', values: groupRecordCounts(records, (record) => record.values.populationSegment || 'Not captured') },
  ]
  if (pillar.key === 'volunteering') return [
    { title: 'Initiatives by country', values: groupRecordCounts(records, (record) => record.country) },
    { title: 'Initiatives by division', values: groupRecordCounts(records, (record) => record.businessUnit) },
  ]
  if (pillar.key === 'advocacy') return [
    { title: 'Engagements by type', values: groupRecordCounts(records, (record) => record.category) },
    { title: 'Award classification', values: groupRecordCounts(records, (record) => record.values.awardClass || 'Not captured') },
  ]
  return []
}

function BreakdownCard({ title, values }: { title: string; values: { label: string; count: number }[] }) {
  const maxValue = Math.max(1, ...values.map((item) => item.count))
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="text-xs font-bold text-slate-800">{title}</h2>
      <p className="mt-1 text-[10px] text-slate-400">Record counts · demonstration data</p>
      <div className="mt-4 space-y-3">
        {values.map((item) => <div key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3"><span className="truncate text-[10px] font-medium text-slate-600">{item.label}</span><span className="text-[10px] font-bold text-slate-700">{item.count}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(item.count / maxValue) * 100}%` }} /></div>
        </div>)}
        {values.length === 0 && <p className="py-3 text-[10px] text-slate-400">No records available in this view.</p>}
      </div>
    </div>
  )
}

function RecordForm({ pillar, onClose }: { pillar: PillarDefinition; onClose: () => void }) {
  const { addRecord } = useSustainability()
  const { currentUser } = useCurrentUser()
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  function setValue(field: FormField, value: string) {
    setValues((current) => ({ ...current, [field.name]: value }))
    if (errors[field.name]) setErrors((current) => ({ ...current, [field.name]: '' }))
  }

  function validate() {
    const next: Record<string, string> = {}
    for (const field of pillar.fields) {
      const value = values[field.name]?.trim() ?? ''
      if (field.required && !value) next[field.name] = `${field.label} is required.`
      if (field.type === 'number' && value && Number(value) < (field.min ?? 0)) next[field.name] = `${field.label} must be ${field.min === 0 ? 'zero or greater' : `at least ${field.min}`}.`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    const category = values.category || pillar.categories[0]
    const location = values.location || values.implementationLocation || values.eventLocation || ''
    const period = values.period || ''
    const namedValue = values.name?.trim()
    const record: SustainabilityRecord = {
      id: `SDM-${pillar.key.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      pillar: pillar.key,
      name: namedValue || `${category} · ${location || values.productType || 'New record'}`,
      category,
      period,
      country: values.country || '',
      subsidiary: values.subsidiary || '',
      businessUnit: values.businessUnit || '',
      location,
      status: 'Submitted',
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString().slice(0, 10),
      values: { ...values, category },
    }
    addRecord(record)
    setSaved(true)
  }

  if (saved) {
    return (
      <div className="py-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><FilePlus2 className="h-5 w-5" /></span>
        <h2 className="mt-4 text-lg font-bold text-slate-900">Record submitted</h2>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">The record is now visible in this demonstration session with a <span className="font-semibold text-brand-600">Submitted</span> status. Production saving and review routing require the portal API.</p>
        <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700">Done</button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-5 pr-7">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-700">{pillar.shortTitle}</span>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{pillar.formTitle}</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">{pillar.formDescription}</p>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
          {pillar.fields.map((field) => {
            const value = values[field.name] ?? ''
            const invalid = Boolean(errors[field.name])
            const controlClass = `mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 ${invalid ? 'border-rose-400' : 'border-slate-200'}`
            return (
              <label key={field.name} className={`block min-w-0 ${field.fullWidth || field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                  {field.label}{field.required && <span className="text-rose-500">*</span>}
                </span>
                {field.hint && <span className="mt-0.5 block text-[10px] leading-4 text-slate-400">{field.hint}</span>}
                {field.type === 'select' ? (
                  <select value={value} onChange={(event) => setValue(field, event.target.value)} aria-label={field.label} aria-invalid={invalid} className={controlClass}>
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => {
                      const parsed = parseOption(option)
                      return <option key={parsed.value} value={parsed.value}>{parsed.label}</option>
                    })}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea value={value} onChange={(event) => setValue(field, event.target.value)} aria-label={field.label} aria-invalid={invalid} rows={3} className={`${controlClass} resize-y`} />
                ) : field.type === 'file' ? (
                  <span className={`mt-1.5 flex min-h-10 items-center rounded-xl border border-dashed px-3 py-2.5 ${invalid ? 'border-rose-400' : 'border-slate-300'}`}>
                  <input type="file" aria-label={field.label} onChange={(event) => setValue(field, event.target.files?.[0]?.name ?? '')} className="block w-full text-[10px] text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-2.5 file:py-1.5 file:text-[10px] file:font-semibold file:text-brand-700" />
                  </span>
                ) : (
                  <input type={field.type} min={field.min} step={field.step} value={value} onChange={(event) => setValue(field, event.target.value)} aria-label={field.label} aria-invalid={invalid} className={controlClass} />
                )}
                {invalid && <span role="alert" className="mt-1 block text-[10px] font-medium text-rose-600">{errors[field.name]}</span>}
              </label>
            )
          })}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <p className="text-[10px] text-slate-400">* Required fields · Demo data is held in memory only.</p>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700">Submit record <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </form>
    </>
  )
}

function RecordDetails({ record, pillar }: { record: SustainabilityRecord; pillar: PillarDefinition }) {
  const common = [
    { label: 'Record ID', value: record.id },
    { label: 'Reporting period', value: formatPeriod(record.period) },
    { label: 'Country', value: record.country },
    { label: 'Subsidiary', value: record.subsidiary },
    { label: 'Business unit', value: record.businessUnit },
    { label: 'Location', value: record.location },
    { label: 'Submitted by', value: record.submittedBy },
  ]
  const fields = pillar.fields.filter((field) => !['period', 'country', 'subsidiary', 'businessUnit', 'location'].includes(field.name))
  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 pr-7">
        <div><span className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">{pillar.shortTitle}</span><h2 className="mt-1 text-xl font-bold text-slate-900">{record.name}</h2><p className="mt-1 text-xs text-slate-500">{record.category} · {formatPeriod(record.period)}</p></div>
        <StatusBadge status={record.status} />
      </div>
      <div className="grid grid-cols-1 gap-2.5 py-4 sm:grid-cols-2">
        {common.map(({ label, value }) => <div key={label} className="rounded-xl bg-slate-50 px-3.5 py-2.5"><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-words text-xs font-medium text-slate-700">{value || '—'}</p></div>)}
      </div>
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-xs font-bold text-slate-800">Record information</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
          {fields.filter((field) => record.values[field.name]).map((field) => (
            <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <dt className="text-[10px] text-slate-400">{field.label}</dt>
              <dd className="mt-0.5 break-words text-xs font-medium text-slate-700">{record.values[field.name]}</dd>
            </div>
          ))}
        </dl>
        {record.values.evidence && <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/60 px-3 py-2.5 text-[10px] text-brand-800">Evidence reference: {record.values.evidence}. Demo files are not stored or access-controlled.</div>}
      </div>
      <p className="mt-5 border-t border-slate-100 pt-3 text-[10px] text-slate-400">Submitted {record.submittedAt} · Demonstration record</p>
    </div>
  )
}

export default function PillarPage({ pillar }: { pillar: PillarDefinition }) {
  const { records } = useSustainability()
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('all')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<SustainabilityRecord | null>(null)
  const Icon = pillar.icon
  const columns = getColumns(pillar)

  const pillarRecords = useMemo(() => records.filter((record) => record.pillar === pillar.key), [records, pillar.key])
  const filteredRecords = useMemo(() => pillarRecords.filter((record) => {
    const haystack = [record.id, record.name, record.category, record.country, record.subsidiary, record.location, record.submittedBy].join(' ').toLowerCase()
    return (period === 'all' || record.period === period)
      && (status === 'all' || record.status === status)
      && (category === 'all' || record.category === category)
      && haystack.includes(search.toLowerCase().trim())
  }), [pillarRecords, period, status, category, search])
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const pageRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const approvedCount = pillarRecords.filter((record) => record.status === 'Approved').length
  const pendingCount = pillarRecords.filter((record) => record.status === 'In review' || record.status === 'Submitted').length
  const operationScopeCounts = {
    scope1: pillarRecords.filter((record) => record.category === 'Diesel' || record.category === 'Petrol').length,
    scope2: pillarRecords.filter((record) => record.category === 'Electricity').length,
    scope3: pillarRecords.filter((record) => ['Air travel', 'Uber', 'Bolt'].includes(record.category)).length,
  }
  const breakdowns = getBreakdowns(pillar, pillarRecords)

  function resetPageAndSet<T>(setter: (value: T) => void, value: T) {
    setter(value)
    setPage(1)
  }

  function closeForm() {
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, pillar.shortTitle]} />
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>
          <div>
            <h1 className="text-[25px] font-bold tracking-tight text-slate-900 sm:text-[29px]">{pillar.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{pillar.description}</p>
          </div>
        </div>
        <button type="button" onClick={() => setFormOpen(true)} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"><FilePlus2 className="h-4 w-4" /> Add record</button>
      </section>

      {pillar.key === 'operations' && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3.5">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-xs leading-5 text-amber-900"><span className="font-bold">Emissions are not calculated.</span> Approved emission factors, source units and conversion methodology were not provided. Consumption is stored with its original unit; Scope 1, 2 and 3 emissions, run-rate and target comparisons remain unavailable until configuration is approved.</p>
        </div>
      )}

      {pillar.key !== 'operations' && (
        <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <p className="text-xs leading-5 text-brand-900"><span className="font-bold">Demonstration data.</span> Records below are illustrative only. Monthly and year-to-date targets are not configured in this workspace.</p>
        </div>
      )}

      {pillar.key === 'operations' && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Operational activity by emissions scope">
          {[
            { name: 'Scope 1', sources: 'Diesel · Petrol', count: operationScopeCounts.scope1 },
            { name: 'Scope 2', sources: 'Electricity', count: operationScopeCounts.scope2 },
            { name: 'Scope 3', sources: 'Air travel · Uber · Bolt', count: operationScopeCounts.scope3 },
          ].map((scope) => <div key={scope.name} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wide text-brand-600">{scope.name}</p><p className="mt-1 text-xs font-semibold text-slate-800">{scope.sources}</p></div><span className="rounded-lg bg-brand-50 px-2 py-1 text-[10px] font-bold text-brand-700">{scope.count}</span></div><p className="mt-3 text-[10px] text-slate-400">Source records · emissions pending approved factors</p></div>)}
        </section>
      )}

      {breakdowns.length > 0 && <section className={`grid grid-cols-1 gap-3 ${breakdowns.length === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'}`} aria-label={`${pillar.shortTitle} breakdowns`}>
        {breakdowns.map((breakdown) => <BreakdownCard key={breakdown.title} title={breakdown.title} values={breakdown.values} />)}
      </section>}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total records</p><p className="mt-1 text-2xl font-bold text-slate-900">{pillarRecords.length}</p><p className="mt-1 text-[10px] text-slate-400">Illustrative records</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Approved</p><p className="mt-1 text-2xl font-bold text-emerald-700">{approvedCount}</p><p className="mt-1 text-[10px] text-slate-400">In the demonstration dataset</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Awaiting review</p><p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p><p className="mt-1 text-[10px] text-slate-400">Submitted or in review</p></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div><h2 className="text-sm font-bold text-slate-900">Record management</h2><p className="mt-1 text-[10px] text-slate-500">Search, filter and open a record for more information.</p></div>
            <label className="relative block w-full lg:max-w-[270px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="search" value={search} onChange={(event) => resetPageAndSet(setSearch, event.target.value)} placeholder="Search records" className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10" />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="relative">
              <select value={period} onChange={(event) => resetPageAndSet(setPeriod, event.target.value)} aria-label="Filter by reporting period" className="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All periods</option>{pillarRecords.map((record) => record.period).filter((value, index, list) => list.indexOf(value) === index).sort().reverse().map((value) => <option key={value} value={value}>{formatPeriod(value)}</option>)}</select>
              <span className="pointer-events-none absolute right-2 top-2 text-slate-400">⌄</span>
            </label>
            <label className="relative">
              <select value={category} onChange={(event) => resetPageAndSet(setCategory, event.target.value)} aria-label={`Filter by ${pillar.categoryLabel.toLowerCase()}`} className="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All {pillar.categoryLabel.toLowerCase()}s</option>{pillar.categories.map((value) => <option key={value} value={value}>{value}</option>)}</select>
              <span className="pointer-events-none absolute right-2 top-2 text-slate-400">⌄</span>
            </label>
            <label className="relative">
              <select value={status} onChange={(event) => resetPageAndSet(setStatus, event.target.value)} aria-label="Filter by status" className="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500"><option value="all">All statuses</option>{statusOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select>
              <span className="pointer-events-none absolute right-2 top-2 text-slate-400">⌄</span>
            </label>
            {(period !== 'all' || category !== 'all' || status !== 'all' || search) && <button type="button" onClick={() => { setPeriod('all'); setCategory('all'); setStatus('all'); setSearch(''); setPage(1) }} className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold text-brand-600 hover:bg-brand-50"><X className="h-3 w-3" /> Clear filters</button>}
            <span className="ml-auto self-center text-[10px] text-slate-400">{filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{columns.map((column) => <th key={column.key} className="px-4 py-3 first:pl-5 last:pr-5">{column.label}</th>)}<th className="px-5 py-3 text-right"> </th></tr></thead>
            <tbody>
              {pageRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">
                  {columns.map((column) => <td key={column.key} className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600 first:pl-5">{renderCell(record, column.key)}</td>)}
                  <td className="whitespace-nowrap px-5 py-3.5 text-right"><button type="button" onClick={() => setSelectedRecord(record)} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-600 hover:text-brand-800"><Eye className="h-3.5 w-3.5" /> Details</button></td>
                </tr>
              ))}
              {pageRecords.length === 0 && <tr><td colSpan={columns.length + 1} className="px-5 py-14 text-center"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400"><Search className="h-4 w-4" /></span><p className="mt-3 text-xs font-semibold text-slate-700">No records found</p><p className="mt-1 text-[10px] text-slate-400">Try adjusting the search or filters.</p></td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={closeForm} label={pillar.formTitle}><RecordForm pillar={pillar} onClose={closeForm} /></Modal>
      <Modal open={Boolean(selectedRecord)} onClose={() => setSelectedRecord(null)} label={selectedRecord?.name ?? 'Record details'}>{selectedRecord && <RecordDetails record={selectedRecord} pillar={pillar} />}</Modal>
    </div>
  )
}
