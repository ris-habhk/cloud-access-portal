
import { Sparkles } from "lucide-react"
import RiskBadge from "./RiskBadge.jsx"

function AppCard({ app, onRequestAccess }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-800">
          {app.name.charAt(0)}
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {app.name}
        </h2>
      </div>

      <p className="mt-5 flex-1 text-sm leading-6 text-slate-600">
        {app.description}
      </p>

      <div className="mt-5">
        <RiskBadge risk={app.risk} showIcon />
      </div>

      {app.recommended && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800">
            <Sparkles size={14} aria-hidden="true" />
            Recommended for your team
          </span>

          {app.recommendationReason && (
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {app.recommendationReason}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onRequestAccess}
        className="mt-6 w-full rounded-xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Request Access
      </button>
    </article>
  )
}

export default AppCard
