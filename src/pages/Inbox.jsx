import { useMemo, useState } from "react"

function Inbox({ requests, onViewRequest }) {
  const [statusFilter, setStatusFilter] = useState("All")
  const [search, setSearch] = useState("")

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length

  const approvedCount = requests.filter(
    (request) => request.status === "Approved"
  ).length

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        request.tool.toLowerCase().includes(searchText) ||
        request.requesterName
          .toLowerCase()
          .includes(searchText) ||
        request.role.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All" ||
        request.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("All")
  }

  const getStatusClasses = (status) => {
    if (status === "Approved") {
      return "bg-green-100 text-green-700"
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700"
    }

    return "bg-amber-100 text-amber-700"
  }

  const getRiskClasses = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700"
    }

    if (risk === "Medium") {
      return "bg-amber-100 text-amber-700"
    }

    return "bg-green-100 text-green-700"
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manager Inbox
          </h1>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Review and manage access requests.
          </p>
        </div>

        {/* Pending Review Banner */}
        {pendingCount > 0 && (
          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Requests awaiting review
              </p>

              <p className="mt-1 text-sm text-amber-700">
                There are {pendingCount} pending{" "}
                {pendingCount === 1 ? "request" : "requests"}{" "}
                requiring manager action.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStatusFilter("Pending")}
              className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Review Pending
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Pending */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Awaiting review
            </p>
          </div>

          {/* Approved */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {approvedCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Access granted
            </p>
          </div>

          {/* Rejected */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Access denied
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8">
          <label
            htmlFor="inbox-search"
            className="sr-only"
          >
            Search access requests
          </label>

          <input
            id="inbox-search"
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by application, requester, or role..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Pending", "Approved", "Rejected"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
                aria-pressed={statusFilter === status}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Result Header */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredRequests.length}{" "}
            {filteredRequests.length === 1
              ? "request"
              : "requests"}
          </p>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Request List */}
        {filteredRequests.length > 0 ? (
          <div className="mt-4 space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {request.tool}
                      </h2>

                      {request.status === "Pending" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
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

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {request.duration}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getRiskClasses(
                        request.risk
                      )}`}
                    >
                      {request.risk} Risk
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-slate-100" />

                {/* Details */}
                <div className="grid gap-4 md:grid-cols-3">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Request Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {request.requestDate ||
                        "Not available"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Business Justification
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {request.justification}
                    </p>
                  </div>
                </div>

                {/* High Risk Warning */}
                {request.risk === "High" && (
                  <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">
                      High-risk access request
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                      {request.complianceNote}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-400">
                    Request ID: {request.id}
                  </p>

                  <button
                    type="button"
                    onClick={() => onViewRequest(request)}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              📭
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No requests found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No access requests match your current search
              and filter settings.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Inbox