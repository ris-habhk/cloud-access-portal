import { useState } from "react"
import { catalog } from "../data/mockData"
import AppCard from "../components/AppCard"
import RequestDrawer from "../components/RequestDrawer"

function Catalog({ onRequestSubmitted }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  // Drawer state
  const [selectedApp, setSelectedApp] = useState(null)
  const [duration, setDuration] = useState("")
  const [justification, setJustification] = useState("")

  const filteredApps = catalog.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === "All" || app.category === category

    return matchesSearch && matchesCategory
  })

  const openRequestDrawer = (app) => {
    setSelectedApp(app)
    setDuration("")
    setJustification("")
  }

  const closeRequestDrawer = () => {
    setSelectedApp(null)
    setDuration("")
    setJustification("")
  }

  const submitRequest = () => {
    if (!selectedApp) {
      return
    }

    if (duration === "") {
      return
    }

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

    closeRequestDrawer()
  }

  return (
    <>
      <section>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            App Catalog
          </h1>

          <p className="mt-2 text-slate-600">
            Request temporary access to the tools you need.
          </p>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-2xl">
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Category Filters */}
        <div className="mt-4 flex flex-wrap gap-2">

          <button
            onClick={() => setCategory("All")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === "All"
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setCategory("Cloud")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === "Cloud"
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Cloud
          </button>

          <button
            onClick={() => setCategory("Developer Tools")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === "Developer Tools"
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Developer Tools
          </button>

          <button
            onClick={() => setCategory("Business Apps")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === "Business Apps"
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Business Apps
          </button>

        </div>

        {/* Application Results */}
        {filteredApps.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onRequestAccess={openRequestDrawer}
              />
            ))}

          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">

            <h2 className="text-lg font-semibold text-slate-900">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or category filter.
            </p>

          </div>
        )}

      </section>

      {/* Request Drawer */}
      <RequestDrawer
        app={selectedApp}
        duration={duration}
        setDuration={setDuration}
        justification={justification}
        setJustification={setJustification}
        onClose={closeRequestDrawer}
        onSubmit={submitRequest}
      />
    </>
  )
}

export default Catalog