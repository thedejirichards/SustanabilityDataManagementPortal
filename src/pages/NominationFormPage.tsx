import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowDownToLine, BadgeCheck, ClipboardCheck, Info } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import { countries } from '../data/sustainability'
import type { AppUser } from '../data/users'
import { useCurrentUser } from '../context/useCurrentUser'

const fileName = 'Access Bank Kenya_Sustainability_Dashboard_Nomination_2026.xlsx'
const purpose = 'Please nominate one suitably positioned employee to serve as the primary Sustainability Dashboard Focal Person for your subsidiary. The nominee will coordinate the timely collation, validation and submission of sustainability data; liaise with relevant functions; maintain supporting evidence; and work with the Group Sustainability Team to resolve data-quality queries. The nominee should have sufficient cross-functional access and the capacity to coordinate reporting requirements. Complete all required fields and secure the nominee’s acknowledgement before submission.'
const acknowledgementText = 'I acknowledge the nomination and understand that, if appointed, I will coordinate the subsidiary’s Sustainability Dashboard submissions, engage relevant data owners, retain supporting evidence, respond to validation queries and participate in required training and reporting engagements.'
const approvalText = 'I confirm that the nominee is authorised to coordinate the subsidiary’s sustainability data collection and reporting, and will be supported with access to the relevant functions, records and responsible data owners.'

interface NominationValues {
  subsidiary: string
  country: string
  headName: string
  headEmail: string
  nominationDate: string
  nomineeName: string
  jobTitle: string
  department: string
  nomineeEmail: string
  telephone: string
  lineManager: string
  alternativeContact: string
  acknowledgementName: string
  acknowledged: boolean
  acknowledgementDate: string
  approverName: string
  approved: boolean
  approvalDate: string
}

function initialValues(user: { id: string; name: string; email: string; country?: string; subsidiary?: string }): NominationValues {
  const isKenyaExample = user.id === 'country-md-kenya'
  const sampleDate = isKenyaExample ? '2026-10-05' : new Date().toISOString().slice(0, 10)
  return {
    subsidiary: user.subsidiary ?? '',
    country: user.country ?? '',
    headName: user.name,
    headEmail: user.email,
    nominationDate: sampleDate,
    nomineeName: isKenyaExample ? 'Rachael Mboya' : '',
    jobTitle: isKenyaExample ? 'Team Member' : '',
    department: isKenyaExample ? 'Corporate Communications' : '',
    nomineeEmail: isKenyaExample ? 'mboyar@accessbankplc.com' : '',
    telephone: '',
    lineManager: isKenyaExample ? 'Allan Ratemo' : '',
    alternativeContact: isKenyaExample ? 'ratemoa@accessbankplc.com' : '',
    acknowledgementName: isKenyaExample ? 'Rachael Mboya' : '',
    acknowledged: false,
    acknowledgementDate: sampleDate,
    approverName: isKenyaExample ? 'Allan Ratemo' : user.name,
    approved: false,
    approvalDate: sampleDate,
  }
}

