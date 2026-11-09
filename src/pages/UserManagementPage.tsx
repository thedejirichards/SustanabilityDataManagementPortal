import { useMemo, useState, type FormEvent } from 'react'
import { Ban, Check, CheckCircle2, Clock3, Eye, Mail, Pencil, Plus, RotateCcw, Search, ShieldCheck, ShieldX, UserCog } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { appRoles, canManageUsers, userStatuses, type AppRole, type AppUser, type UserStatus } from '../data/users'
import { useCurrentUser } from '../context/useCurrentUser'
import { useUsers } from '../context/useUsers'

const PAGE_SIZE = 5

const roleBadgeClasses: Record<AppRole, string> = {
  'Data Contributor': 'bg-slate-100 text-slate-600',
  'Sustainability Reviewer': 'bg-amber-50 text-amber-700',
  'Portal Administrator': 'bg-brand-50 text-brand-700',
}

const statusClasses: Record<UserStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Invited: 'bg-amber-50 text-amber-700',
  Suspended: 'bg-rose-50 text-rose-700',
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function RoleBadge({ role }: { role: AppRole }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${roleBadgeClasses[role]}`}>{role}</span>
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const dot = status === 'Active' ? 'bg-emerald-500' : status === 'Invited' ? 'bg-amber-500' : 'bg-rose-500'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}</span>
}

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  editing: AppUser | null
  submitForApproval?: boolean
  onSubmit: (values: { name: string; email: string; role: AppRole; status: UserStatus; department: string }) => void
}

function UserFormModal({ open, onClose, editing, submitForApproval = false, onSubmit }: UserFormModalProps) {
  const [name, setName] = useState(editing?.name ?? '')
  const [email, setEmail] = useState(editing?.email ?? '')
  const [role, setRole] = useState<AppRole>(editing?.role ?? 'Data Contributor')
  const [status, setStatus] = useState<UserStatus>(editing?.status ?? 'Invited')
  const [department, setDepartment] = useState(editing?.department ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  function validate() {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Full name is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!department.trim()) next.department = 'Department is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), role, status, department: department.trim() })
    setSaved(true)
  }

  function close() {
    onClose()
  }

  return (
    <Modal open={open} onClose={close} label={editing ? 'Edit user' : submitForApproval ? 'Request new user' : 'Add user'}>
      {saved ? (
        <div className="py-7 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">{submitForApproval ? <Clock3 className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}</span>
          <h2 className="mt-4 text-lg font-bold text-slate-900">{editing ? 'User updated' : submitForApproval ? 'Request submitted for approval' : 'User invited'}</h2>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">{editing ? 'The change is applied to this demonstration session.' : submitForApproval ? 'The user addition request is pending checker approval in this demonstration session.' : 'The change is applied to this demonstration session. Production provisioning, SSO synchronization and email invite delivery are not connected.'}</p>
          <button type="button" onClick={close} className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700">Done</button>
        </div>
      ) : (
        <div className="pr-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">{editing ? 'Edit user' : submitForApproval ? 'Request a new user' : 'Invite a user'}</h2>
          <p className="mt-1 text-xs text-slate-500">{editing ? 'Update the user’s profile, role or status.' : submitForApproval ? 'As a portal admin maker, submit this user addition request for checker approval.' : 'Create an account and assign a role. The user will receive an invite once Access SSO is connected.'}</p>
          <form onSubmit={submit} noValidate className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
            <label className="block min-w-0 sm:col-span-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">Full name <span className="text-rose-500">*</span></span>
              <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Full name" aria-invalid={Boolean(errors.name)} placeholder="e.g. Amara Okafor" className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 ${errors.name ? 'border-rose-400' : 'border-slate-200'}`} />
              {errors.name && <span role="alert" className="mt-1 block text-[10px] font-medium text-rose-600">{errors.name}</span>}
            </label>
            <label className="block min-w-0 sm:col-span-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">Email <span className="text-rose-500">*</span></span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email" aria-invalid={Boolean(errors.email)} placeholder="name@example.test" className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 ${errors.email ? 'border-rose-400' : 'border-slate-200'}`} />
              {errors.email && <span role="alert" className="mt-1 block text-[10px] font-medium text-rose-600">{errors.email}</span>}
            </label>
            <label className="block min-w-0">
              <span className="text-[11px] font-semibold text-slate-700">Role</span>
              <select value={role} onChange={(event) => setRole(event.target.value as AppRole)} aria-label="Role" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-500">
                {appRoles.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="block min-w-0">
              <span className="text-[11px] font-semibold text-slate-700">Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)} aria-label="Status" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-500">
                {userStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="block min-w-0 sm:col-span-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">Department / unit <span className="text-rose-500">*</span></span>
              <input value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Department" aria-invalid={Boolean(errors.department)} placeholder="e.g. Sustainability" className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 ${errors.department ? 'border-rose-400' : 'border-slate-200'}`} />
              {errors.department && <span role="alert" className="mt-1 block text-[10px] font-medium text-rose-600">{errors.department}</span>}
            </label>
            <div className="mt-1 flex items-center justify-end gap-2 sm:col-span-2">
              <button type="button" onClick={close} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700">{editing ? 'Save changes' : submitForApproval ? 'Submit for approval' : 'Send invite'}</button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  )
}

