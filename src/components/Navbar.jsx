import { NavLink } from "react-router-dom"

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo / Brand */}
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Cloud Access Portal
          </h1>

          <p className="text-xs text-slate-500">
            Access management
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            Catalog
          </NavLink>

          <NavLink
            to="/inbox"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            Manager Inbox
          </NavLink>

        </div>

      </div>

    </nav>
  )
}

export default Navbar