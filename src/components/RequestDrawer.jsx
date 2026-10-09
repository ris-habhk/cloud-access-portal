
import { useEffect } from "react"
import { X, Clock, ShieldCheck, Sparkles } from "lucide-react"
import RiskBadge from "./RiskBadge.jsx"

const durations = [
  "4 Hours",
  "8 Hours (1 Day)",
  "7 Days",
  "30 Days",
]

function RequestDrawer({
  app,
  duration,
  setDuration,
  justification,
  setJustification,
  onClose,
  onSubmit,
}) {
  const characterCount = justification.trim().length
  const isValid = characterCount >= 20

  useEffect(() => {
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
  }, [onClose])

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-drawer-title"
        className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl sm:max-w-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
              Access Request
            </p>

            <h2
              id="request-drawer-title"
              className="mt-1 break-words text-xl font-semibold text-slate-900 sm:text-2xl"
            >
              Request {app.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request drawer"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
          <section className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-800">
              {app.name.charAt(0)}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">
                {app.name}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {app.description}
              </p>

              <div className="mt-3">
                <RiskBadge risk={app.risk} showIcon />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Clock size={18} className="text-slate-500" aria-hidden="true" />

              <h3 className="font-semibold text-slate-900">
                Access Duration
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {durations.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDuration(item)}
                  aria-pressed={duration === item}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    duration === item
                      ? "border-blue-800 bg-blue-50 text-blue-800 ring-1 ring-blue-800"
                      : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="business-justification"
                className="font-semibold text-slate-900"
              >
                Business Justification
              </label>

              <span
                aria-live="polite"
                className={`text-xs ${
                  isValid ? "text-green-700" : "text-slate-500"
                }`}
              >
                {characterCount}/20 minimum
              </span>
            </div>

            <textarea
              id="business-justification"
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              placeholder="Explain why you need access to this application..."
              rows={5}
              aria-describedby="justification-help"
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />

            <p
              id="justification-help"
              className={`mt-2 text-xs ${
                isValid ? "text-green-700" : "text-slate-500"
              }`}
            >
              {isValid
                ? "Your justification meets the minimum length."
                : "Enter at least 20 non-space characters."}
            </p>
          </section>

          <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={19} className="text-blue-800" aria-hidden="true" />

              <h3 className="font-semibold text-blue-900">
                What happens next?
              </h3>
            </div>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              Your request will be added to the Manager Inbox for review.
              Access is not granted until the request is approved.
            </p>
          </section>

          {app.recommended && (
            <section>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800">
                <Sparkles size={14} aria-hidden="true" />
                Recommended for your team
              </span>

              {app.recommendationReason && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {app.recommendationReason}
                </p>
              )}
            </section>
          )}
        </div>

        <footer className="flex shrink-0 gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 rounded-xl bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Submit Request
          </button>
        </footer>
      </section>
    </div>
  )
}

export default RequestDrawer
