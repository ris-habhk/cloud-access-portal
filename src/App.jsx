import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Navbar from "./components/Navbar.jsx"
import Toast from "./components/Toast.jsx"
import RequestDrawer from "./components/RequestDrawer.jsx"

import Catalog from "./pages/Catalog.jsx"
import Inbox from "./pages/Inbox.jsx"

import { initialRequests } from "./data/mockData.js"

function App() {
  // Load saved requests from localStorage.
  // If nothing is saved yet, use the initial dummy requests.
  const [requests, setRequests] = useState(() => {
    const savedRequests = localStorage.getItem("cloudAccessRequests")

    if (!savedRequests) {
      return initialRequests
    }

    try {
      return JSON.parse(savedRequests)
    } catch (error) {
      console.error(
        "Failed to load saved requests:",
        error
      )

      return initialRequests
    }
  })

  const [toast, setToast] = useState("")

  const [selectedRequest, setSelectedRequest] = useState(null)

  const [rejectionReason, setRejectionReason] = useState("")

  // Save requests whenever the requests state changes.
  useEffect(() => {
    localStorage.setItem(
      "cloudAccessRequests",
      JSON.stringify(requests)
    )
  }, [requests])

  // Called when a new request is submitted from Catalog.
  const handleRequestSubmitted = (newRequest) => {
    setRequests((currentRequests) => [
      ...currentRequests,
      newRequest,
    ])

    setToast("Access request submitted successfully.")

    setTimeout(() => {
      setToast("")
    }, 3000)
  }

  // Open request details in Manager Inbox.
  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setRejectionReason("")
  }

  // Close request details.
  const closeRequestDetails = () => {
    setSelectedRequest(null)
    setRejectionReason("")
  }

  // Approve request.
  const handleApprove = () => {
    if (!selectedRequest) return

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "Approved",
            }
          : request
      )
    )

    setSelectedRequest((currentRequest) => ({
      ...currentRequest,
      status: "Approved",
    }))

    setToast("Access request approved.")

    setTimeout(() => {
      setToast("")
    }, 3000)
  }

  // Reject request.
  const handleReject = () => {
    if (!selectedRequest) return

    if (rejectionReason.trim().length < 10) {
      return
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "Rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : request
      )
    )

    setSelectedRequest((currentRequest) => ({
      ...currentRequest,
      status: "Rejected",
      rejectionReason: rejectionReason.trim(),
    }))

    setToast("Access request rejected.")

    setTimeout(() => {
      setToast("")
    }, 3000)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <Routes>
          {/* Redirect root to Catalog */}
          <Route
            path="/"
            element={<Navigate to="/catalog" replace />}
          />

          {/* Catalog */}
          <Route
            path="/catalog"
            element={
              <Catalog
                onRequestSubmitted={handleRequestSubmitted}
              />
            }
          />

          {/* Manager Inbox */}
          <Route
            path="/inbox"
            element={
              <Inbox
                requests={requests}
                onViewRequest={handleViewRequest}
              />
            }
          />
        </Routes>

        {/* Request Details Drawer */}
        {selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-details-title"
          >
            {/* Background */}
            <button
              type="button"
              onClick={closeRequestDetails}
              className="absolute inset-0 cursor-default"
              aria-label="Close request details"
            />

            {/* Drawer */}
            <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Manager Review
                  </p>

                  <h2
                    id="request-details-title"
                    className="mt-1 text-xl font-semibold text-slate-900"
                  >
                    Request Details
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeRequestDetails}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close request details"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                
                {/* Requester */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Requester
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedRequest.requesterName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedRequest.role}
                  </p>
                </div>

                {/* Application */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Application
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedRequest.tool}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedRequest.risk === "High"
                          ? "bg-red-100 text-red-700"
                          : selectedRequest.risk === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {selectedRequest.risk} Risk
                    </span>
                  </div>
                </div>

                {/* Request information */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {selectedRequest.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Request Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {selectedRequest.requestDate ||
                        "Not available"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedRequest.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : selectedRequest.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>

                {/* Justification */}
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Business Justification
                  </p>

                  <p className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                    {selectedRequest.justification}
                  </p>
                </div>

                {/* Compliance */}
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Risk & Compliance Insight
                  </p>

                  <div
                    className={`mt-2 rounded-xl p-4 text-sm leading-6 ${
                      selectedRequest.risk === "High"
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : "border border-green-200 bg-green-50 text-green-700"
                    }`}
                  >
                    {selectedRequest.complianceNote}
                  </div>
                </div>

                {/* Rejection reason */}
                {selectedRequest.status === "Rejected" &&
                  selectedRequest.rejectionReason && (
                    <div className="mt-6">
                      <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                        Rejection Reason
                      </p>

                      <p className="mt-2 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Rejection form */}
                {selectedRequest.status === "Pending" && (
                  <div className="mt-6">
                    <label
                      htmlFor="rejection-reason"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Rejection Reason
                    </label>

                    <textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(event) =>
                        setRejectionReason(event.target.value)
                      }
                      placeholder="Explain why this request should be rejected..."
                      rows={4}
                      className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Minimum 10 characters required.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {selectedRequest.status === "Pending" && (
                <div className="border-t border-slate-200 bg-white px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={
                        rejectionReason.trim().length < 10
                      }
                      className="flex-1 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reject Request
                    </button>

                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      Approve Request
                    </button>
                  </div>
                </div>
              )}

              {/* Close button for completed request */}
              {selectedRequest.status !== "Pending" && (
                <div className="border-t border-slate-200 bg-white px-6 py-4">
                  <button
                    type="button"
                    onClick={closeRequestDetails}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast */}
        <Toast
          message={toast}
          onClose={() => setToast("")}
        />
      </div>
    </BrowserRouter>
  )
}

export default App