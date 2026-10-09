
import { useState } from "react"
import AppCard from "../components/AppCard.jsx"
import RequestDrawer from "../components/RequestDrawer.jsx"
import { catalog, currentUser } from "../data/mockData.js"

function Catalog({ onRequestSubmitted }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [selectedApp, setSelectedApp] = useState(null)
  const [duration, setDuration] = useState("8 Hours (1 Day)")
  const [justification, setJustification] = useState("")

  const categories = [
    "All",
    "Cloud",
    "Developer Tools",
    "Business Apps",
  ]

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
    setDuration("8 Hours (1 Day)")
    setJustification("")
  }

  const closeRequestDrawer = () => {
    setSelectedApp(null)
    setJustification("")
  }

  const handleSubmitRequest = () => {
    if (!selectedApp || justification.trim().length < 20) {
      return
    }

    const newRequest = {
      id: `req_${Date.now()}`,
      requesterName: currentUser.name,
      role: currentUser.role,
      tool: selectedApp.name,
      duration,
      justification: justification.trim(),
      risk: selectedApp.risk,
      status: "Pending",
      requestDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      complianceNote:
        selectedApp.risk === "Low"
          ? "Clean request: Matches standard role permissions."
          : selectedApp.risk === "Medium"
            ? "Warning: Review the requested permissions against the user's role before approval."
            : "Warning: High privilege request requires careful review.",
    }

    onRequestSubmitted(newRequest)
    closeRequestDrawer()
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-800">
          ACCESS MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Application Catalog
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Discover the tools your team uses and request the access
          you need to do your work.
        </p>
      </div>

      <div className="mb-5">
        <label
          htmlFor="catalog-search"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Search applications
        </label>

        <input
          id="catalog-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by application name..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:max-w-md"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === item
                ? "bg-blue-800 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Available applications
        </h2>

        <p className="text-sm text-slate-500">
          {filteredApps.length}{" "}
          {filteredApps.length === 1 ? "application" : "applications"}
        </p>
      </div>

      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onRequestAccess={() => openRequestDrawer(app)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No applications found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try another search term or select a different category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("")
              setCategory("All")
            }}
            className="mt-5 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Clear filters
          </button>
        </div>
      )}

      {selectedApp && (
        <RequestDrawer
          app={selectedApp}
          duration={duration}
          setDuration={setDuration}
          justification={justification}
          setJustification={setJustification}
          onClose={closeRequestDrawer}
          onSubmit={handleSubmitRequest}
        />
      )}
    </main>
  )
}

export default Catalog
