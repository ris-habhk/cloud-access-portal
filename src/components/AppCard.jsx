function AppCard({ app, onRequestAccess }) {
  let riskClasses = ""

  if (app.risk === "Low") {
    riskClasses = "bg-green-100 text-green-700"
  } else if (app.risk === "Medium") {
    riskClasses = "bg-amber-100 text-amber-700"
  } else if (app.risk === "High") {
    riskClasses = "bg-red-100 text-red-700"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* App Name */}
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-700">
          {app.name.charAt(0)}
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {app.name}
        </h2>

      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-slate-600">
        {app.description}
      </p>

      {/* Risk */}
      <div className="mt-5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${riskClasses}`}
        >
          {app.risk} Risk
        </span>
      </div>

      {/* Recommendation */}
      {app.recommended && (
        <div className="mt-4 rounded-lg bg-violet-50 p-3 text-sm text-violet-700">

          <span className="font-medium">
            Recommended
          </span>

          <p className="mt-1">
            {app.recommendationReason}
          </p>

        </div>
      )}

      {/* Request Access */}
      <button
        onClick={() => onRequestAccess(app)}
        className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
      >
        Request Access
      </button>

    </div>
  )
}

export default AppCard