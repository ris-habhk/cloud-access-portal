function RequestDrawer({
  app,
  duration,
  setDuration,
  justification,
  setJustification,
  onClose,
  onSubmit,
}) {
  if (!app) {
    return null
  }

  const characterCount = justification.length
  const isValid = characterCount >= 20 && duration !== ""

  return (
    <div className="fixed inset-0 z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Request Access
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {app.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6 p-6">

          {/* App information */}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              {app.name}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {app.description}
            </p>

            <p className="mt-3 text-xs text-slate-500">
              Risk level: {app.risk}
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-slate-900">
              Access Duration
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">

              {[
                "4 Hours",
                "8 Hours (1 Day)",
                "7 Days",
                "30 Days",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDuration(option)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    duration === option
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}

            </div>
          </div>

          {/* Justification */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="justification"
                className="text-sm font-medium text-slate-900"
              >
                Business Justification
              </label>

              <span
                className={`text-xs ${
                  characterCount >= 20
                    ? "text-green-600"
                    : "text-slate-500"
                }`}
              >
                {characterCount} / 20
              </span>
            </div>

            <textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why you need access..."
              rows={6}
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {characterCount > 0 && characterCount < 20 && (
              <p className="mt-2 text-xs text-red-600">
                Please provide at least 20 characters.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={!isValid}
            onClick={onSubmit}
            className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition ${
              isValid
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Submit Request
          </button>

        </div>
      </aside>
    </div>
  )
}

export default RequestDrawer