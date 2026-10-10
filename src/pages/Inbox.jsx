
import { useMemo, useState } from "react"
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  Inbox as InboxIcon,
} from "lucide-react"

import SearchInput from "../components/SearchInput.jsx"
import FilterPills from "../components/FilterPills.jsx"
import RequestCard from "../components/RequestCard.jsx"

function Inbox({ requests, onViewRequest, onResetDemo }) {
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
    const searchText = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch = [
        request.tool,
        request.requesterName,
        request.role,
      ].some((value) =>
        (value || "").toLowerCase().includes(searchText)
      )

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

  const summaryCards = [
    {
      label: "Pending",
      count: pendingCount,
      description: "Awaiting review",
      Icon: Clock3,
      color: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Approved",
      count: approvedCount,
      description: "Access granted",
      Icon: CheckCircle2,
      color: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      label: "Rejected",
      count: rejectedCount,
      description: "Access denied",
      Icon: XCircle,
      color: "text-red-600",
      iconBg: "bg-red-50",
    },
  ]

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-800">
              ACCESS MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Manager Inbox
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Review and manage access requests.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Reset demo data
          </button>
        </div>

        {pendingCount > 0 ? (
          <section className="mt-8 flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                <ClipboardCheck size={20} aria-hidden="true" />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Requests awaiting review
                </p>

                <p className="mt-1 text-sm text-amber-800">
                  {pendingCount} pending{" "}
                  {pendingCount === 1 ? "request needs" : "requests need"}{" "}
                  manager action.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStatusFilter("Pending")}
              className="rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Review pending
            </button>
          </section>
        ) : (
          <section className="mt-8 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-5">
            <CheckCircle2
              size={22}
              className="mt-0.5 shrink-0 text-green-700"
              aria-hidden="true"
            />

            <div>
              <p className="font-semibold text-green-900">
                All caught up!
              </p>

              <p className="mt-1 text-sm text-green-800">
                There are no pending access requests awaiting review.
              </p>
            </div>
          </section>
        )}

        <section
          aria-label="Request summary"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {summaryCards.map((card) => {
            const Icon = card.Icon

            return (
              <article
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>

                  <span
                    className={`rounded-lg p-2 ${card.iconBg} ${card.color}`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </span>
                </div>

                <p className={`mt-3 text-3xl font-bold ${card.color}`}>
                  {card.count}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {card.description}
                </p>
              </article>
            )
          })}
        </section>

        <div className="mt-8">
          <SearchInput
            id="inbox-search"
            value={search}
            onChange={setSearch}
            placeholder="Search by application, requester, or role..."
          />
        </div>

        <div className="mt-4">
          <FilterPills
            options={["All", "Pending", "Approved", "Rejected"]}
            selected={statusFilter}
            onSelect={setStatusFilter}
            counts={{ Pending: pendingCount }}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing {filteredRequests.length}{" "}
            {filteredRequests.length === 1 ? "request" : "requests"}
          </p>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-800 hover:text-blue-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredRequests.length > 0 ? (
          <div className="mt-4 space-y-4">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onView={onViewRequest}
              />
            ))}
          </div>
        ) : (
          <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800">
              <InboxIcon size={25} aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No requests found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No access requests match your current search and filter settings.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear filters
            </button>
          </section>
        )}
      </div>
    </main>
  )
}

export default Inbox
