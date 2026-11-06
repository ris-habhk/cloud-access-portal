import { useEffect, useMemo, useState } from "react";
import AppCard from "../components/AppCard.jsx";
import RequestDrawer from "../components/RequestDrawer.jsx";
import SearchInput from "../components/SearchInput.jsx";
import FilterPills from "../components/FilterPills.jsx";
import { apiRequest } from "../services/api.js";

function Catalog({ onToast }) {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [duration, setDuration] = useState("4 Hours");
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/applications")
      .then((result) => {
        if (active) setApps(result.data || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load applications.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(apps.map((app) => app.category))],
    [apps]
  );

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (category === "All" || app.category === category);
  });

  const openRequestDrawer = (app) => {
    setSelectedApp(app);
    setDuration("4 Hours");
    setJustification("");
  };

  const closeRequestDrawer = () => {
    setSelectedApp(null);
    setJustification("");
  };

  async function handleSubmitRequest() {
    if (!selectedApp || justification.trim().length < 20 || submitting) return;
    try {
      setSubmitting(true);
      await apiRequest("/access-requests", {
        method: "POST",
        body: {
          applicationId: selectedApp._id,
          duration,
          justification: justification.trim(),
        },
      });
      closeRequestDrawer();
      onToast?.("Access request submitted successfully.", "success");
    } catch (err) {
      onToast?.(err.message || "Unable to submit request.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-800">ACCESS MANAGEMENT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Application Catalog</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Discover the tools your team uses and request the access you need to do your work.</p>
      </div>

      <div className="mb-5 sm:max-w-md">
        <SearchInput id="catalog-search" value={search} onChange={setSearch} placeholder="Search by application name..." />
      </div>
      <div className="mb-8">
        <FilterPills options={categories} selected={category} onSelect={setCategory} />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Available applications</h2>
        <p className="text-sm text-slate-500">{filteredApps.length} {filteredApps.length === 1 ? "application" : "applications"}</p>
      </div>

      {loading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading applications...</p>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
      ) : filteredApps.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredApps.map((app) => <AppCard key={app._id} app={app} onRequestAccess={() => openRequestDrawer(app)} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-900">No applications found</h3>
          <p className="mt-2 text-sm text-slate-500">Try another search term or select a different category.</p>
          <button type="button" onClick={() => { setSearch(""); setCategory("All"); }} className="mt-5 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900">Clear filters</button>
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
          submitting={submitting}
        />
      )}
    </main>
  );
}

export default Catalog;
