
import { NavLink } from "react-router-dom"
import { Cloud, LayoutGrid, ClipboardList } from "lucide-react"

function Navbar({ pendingCount = 0 }) {
  const linkClasses = ({ isActive }) =>
    `inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${
      isActive
        ? "bg-blue-50 text-blue-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-800"
    }`

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <NavLink
          to="/catalog"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Cloud Access Portal home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white">
            <Cloud size={20} aria-hidden="true" />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-slate-900 sm:text-lg">
              Cloud Access Portal
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Access management
            </span>
          </span>
        </NavLink>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NavLink to="/catalog" className={linkClasses}>
            <LayoutGrid size={16} aria-hidden="true" />
            <span>Catalog</span>
          </NavLink>

          <NavLink to="/inbox" className={linkClasses}>
            <ClipboardList size={16} aria-hidden="true" />
            <span>Inbox</span>

            {pendingCount > 0 && (
              <span
                aria-label={`${pendingCount} pending requests`}
                className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-blue-800 px-1.5 py-0.5 text-[10px] font-bold leading-4 text-white"
              >
                {pendingCount > 99 ? "99+" : pendingCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
