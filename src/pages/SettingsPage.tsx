import { Link } from 'react-router-dom'
import { ArrowRight, CircleHelp, ClipboardList, Database, FileCheck2, LockKeyhole, Settings2 } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import { pillars } from '../data/sustainability'

const factorRows = [
  { type: 'Diesel', scope: 'Scope 1' },
  { type: 'Petrol', scope: 'Scope 1' },
  { type: 'Electricity', scope: 'Scope 2' },
  { type: 'Air travel', scope: 'Scope 3' },
  { type: 'Uber', scope: 'Scope 3' },
  { type: 'Bolt', scope: 'Scope 3' },
]

const targetRows = [
  { name: 'Sustainable Operations', unit: 'Emissions / consumption' },
  { name: 'Sustainable Development Finance', unit: 'Financing / beneficiaries' },
  { name: 'Corporate Social Investment', unit: 'Lives impacted / amount' },
  { name: 'Employee Volunteering', unit: 'Hours / participation' },
  { name: 'Advocacy & Governance', unit: 'Engagements / recognition' },
]

function IntegrationCard({ icon: Icon, title, status, description }: { icon: typeof Database; title: string; status: string; description: string }) {
  return <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-brand-600"><Icon className="h-4 w-4" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold text-slate-800">{title}</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">{status}</span></div><p className="mt-1 text-[10px] leading-4 text-slate-500">{description}</p></div></div>
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, 'Configuration']} />
      <section><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Settings2 className="h-5 w-5" /></span><div><h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">Configuration & data readiness</h1><p className="mt-1 text-sm text-slate-500">Review methodology, targets and integration requirements for production reporting.</p></div></div></section>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3.5"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><p className="text-xs leading-5 text-amber-900"><span className="font-bold">Configuration pending.</span> The approved emission-factor schedule, calculation methodology, target values and operational integration details were not included in the available requirements. Emissions and target comparisons remain disabled until the approved values and units are supplied.</p></div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><FileCheck2 className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900">Approved emissions methodology</h2><p className="mt-1 text-[10px] text-slate-500">Configuration interface for the approved factors required by Sustainable Operations.</p></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-3">Consumption source</th><th className="px-4 py-3">Scope</th><th className="px-4 py-3">Approved factor</th><th className="px-4 py-3">Source unit</th><th className="px-4 py-3">Output unit</th><th className="px-5 py-3">Configuration status</th></tr></thead><tbody>
          {factorRows.map((row) => <tr key={row.type} className="border-t border-slate-100"><td className="px-5 py-3.5 text-xs font-semibold text-slate-700">{row.type}</td><td className="px-4 py-3.5"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{row.scope}</span></td><td className="px-4 py-3.5 text-xs text-slate-400">Not provided</td><td className="px-4 py-3.5 text-xs text-slate-400">Awaiting approval</td><td className="px-4 py-3.5 text-xs text-slate-400">Awaiting approval</td><td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Not configured</span></td></tr>)}
        </tbody></table></div>
        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:flex-row sm:items-center sm:px-6"><p className="max-w-2xl text-[10px] leading-4 text-slate-500">Calculation hooks must use approved activity units, factor sources, conversion rules and methodology versions. No default factor or unit is assumed.</p><button type="button" disabled className="h-8 shrink-0 cursor-not-allowed rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-400">Awaiting approved factor schedule</button></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ClipboardList className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900">Reporting targets</h2><p className="mt-1 text-[10px] text-slate-500">Monthly and year-to-date target values by reporting area.</p></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[630px] text-left"><thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-3">Pillar</th><th className="px-4 py-3">Target measure</th><th className="px-4 py-3">Monthly target</th><th className="px-4 py-3">YTD target</th><th className="px-5 py-3">Status</th></tr></thead><tbody>
          {targetRows.map((row) => <tr key={row.name} className="border-t border-slate-100"><td className="px-5 py-3.5 text-xs font-semibold text-slate-700">{row.name}</td><td className="px-4 py-3.5 text-xs text-slate-500">{row.unit}</td><td className="px-4 py-3.5 text-xs text-slate-400">Not configured</td><td className="px-4 py-3.5 text-xs text-slate-400">Not configured</td><td className="px-5 py-3.5"><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">Awaiting target schedule</span></td></tr>)}
        </tbody></table></div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div><h2 className="text-sm font-bold text-slate-900">Platform integration readiness</h2><p className="mt-1 text-[10px] text-slate-500">Connections needed to move from demonstration to operational deployment.</p></div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <IntegrationCard icon={LockKeyhole} title="Access identity & roles" status="Not connected" description="Connect Access SSO, user provisioning and server-side role authorization." />
          <IntegrationCard icon={Database} title="Central data storage" status="Not connected" description="Connect the approved sustainability data service, record retention and audit history." />
          <IntegrationCard icon={FileCheck2} title="Evidence storage" status="Not connected" description="Enable authenticated uploads with record-level permissions and retention controls." />
          <IntegrationCard icon={ClipboardList} title="Validation & approval rules" status="Requirements pending" description="Confirm duplicate rules, review stages, mandatory field rules and return reasons from the BRS." />
        </div>
      </section>

      <section className="flex flex-col justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:flex-row sm:items-center sm:px-6"><div><p className="text-xs font-bold text-brand-900">Ready to review sustainability records?</p><p className="mt-1 text-[10px] text-brand-700">Open the module register to explore the available fields and demonstration submissions.</p></div><Link to={pillars[0].path} className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-[10px] font-semibold text-brand-700 shadow-sm hover:bg-brand-50">Open data module <ArrowRight className="h-3 w-3" /></Link></section>
    </div>
  )
}
