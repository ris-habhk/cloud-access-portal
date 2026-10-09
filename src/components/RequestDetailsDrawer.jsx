
import { useEffect } from "react"
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react"

import RiskBadge from "./RiskBadge.jsx"
import StatusBadge from "./StatusBadge.jsx"

function RequestDetailsDrawer({
  request,
  rejectionReason,
  setRejectionReason,
  onClose,
  onApprove,
  onReject,
}) {
  const isOpen = Boolean(request)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!request) return null

  const compliance =
    request.risk === "Low"
      ? {
          label: "Clean / No Conflict",
          className: "border-green-200 bg-green-50 text-green-800",
          Icon: CheckCircle2,
        }
      : {
          label: "Warning: Potential Conflict",
          className:
            request.risk === "High"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-amber-200 bg-amber-50 text-amber-800",
          Icon: AlertTriangle,
        }

  const ComplianceIcon = compliance.Icon

  const complianceNote =
    request.risk === "Low"
      ? "Clean request: Matches standard role permissions."
      : request.risk === "Medium"
        ? "Warning: Review the requested permissions against the user's role before approval."
        : "Warning: High privilege request requires careful review."

  const getRiskSummary = () => {
    const requester = request.requesterName || "The requester"
    const role = request.role || "their assigned role"
    const tool = request.tool || "the requested application"

    if (request.risk === "Low") {
      return `Low risk: ${requester} (${role}) is requesting ${tool}, which is classified as standard access.`
    }

    if (request.risk === "Medium") {
      return `Medium risk: ${requester} (${role}) is requesting ${tool}. Review the requested permissions against their usual responsibilities.`
    }

    return `High risk: ${requester} (${role}) is requesting ${tool}. This elevated access should be checked carefully against their usual scope.`
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Close request details"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
              Manager Review
            </p>

            <h2
              id="request-details-title"
              className="mt-1 text-xl font-semibold text-slate-900"
            >
              Request Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request details"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Requester
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {request.requesterName}
            </p>

            <p className="text-sm text-slate-500">{request.role}</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Application
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {request.tool}
                </p>
              </div>

              <RiskBadge risk={request.risk} showIcon />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                <Clock size={14} className="mr-1 inline" aria-hidden="true" />
                Duration
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {request.duration}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Request Date
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {request.requestDate || "Not available"}
              </p>
            </div>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Request Status
            </p>

            <div className="mt-2">
              <StatusBadge status={request.status} showIcon />
            </div>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Business Justification
            </p>

            <p className="mt-2 break-words rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
              {request.justification}
            </p>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Compliance Status
            </p>

            <div
              className={`mt-2 flex items-start gap-3 rounded-xl border p-4 ${compliance.className}`}
            >
              <ComplianceIcon
                size={20}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-semibold">{compliance.label}</p>

                <p className="mt-1 text-sm leading-5">
                  {complianceNote}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Smart Risk Summary
            </p>

            <div
              className={`mt-2 rounded-xl border p-4 text-sm leading-6 ${
                request.risk === "Low"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : request.risk === "High"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                <p>{getRiskSummary()}</p>
              </div>
            </div>
          </section>

          {request.status === "Rejected" && request.rejectionReason && (
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-red-700">
                Rejection Reason
              </p>

              <p className="mt-2 break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                {request.rejectionReason}
              </p>
            </section>
          )}

          {request.status === "Pending" && (
            <section>
              <label
                htmlFor="rejection-reason"
                className="text-sm font-semibold text-slate-900"
              >
                Rejection Reason
              </label>

              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Explain why this request should be rejected..."
                rows={4}
                className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Minimum 10 characters required.
              </p>
            </section>
          )}
        </div>

        <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          {request.status === "Pending" ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onReject}
                disabled={rejectionReason.trim().length < 10}
                className="flex-1 rounded-xl border border-red-200 px-3 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reject Request
              </button>

              <button
                type="button"
                onClick={onApprove}
                className="flex-1 rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Approve Request
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}

export default RequestDetailsDrawer
