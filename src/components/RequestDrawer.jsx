function RequestDrawer({
  app,
  duration,
  setDuration,
  justification,
  setJustification,
  onClose,
  onSubmit,
}) {
  if (!app) return null

  const isValid = justification.trim().length >= 20

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-access-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Close request access drawer"
      />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Access Request
            </p>

            <h2
              id="request-access-title"
              className="mt-1 text-xl font-semibold text-slate-900"
            >
              Request {app.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close request access"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* App information */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-semibold text-blue-700">
                {app.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  {app.name}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {app.description}
                </p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-slate-900">
              Access Duration
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {["4 Hours", "8 Hours (1 Day)", "7 Days", "30 Days"].map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDuration(option)}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                      duration === option
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    aria-pressed={duration === option}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Justification */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label
                htmlFor="business-justification"
                className="text-sm font-semibold text-slate-900"
              >
                Business Justification
              </label>

              <span
                className={`text-xs ${
                  justification.trim().length >= 20
                    ? "text-green-600"
                    : "text-slate-500"
                }`}
              >
                {justification.length}/20 minimum
              </span>
            </div>

            <textarea
              id="business-justification"
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              placeholder="Explain why you need access to this application..."
              rows={6}
              className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {justification.length > 0 &&
              justification.trim().length < 20 && (
                <p className="mt-2 text-xs text-amber-600">
                  Please provide at least 20 characters.
                </p>
              )}
          </div>

          {/* Request information */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              What happens next?
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Your request will be sent to the Manager Inbox for review.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!isValid}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDrawer