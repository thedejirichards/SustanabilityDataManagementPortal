import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, Check, Menu, Moon, Sun } from 'lucide-react'
import { canReview, pillars } from '../data/sustainability'
import { useCurrentUser } from '../context/useCurrentUser'
import { useUsers } from '../context/useUsers'
import { useSustainability } from '../context/useSustainability'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Sustainability overview',
  '/submissions': 'Submissions & reviews',
  '/reports': 'Reports & analytics',
  '/settings': 'Configuration',
  '/users': 'User management',
}

interface HeaderProps {
  onMenuClick: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Header({ onMenuClick, darkMode, onToggleDarkMode }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { currentUser, setCurrentUser } = useCurrentUser()
  const { users } = useUsers()
  const { records, notifications, markNotificationRead } = useSustainability()
  const location = useLocation()
  const title = pillars.find((pillar) => pillar.path === location.pathname)?.title ?? pageTitles[location.pathname] ?? 'Sustainability portal'
  const pendingCount = records.filter((record) => record.status === 'Submitted').length
  const myNotifications = notifications.filter((notification) => notification.recipient === currentUser.name)
  const unreadCount = myNotifications.filter((notification) => !notification.read).length

  return (
    <header className="relative z-20 flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:h-[76px] lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open navigation" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 sm:text-[15px]">{title}</p>
          <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">Group sustainability data management</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button type="button" aria-label={`${unreadCount} unread review notifications`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)} className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-brand-600">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {(unreadCount > 0 || (canReview(currentUser.role) && pendingCount > 0)) && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-white">{unreadCount || pendingCount}</span>}
          </button>
          {notificationsOpen && <>
            <button aria-label="Close notifications" className="fixed inset-0 z-10 cursor-default" onClick={() => setNotificationsOpen(false)} />
            <div className="absolute right-0 top-12 z-20 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5"><div><p className="text-sm font-bold text-slate-800">Review notifications</p><p className="mt-0.5 text-xs text-slate-500">Branch decisions and reviewer updates</p></div><span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{unreadCount} new</span></div>
              <div className="max-h-80 overflow-y-auto">
                {myNotifications.length === 0 ? <div className="px-4 py-8 text-center"><p className="text-sm font-semibold text-slate-700">No review decisions yet</p><p className="mt-1 text-xs text-slate-500">Approved and rejected submissions will appear here for the submitting branch.</p></div> : myNotifications.map((notification) => (
                  <Link key={notification.id} to="/submissions" onClick={() => { markNotificationRead(notification.id); setNotificationsOpen(false) }} className={`block border-b border-slate-100 px-4 py-3.5 last:border-0 hover:bg-slate-50 ${notification.read ? '' : 'bg-brand-50/50'}`}>
                    <div className="flex items-center justify-between gap-2"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${notification.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{notification.status}</span><span className="text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</span></div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{notification.recordName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{notification.branch} · Reviewed by {notification.reviewer}</p>
                    {notification.feedback && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{notification.feedback}</p>}
                  </Link>
                ))}
              </div>
              {canReview(currentUser.role) && <Link to="/submissions" onClick={() => setNotificationsOpen(false)} className="block border-t border-slate-100 bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-brand-700 hover:bg-brand-50">Open submission review queue ({pendingCount} awaiting)</Link>}
            </div>
          </>}
        </div>

        <div className="relative border-l border-slate-200 pl-2 sm:pl-4">
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex items-center gap-2 rounded-xl p-1.5 text-left transition-colors hover:bg-slate-50 sm:gap-2.5 sm:px-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white ring-2 ring-brand-50">
              {currentUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
            </span>
            <span className="hidden max-w-36 sm:block">
              <span className="block truncate text-xs font-bold text-slate-800">{currentUser.name}</span>
              <span className="mt-0.5 block truncate text-[10px] text-slate-500">{currentUser.role}</span>
            </span>
            <ChevronDown className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <button aria-label="Close user menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3.5">
                  <p className="text-xs font-bold text-slate-800">Demo user</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">Switch roles to preview portal permissions</p>
                </div>
                <div className="p-1.5">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setCurrentUser(user)
                        setOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
                        {user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-slate-800">{user.name}</span>
                        <span className="mt-0.5 block truncate text-[10px] text-slate-500">{user.role}</span>
                      </span>
                      {user.id === currentUser.id && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => { onToggleDarkMode(); setOpen(false) }} className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-500" />}
                  {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                </button>
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-500">Identity and access will connect to Access SSO.</div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
