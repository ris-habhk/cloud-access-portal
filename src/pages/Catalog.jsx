import { useState } from "react"

import AppCard from "../components/AppCard.jsx"
import RequestDrawer from "../components/RequestDrawer.jsx"
import Toast from "../components/Toast.jsx"

import { catalog } from "../data/mockData.js"

function Catalog({ onRequestSubmitted }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const [selectedApp, setSelectedApp] = useState(null)

  const [duration, setDuration] = useState("4 Hours")
  const [justification, setJustification] = useState("")

  const [toast, setToast] = useState("")

  const categories = [
    "All",
    "Cloud",
    "Developer Tools",
    "Business Apps",
  ]

  // Filter applications
  const filteredApps = catalog.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === "All" || app.category === category

    return matchesSearch && matchesCategory
  })

  // Open request drawer
  const handleRequestAccess = (app) => {
    setSelectedApp(app)
    setDuration("4 Hours")
    setJustification("")
  }

  // Close request drawer
  const handleCloseDrawer = () => {
    setSelectedApp(null)
    setJustification("")
    setDuration("4 Hours")
  }

  // Submit request
  const handleSubmitRequest = () => {
    if (!selectedApp) return

    if (justification.trim().length < 20) {
      return
    }

    const newRequest = {
      id: `req_${Date.now()}`,
      requesterName: "Rishabh Kumar",
      role: "Security Engineer",
      tool: selectedApp.name,
      duration,
      justification: justification.trim(),
      risk: selectedApp.risk,
      status: "Pending",
      requestDate: new Date().toLocaleDateString(),
      complianceNote:
        selectedApp.risk === "High"
          ? "Warning: High privilege request requires careful review."
          : "Safe request: Matches standard role permissions.",
    }

    onRequestSubmitted(newRequest)

    setSelectedApp(null)
    setJustification("")
    setDuration("4 Hours")

    setToast("Access request submitted successfully.")

    setTimeout(() => {
      setToast("")
    }, 3000)
  }

  return (
    <>
      <main className="min-h-[calc(100vh-73px)] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              App Catalog
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Request temporary access to the tools you need.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="mt-8">
            <div className="max-w-2xl">
              <label
                htmlFor="application-search"
                className="sr-only"
              >
                Search applications
              </label>

              <input
                id="application-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search applications..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    category === item
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Result Count */}
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredApps.length}{" "}
              {filteredApps.length === 1
                ? "application"
                : "applications"}{" "}
              available
            </p>
          </div>

          {/* Application Cards */}
          {filteredApps.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onRequestAccess={handleRequestAccess}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                🔍
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No applications found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Try changing your search term or selecting a
                different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setCategory("All")
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Request Drawer */}
      <RequestDrawer
        app={selectedApp}
        duration={duration}
        setDuration={setDuration}
        justification={justification}
        setJustification={setJustification}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmitRequest}
      />

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() => setToast("")}
      />
    </>
  )
}

export default Catalog