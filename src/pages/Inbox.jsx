function Inbox({ requests }) {
  return (
    <section>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Manager Inbox
        </h1>

        <p className="mt-2 text-slate-600">
          Review and manage access requests.
        </p>
      </div>

      {/* Requests */}
      <div className="mt-8 space-y-4">

        {requests.map((request) => (
          <div
            key={request.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              {/* Request information */}
              <div>

                <h2 className="font-semibold text-slate-900">
                  {request.tool}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Requested by {request.requesterName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {request.role}
                </p>

              </div>

              {/* Request metadata */}
              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {request.status}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {request.duration}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    request.risk === "Low"
                      ? "bg-green-100 text-green-700"
                      : request.risk === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {request.risk} Risk
                </span>

              </div>

            </div>

            {/* Justification */}
            <div className="mt-4 border-t border-slate-100 pt-4">

              <p className="text-sm text-slate-700">
                <span className="font-medium">
                  Justification:
                </span>{" "}
                {request.justification}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {request.requestDate || "Existing request"}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  )
}

export default Inbox