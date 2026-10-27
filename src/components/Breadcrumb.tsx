import { Link } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: (string | BreadcrumbItem)[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const normalized: BreadcrumbItem[] = items.map((item) => (typeof item === 'string' ? { label: item } : item))

  return (
    <nav className="print:hidden flex items-center gap-2 text-sm text-slate-400">
      <Link to="/dashboard" className="flex items-center hover:text-slate-600">
        <Home className="h-4 w-4" />
      </Link>
      {normalized.map((item, index) => {
        const isLast = index === normalized.length - 1
        return (
          <span key={item.label} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-slate-600">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-semibold text-brand-600' : ''}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
