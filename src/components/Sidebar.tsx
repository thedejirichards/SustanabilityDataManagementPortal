import { Link, NavLink } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  Megaphone,
  Settings2,
  UsersRound,
  X,
} from 'lucide-react'
import accessLogo from '../assets/brand/access-logo.svg'

const navigationGroups = [
  {
    label: 'Workspace',
    items: [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    label: 'Data capture',
    items: [
      { to: '/operations', label: 'Sustainable operations', icon: Leaf },
      { to: '/development-finance', label: 'Development finance', icon: BriefcaseBusiness },
      { to: '/corporate-social-investment', label: 'Corporate social investment', icon: HeartHandshake },
      { to: '/employee-volunteering', label: 'Employee volunteering', icon: UsersRound },
      { to: '/advocacy-governance', label: 'Advocacy & governance', icon: Megaphone },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/submissions', label: 'Submissions & reviews', icon: ClipboardList },
      { to: '/reports', label: 'Reports & analytics', icon: BarChart3 },
      { to: '/settings', label: 'Configuration', icon: Settings2 },
    ],
  },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={onClose} />}
      <aside className={`${mobileOpen ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen`}>
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
          <Link to="/dashboard" aria-label="Access Holdings Sustainability home" className="flex items-center">
            <img src={accessLogo} alt="Access Holdings" className="h-[23px] w-auto" />
          </Link>
          <button type="button" aria-label="Close navigation" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Access Holdings</p>
          <p className="mt-1 text-[17px] font-bold tracking-tight text-brand-900">Sustainability portal</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
            <Activity className="h-3 w-3" />
            Demo workspace
          </span>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-5">
          {navigationGroups.map((group) => (
            <div key={group.label} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    onClick={onClose}
                    className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors ${isActive ? 'bg-brand-50 font-semibold text-brand-700' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}
                  >
                    <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />
                    <span className="min-w-0 truncate">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 px-3.5 py-3">
            <p className="text-xs font-semibold text-slate-700">Need help?</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">Contact your sustainability data administrator.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
