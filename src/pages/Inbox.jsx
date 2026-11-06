import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Clock3, Inbox as InboxIcon } from "lucide-react";
import SearchInput from "../components/SearchInput.jsx";
import FilterPills from "../components/FilterPills.jsx";
import RequestCard from "../components/RequestCard.jsx";
import RequestDetailsDrawer from "../components/RequestDetailsDrawer.jsx";
import { apiRequest } from "../services/api.js";

function normalizeRequest(item) {
  return {
    ...item,
    id: item._id,
    requesterName: item.requester?.name || "Unknown requester",
    requesterEmail: item.requester?.email || "",
    role: item.requester?.role || "requester",
    tool: item.application?.name || "Unknown application",
    risk: item.application?.risk || "Medium",
    requestDate: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "Not available",
  };
}

function Inbox({ onToast }) {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadRequests = useCallback(async () => {
    setError("");
    try {
      const result = await apiRequest("/access-requests");
      setRequests((result.data || []).map(normalizeRequest));
    } catch (err) {
      setError(err.message || "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesSearch = [request.tool, request.requesterName, request.role, request.requesterEmail]
        .some((value) => (value || "").toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "All" || request.status === statusFilter);
    });
  }, [requests, search, statusFilter]);

  function viewRequest(request) {
    setSelectedRequest(request);
    setRejectionReason("");
  }

  function closeDetails() {
    setSelectedRequest(null);
    setRejectionReason("");
  }

  async function decideRequest(decision) {
    if (!selectedRequest || saving) return;
    try {
      setSaving(true);
      const result = await apiRequest(`/access-requests/${selectedRequest.id}/decision`, {
        method: "PATCH",
        body: {
          decision,
          ...(decision === "Rejected" ? { rejectionReason } : {}),
        },
      });
      const updated = normalizeRequest(result.data);
      setRequests((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelectedRequest(updated);
      onToast?.(result.message || `Request ${decision.toLowerCase()}.`, "success");
    } catch (err) {
      onToast?.(err.message || "Unable to update request.", "error");
    } finally {
      setSaving(false);
    }
  }

  const summaryCards = [
    { label: "Pending", count: pendingCount, description: "Awaiting review", Icon: Clock3, color: "text-amber-600", iconBg: "bg-amber-50" },
    { label: "Approved", count: approvedCount, description: "Approved requests", Icon: CheckCircle2, color: "text-green-600", iconBg: "bg-green-50" },
    { label: "Rejected", count: rejectedCount, description: "Rejected requests", Icon: XCircle, color: "text-red-600", iconBg: "bg-red-50" },
  ];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-blue-800">ACCESS MANAGEMENT</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Manager Inbox</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Review and manage access requests.</p>
        </div>

        {pendingCount > 0 && (
          <section className="mt-8 flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-800"><ClipboardCheck size={20} aria-hidden="true" /></div>
              <div><p className="text-sm font-semibold text-amber-900">Requests awaiting review</p><p className="mt-1 text-sm text-amber-800">{pendingCount} pending {pendingCount === 1 ? "request needs" : "requests need"} manager action.</p></div>
            </div>
            <button type="button" onClick={() => setStatusFilter("Pending")} className="rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900">Review pending</button>
          </section>
        )}

        <section aria-label="Request summary" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map(({ label, count, description, Icon, color, iconBg }) => (
            <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={`rounded-lg p-2 ${iconBg} ${color}`}><Icon size={19} aria-hidden="true" /></span></div>
              <p className={`mt-3 text-3xl font-bold ${color}`}>{count}</p><p className="mt-1 text-sm text-slate-500">{description}</p>
            </article>
          ))}
        </section>

        <div className="mt-8"><SearchInput id="inbox-search" value={search} onChange={setSearch} placeholder="Search by application, requester, or role..." /></div>
        <div className="mt-4"><FilterPills options={["All", "Pending", "Approved", "Rejected"]} selected={statusFilter} onSelect={setStatusFilter} counts={{ Pending: pendingCount }} /></div>

        {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading ? <p className="mt-8 rounded-xl bg-white p-8 text-center text-sm text-slate-500">Loading access requests...</p> : (
          <>
            <p className="mt-8 text-sm text-slate-500">Showing {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"}</p>
            {filteredRequests.length ? (
              <div className="mt-4 space-y-4">{filteredRequests.map((request) => <RequestCard key={request.id} request={request} onView={viewRequest} />)}</div>
            ) : (
              <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800"><InboxIcon size={25} aria-hidden="true" /></div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{requests.length ? "No requests found" : "All caught up!"}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{requests.length ? "No access requests match your current search and filter settings." : "There are no access requests waiting for review."}</p>
                {(search || statusFilter !== "All") && <button type="button" onClick={() => { setSearch(""); setStatusFilter("All"); }} className="mt-5 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white">Clear filters</button>}
              </section>
            )}
          </>
        )}
      </div>

      <RequestDetailsDrawer
        request={selectedRequest}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onClose={closeDetails}
        onApprove={() => decideRequest("Approved")}
        onReject={() => decideRequest("Rejected")}
        saving={saving}
      />
    </main>
  );
}

export default Inbox;
