
import {
  CalendarDays,
  Clock3,
  Eye,
  XCircle,
} from "lucide-react"

import RiskBadge from "./RiskBadge.jsx"
import StatusBadge from "./StatusBadge.jsx"

function RequestCard({ request, onView }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              {request.tool}
            </h2>

            {request.status === "Pending" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                <Clock3 size={13} aria-hidden="true" />
                Action required
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-600">
            Requested by{" "}
            <span className="font-semibold text-slate-900">
              {request.requesterName}
            </span>
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {request.role}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={request.status} showIcon />

          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {request.duration}
          </span>

          <RiskBadge risk={request.risk} showIcon />
        </div>
      </div>

      <div className="my-5 border-t border-slate-100" />

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <CalendarDays size={14} aria-hidden="true" />
            Request date
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {request.requestDate || "Not available"}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Business justification
          </p>

          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
            {request.justification}
          </p>
        </div>
      </div>

      {request.risk === "High" && (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <XCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-700"
            aria-hidden="true"
          />

          <div>
            <p className="text-sm font-semibold text-red-800">
              High-risk access request
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {request.complianceNote ||
                "Warning: High privilege request requires careful review."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-all text-xs text-slate-400">
          Request ID: {request.id}
        </p>

        <button
          type="button"
          onClick={() => onView(request)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Eye size={16} aria-hidden="true" />
          View details
        </button>
      </div>
    </article>
  )
}

export default RequestCard