export default function UserManagementPage() {
  const { currentUser } = useCurrentUser()
  const { users, userAdditionRequests, addUser, requestUserAddition, approveUserAddition, rejectUserAddition, updateUser } = useUsers()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AppUser | null>(null)
  const [selected, setSelected] = useState<AppUser | null>(null)

  const isAdmin = canManageUsers(currentUser.role)
  const isMaker = currentUser.adminType === 'maker'
  const isChecker = currentUser.adminType === 'checker'
  const pendingRequests = userAdditionRequests.filter((request) => request.decisionStatus === 'Pending')

  const filtered = useMemo(() => users.filter((user) => {
    const query = `${user.name} ${user.email} ${user.department} ${user.role}`.toLowerCase()
    return (roleFilter === 'all' || user.role === roleFilter)
      && (statusFilter === 'all' || user.status === statusFilter)
      && (!search.trim() || query.includes(search.trim().toLowerCase()))
  }), [users, roleFilter, statusFilter, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetPageAndSet<T>(setter: (value: T) => void, value: T) {
    setter(value)
    setPage(1)
  }

  function submitUser(values: { name: string; email: string; role: AppRole; status: UserStatus; department: string }) {
    if (editing) {
      updateUser(editing.id, values)
    } else if (isMaker) {
      requestUserAddition(values, currentUser.name, currentUser.id)
    } else {
      addUser(values)
    }
    setEditing(null)
  }

  function toggleStatus(user: AppUser) {
    updateUser(user.id, { status: user.status === 'Suspended' ? 'Active' : 'Suspended' })
    setSelected((current) => current?.id === user.id ? { ...current, status: current.status === 'Suspended' ? 'Active' : 'Suspended' } : current)
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, 'User management']} />
        <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><ShieldX className="h-6 w-6" /></span>
          <h1 className="mt-5 text-xl font-bold text-slate-900">Access restricted</h1>
          <p className="mt-2 text-xs leading-5 text-slate-500">User management is available to Portal Administrators only. Your current role is <span className="font-semibold text-slate-700">{currentUser.role}</span>. Switch to an administrator account from the user menu in the header to access this page.</p>
        </section>
      </div>
    )
  }

  const counts = {
    total: users.length,
    administrators: users.filter((user) => user.role === 'Portal Administrator').length,
    reviewers: users.filter((user) => user.role === 'Sustainability Reviewer').length,
    contributors: users.filter((user) => user.role === 'Data Contributor').length,
    active: users.filter((user) => user.status === 'Active').length,
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview', to: '/dashboard' }, 'User management']} />
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-start gap-3.5">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><UserCog className="h-5 w-5" /></span>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">User management</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Manage who can access the portal, what they can do and their account status.</p>
          </div>
        </div>
        {!isChecker && (
          <button type="button" onClick={() => { setEditing(null); setFormOpen(true) }} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"><Plus className="h-4 w-4" /> {isMaker ? 'Request new user' : 'Add user'}</button>
        )}
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p className="text-xs leading-5 text-brand-900"><span className="font-bold">Maker-checker control.</span> {isMaker ? 'As a portal admin maker, new user additions are submitted as requests for checker approval.' : isChecker ? 'As a portal admin checker, review and approve or reject pending user addition requests.' : 'Changes are applied to this browser session only. Production provisioning, Access SSO synchronization and email invites require the identity service.'}</p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total users</p><p className="mt-1 text-2xl font-bold text-slate-900">{counts.total}</p><p className="mt-1 text-[10px] text-slate-400">In this workspace</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Administrators</p><p className="mt-1 text-2xl font-bold text-brand-700">{counts.administrators}</p><p className="mt-1 text-[10px] text-slate-400">Full portal access</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Reviewers</p><p className="mt-1 text-2xl font-bold text-amber-600">{counts.reviewers}</p><p className="mt-1 text-[10px] text-slate-400">Can review submissions</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Contributors</p><p className="mt-1 text-2xl font-bold text-slate-700">{counts.contributors}</p><p className="mt-1 text-[10px] text-slate-400">Submit data only · {counts.active} active</p></div>
      </section>

      {(isMaker || isChecker || pendingRequests.length > 0) && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">User addition requests</h2>
                <p className="mt-1 text-[10px] text-slate-500">{pendingRequests.length} pending {pendingRequests.length === 1 ? 'request' : 'requests'}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700"><Clock3 className="h-3 w-3" /> Maker-checker</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-3">Requested user</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Requested by</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
              <tbody>
                {userAdditionRequests.map((request) => (
                  <tr key={request.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-5 py-3.5"><p className="text-xs font-semibold text-slate-800">{request.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{request.email} · {request.department}</p></td>
                    <td className="whitespace-nowrap px-4 py-3.5"><RoleBadge role={request.role} /></td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600">{request.requestedBy}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">{request.requestedAt}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${request.decisionStatus === 'Pending' ? 'bg-amber-50 text-amber-700' : request.decisionStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${request.decisionStatus === 'Pending' ? 'bg-amber-500' : request.decisionStatus === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {request.decisionStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      {isChecker && request.decisionStatus === 'Pending' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button type="button" onClick={() => approveUserAddition(request.id, currentUser.name)} className="inline-flex h-8 items-center gap-1 rounded-lg bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"><Check className="h-3.5 w-3.5" /><span className="hidden sm:inline">Approve</span></button>
                          <button type="button" onClick={() => rejectUserAddition(request.id, currentUser.name)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[10px] font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"><RotateCcw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Reject</span></button>
                        </div>
                      ) : request.decidedBy ? (
                        <span className="text-[10px] text-slate-400">{request.decidedBy}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Awaiting checker</span>
                      )}
                    </td>
                  </tr>
                ))}
                {userAdditionRequests.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-xs text-slate-500">No user addition requests yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-5">
          <div><h2 className="text-sm font-bold text-slate-900">Portal users</h2><p className="mt-1 text-[10px] text-slate-500">{filtered.length} matching {filtered.length === 1 ? 'user' : 'users'}</p></div>
          <div className="flex flex-wrap gap-2">
            <label className="relative block min-w-48 flex-1 sm:flex-none">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input type="search" value={search} onChange={(event) => resetPageAndSet(setSearch, event.target.value)} placeholder="Search users" className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-[11px] outline-none placeholder:text-slate-400 focus:border-brand-500" />
            </label>
            <select aria-label="Filter by role" value={roleFilter} onChange={(event) => resetPageAndSet(setRoleFilter, event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500">
              <option value="all">All roles</option>
              {appRoles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <select aria-label="Filter by status" value={statusFilter} onChange={(event) => resetPageAndSet(setStatusFilter, event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 outline-none focus:border-brand-500">
              <option value="all">All statuses</option>
              {userStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead><tr className="bg-slate-50 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400"><th className="px-5 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last active</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody>
              {pageUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{initials(user.name)}</span>
                      <div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-800">{user.name}</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{user.email}</p></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5"><RoleBadge role={user.role} /></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600">{user.department}</td>
                  <td className="whitespace-nowrap px-4 py-3.5"><UserStatusBadge status={user.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">{user.lastActive}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button type="button" onClick={() => setSelected(user)} aria-label={`View ${user.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Eye className="h-4 w-4" /></button>
                      <button type="button" onClick={() => { setEditing(user); setFormOpen(true) }} aria-label={`Edit ${user.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"><Pencil className="h-4 w-4" /></button>
                      {user.id !== currentUser.id && (
                        user.status === 'Suspended'
                          ? <button type="button" onClick={() => toggleStatus(user)} title="Reactivate" className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Reactivate</span></button>
                          : <button type="button" onClick={() => toggleStatus(user)} title="Suspend" className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[10px] font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"><Ban className="h-3.5 w-3.5" /><span className="hidden sm:inline">Suspend</span></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageUsers.length === 0 && <tr><td colSpan={6} className="px-6 py-14 text-center text-xs text-slate-500">No users match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={pageCount} onPageChange={setPage} />
      </section>

      <UserFormModal key={editing?.id ?? 'new'} open={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} editing={editing} submitForApproval={isMaker && !editing} onSubmit={submitUser} />

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} label={selected?.name ?? 'User details'}>
        {selected && (
          <div className="pr-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-base font-bold text-white">{initials(selected.name)}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><Mail className="h-3.5 w-3.5" />{selected.email}</p>
                </div>
              </div>
              <UserStatusBadge status={selected.status} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              {([['Role', selected.role], ['Department', selected.department], ['Status', selected.status], ['Last active', selected.lastActive]] as [string, string][]).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5"><dt className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-xs font-medium text-slate-700">{value}</dd></div>
              ))}
            </dl>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-[10px] leading-4 text-slate-400">Demo identities; production accounts, roles and SSO sync are not connected.</p>
              {selected.id !== currentUser.id && (
                <button type="button" onClick={() => toggleStatus(selected)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-semibold ${selected.status === 'Suspended' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700'}`}>
                  {selected.status === 'Suspended' ? <><CheckCircle2 className="h-4 w-4" /> Reactivate</> : <><Ban className="h-4 w-4" /> Suspend</>}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