function formatWorkbookDate(value: string) {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function downloadWorkbook(values: NominationValues) {
  const XLSX = await import('xlsx-js-style')
  const rows: (string | number)[][] = []
  const mergeRows: number[] = []
  const sectionRows: number[] = []
  const statementRows: number[] = []
  const labelCells: string[] = []
  const inputCells: string[] = []

  function addMergedRow(text: string, kind: 'section' | 'statement' | 'regular' = 'regular') {
    const index = rows.length
    rows.push([text, '', '', ''])
    mergeRows.push(index)
    if (kind === 'section') sectionRows.push(index)
    if (kind === 'statement') statementRows.push(index)
    return index
  }

  function addFieldsRow(labelOne: string, valueOne: string, labelTwo = '', valueTwo = '') {
    const index = rows.length
    rows.push([labelOne, valueOne, labelTwo, valueTwo])
    labelCells.push(`A${index + 1}`, `C${index + 1}`)
    inputCells.push(`B${index + 1}`, `D${index + 1}`)
  }

  addMergedRow('ACCESS HOLDINGS — SUSTAINABILITY DASHBOARD FOCAL PERSON NOMINATION FORM')
  addMergedRow('For completion by the Country Managing Director / Head of Subsidiary')
  rows.push(['', '', '', ''])
  addMergedRow('PURPOSE AND COMPLETION GUIDANCE', 'section')
  addMergedRow(purpose, 'statement')
  rows.push(['', '', '', ''])

  addMergedRow('A. SUBSIDIARY DETAILS', 'section')
  addFieldsRow('Subsidiary / Entity *', values.subsidiary, 'Country *', values.country)
  addFieldsRow('Country Managing Director / Head *', values.headName, 'Official Email Address *', values.headEmail)
  addFieldsRow('Date of Nomination *', formatWorkbookDate(values.nominationDate))
  rows.push(['', '', '', ''])

  addMergedRow('B. NOMINEE DETAILS', 'section')
  addFieldsRow('Nominee Full Name *', values.nomineeName, 'Job Title / Grade *', values.jobTitle)
  addFieldsRow('Department / Function *', values.department, 'Official Email Address *', values.nomineeEmail)
  addFieldsRow('Telephone / Teams Contact', values.telephone, 'Line Manager *', values.lineManager)
  addFieldsRow('Alternative Contact / Backup', values.alternativeContact)
  rows.push(['', '', '', ''])

  addMergedRow('C. NOMINEE ACKNOWLEDGEMENT', 'section')
  addMergedRow(acknowledgementText, 'statement')
  addFieldsRow('Nominee Name *', values.acknowledgementName, 'Acknowledgement *', values.acknowledged ? 'Acknowledged' : 'Not yet acknowledged')
  addFieldsRow('Date *', formatWorkbookDate(values.acknowledgementDate))
  rows.push(['', '', '', ''])

  addMergedRow('D. COUNTRY MANAGING DIRECTOR / HEAD APPROVAL', 'section')
  addMergedRow(approvalText, 'statement')
  addFieldsRow('Approver Name *', values.approverName, 'Approval *', values.approved ? 'Approved' : 'Not yet approved')
  addFieldsRow('Date *', formatWorkbookDate(values.approvalDate))
  rows.push(['', '', '', ''])
  addMergedRow('Required fields are marked *. Both nominee acknowledgement and country-head approval must be confirmed before submission.')

  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  worksheet['!merges'] = mergeRows.map((row) => XLSX.utils.decode_range(`A${row + 1}:D${row + 1}`))
  worksheet['!cols'] = [{ wch: 32 }, { wch: 38 }, { wch: 32 }, { wch: 38 }]
  worksheet['!rows'] = rows.map((_, index) => ({ hpt: index === 0 ? 32 : statementRows.includes(index) ? 54 : sectionRows.includes(index) ? 24 : 22 }))

  const border = {
    top: { style: 'thin', color: { rgb: 'D6DEE8' } },
    bottom: { style: 'thin', color: { rgb: 'D6DEE8' } },
    left: { style: 'thin', color: { rgb: 'D6DEE8' } },
    right: { style: 'thin', color: { rgb: 'D6DEE8' } },
  }
  function styleCells(addresses: string[], style: Record<string, unknown>) {
    addresses.forEach((address) => {
      const cell = worksheet[address] ?? { t: 's', v: '' }
      cell.s = { border, alignment: { vertical: 'center', wrapText: true }, ...style }
      worksheet[address] = cell
    })
  }

  styleCells(['A1', 'B1', 'C1', 'D1'], { fill: { fgColor: { rgb: '00224F' }, patternType: 'solid' }, font: { name: 'Arial', sz: 16, bold: true, color: { rgb: 'FFFFFF' } }, alignment: { vertical: 'center', horizontal: 'left', wrapText: true } })
  styleCells(['A2', 'B2', 'C2', 'D2'], { fill: { fgColor: { rgb: 'F2F5FA' }, patternType: 'solid' }, font: { name: 'Arial', sz: 11, italic: true, color: { rgb: '344054' } } })
  sectionRows.forEach((row) => styleCells(['A', 'B', 'C', 'D'].map((column) => `${column}${row + 1}`), { fill: { fgColor: { rgb: '00529B' }, patternType: 'solid' }, font: { name: 'Arial', sz: 11, bold: true, color: { rgb: 'FFFFFF' } } }))
  statementRows.forEach((row) => styleCells(['A', 'B', 'C', 'D'].map((column) => `${column}${row + 1}`), { fill: { fgColor: { rgb: 'F8FAFC' }, patternType: 'solid' }, font: { name: 'Arial', sz: 10, color: { rgb: '344054' } }, alignment: { vertical: 'center', wrapText: true } }))
  styleCells(labelCells, { fill: { fgColor: { rgb: 'F2F5FA' }, patternType: 'solid' }, font: { name: 'Arial', sz: 10, bold: true, color: { rgb: '243B53' } } })
  styleCells(inputCells, { fill: { fgColor: { rgb: 'F8FAFC' }, patternType: 'solid' }, font: { name: 'Arial', sz: 10, color: { rgb: '1F2937' } } })

  const workbook = XLSX.utils.book_new()
  workbook.Props = {
    Title: 'Access Holdings Sustainability Dashboard Focal Person Nomination',
    Subject: 'Country subsidiary focal-person nomination form',
    Author: 'Access Holdings Sustainability Team',
    Company: 'Access Holdings',
  }
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Nomination Form')
  XLSX.writeFileXLSX(workbook, fileName)
}

function NominationField({ label, value, onChange, type = 'text', required = false, placeholder }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block min-w-0">
      <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">{label}{required && <span className="text-rose-600">*</span>}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10" />
    </label>
  )
}

function NominationSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <h2 className="border-b border-slate-100 bg-brand-900 px-5 py-3.5 text-sm font-bold text-white sm:px-6">{title}</h2>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-6">{children}</div>
    </section>
  )
}

function NominationFormContent({ currentUser }: { currentUser: AppUser }) {
  const [values, setValues] = useState<NominationValues>(() => initialValues(currentUser))
  const [downloaded, setDownloaded] = useState(false)

  function setValue<K extends keyof NominationValues>(key: K, value: NominationValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setDownloaded(false)
  }

  async function handleDownload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await downloadWorkbook(values)
    setDownloaded(true)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Breadcrumb items={[{ label: 'Focal person nomination' }]} />
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"><BadgeCheck className="h-4 w-4" /> Country leadership workspace</span>
          <h1 className="mt-3 text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Sustainability Dashboard Focal Person Nomination</h1>
          <p className="mt-1.5 text-sm text-slate-500">Complete the subsidiary nomination and download the signed-off Excel form.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600"><ClipboardCheck className="h-4 w-4 text-brand-600" /> {currentUser.name}</span>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <div><h2 className="text-sm font-bold text-brand-900">Purpose and completion guidance</h2><p className="mt-1 text-sm leading-6 text-brand-900">{purpose}</p><p className="mt-2 text-xs font-semibold text-brand-800">Fields marked * are required. Secure the nominee’s acknowledgement and complete the country-head approval before downloading.</p></div>
      </div>

      <form onSubmit={handleDownload} className="space-y-5">
        <NominationSection title="A. Subsidiary details">
          <label className="block min-w-0">
            <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">Subsidiary / Entity<span className="text-rose-600">*</span></span>
            <input value={values.subsidiary} onChange={(event) => setValue('subsidiary', event.target.value)} required className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10" />
          </label>
          <label className="block min-w-0">
            <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">Country<span className="text-rose-600">*</span></span>
            <select value={values.country} onChange={(event) => setValue('country', event.target.value)} required className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"><option value="">Select country</option>{countries.map((country) => <option key={country} value={country}>{country}</option>)}</select>
          </label>
          <NominationField label="Country Managing Director / Head" value={values.headName} onChange={(value) => setValue('headName', value)} required />
          <NominationField label="Official Email Address" value={values.headEmail} onChange={(value) => setValue('headEmail', value)} type="email" required />
          <NominationField label="Date of Nomination" value={values.nominationDate} onChange={(value) => setValue('nominationDate', value)} type="date" required />
        </NominationSection>

        <NominationSection title="B. Nominee details">
          <NominationField label="Nominee Full Name" value={values.nomineeName} onChange={(value) => setValue('nomineeName', value)} required />
          <NominationField label="Job Title / Grade" value={values.jobTitle} onChange={(value) => setValue('jobTitle', value)} required />
          <NominationField label="Department / Function" value={values.department} onChange={(value) => setValue('department', value)} required />
          <NominationField label="Official Email Address" value={values.nomineeEmail} onChange={(value) => setValue('nomineeEmail', value)} type="email" required />
          <NominationField label="Telephone / Teams Contact" value={values.telephone} onChange={(value) => setValue('telephone', value)} />
          <NominationField label="Line Manager" value={values.lineManager} onChange={(value) => setValue('lineManager', value)} required />
          <NominationField label="Alternative Contact / Backup" value={values.alternativeContact} onChange={(value) => setValue('alternativeContact', value)} />
        </NominationSection>

        <NominationSection title="C. Nominee acknowledgement">
          <p className="sm:col-span-2 text-sm leading-6 text-slate-600">{acknowledgementText}</p>
          <NominationField label="Nominee Name" value={values.acknowledgementName} onChange={(value) => setValue('acknowledgementName', value)} required />
          <NominationField label="Date" value={values.acknowledgementDate} onChange={(value) => setValue('acknowledgementDate', value)} type="date" required />
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
            <input type="checkbox" checked={values.acknowledged} onChange={(event) => setValue('acknowledged', event.target.checked)} required className="mt-0.5 h-4 w-4 accent-brand-600" />
            <span><span className="block text-sm font-semibold text-slate-800">Nominee acknowledgement <span className="text-rose-600">*</span></span><span className="mt-1 block text-xs leading-5 text-slate-600">Confirm that the nominee has read and agreed to the responsibilities above.</span></span>
          </label>
        </NominationSection>

        <NominationSection title="D. Country Managing Director / Head approval">
          <p className="sm:col-span-2 text-sm leading-6 text-slate-600">{approvalText}</p>
          <NominationField label="Approver Name" value={values.approverName} onChange={(value) => setValue('approverName', value)} required />
          <NominationField label="Date" value={values.approvalDate} onChange={(value) => setValue('approvalDate', value)} type="date" required />
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
            <input type="checkbox" checked={values.approved} onChange={(event) => setValue('approved', event.target.checked)} required className="mt-0.5 h-4 w-4 accent-brand-600" />
            <span><span className="block text-sm font-semibold text-slate-800">Country-head approval <span className="text-rose-600">*</span></span><span className="mt-1 block text-xs leading-5 text-slate-600">Confirm that the nominee is authorised and will be supported with access to relevant teams and records.</span></span>
          </label>
        </NominationSection>

        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:px-5">
          <p className="text-xs leading-5 text-slate-500">The workbook will be saved as <span className="font-semibold text-slate-700">{fileName}</span>.</p>
          <button type="submit" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"><ArrowDownToLine className="h-4 w-4" /> Download completed XLSX</button>
        </div>
        {downloaded && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">Nomination downloaded as {fileName}.</p>}
      </form>
    </div>
  )
}

export default function NominationFormPage() {
  const { currentUser } = useCurrentUser()
  return <NominationFormContent key={currentUser.id} currentUser={currentUser} />
}
