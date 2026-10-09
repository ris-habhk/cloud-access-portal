
import { useCallback, useEffect, useState } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Navbar from "./components/Navbar.jsx"
import Toast from "./components/Toast.jsx"
import Catalog from "./pages/Catalog.jsx"
import Inbox from "./pages/Inbox.jsx"
import RequestDetailsDrawer from "./components/RequestDetailsDrawer.jsx"
import { initialRequests } from "./data/mockData.js"

function loadRequests() {
  try {
    const savedRequests = localStorage.getItem("cloudAccessRequests")

    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests)

      if (Array.isArray(parsedRequests)) {
        return parsedRequests
      }
    }
  } catch (error) {
    console.error("Failed to load saved requests:", error)
  }

  return initialRequests
}

function App() {
  const [requests, setRequests] = useState(loadRequests)
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  })
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length

  const closeToast = useCallback(() => {
    setToast({
      message: "",
      type: "success",
    })
  }, [])

  const closeRequestDetails = useCallback(() => {
    setSelectedRequest(null)
    setRejectionReason("")
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        "cloudAccessRequests",
        JSON.stringify(requests)
      )
    } catch (error) {
      console.error("Failed to save requests:", error)
    }
  }, [requests])

  const handleRequestSubmitted = useCallback((newRequest) => {
    setRequests((currentRequests) => [
      newRequest,
      ...currentRequests,
    ])

    setToast({
      message: "Access request submitted successfully.",
      type: "success",
    })
  }, [])

  const handleViewRequest = useCallback((request) => {
    setSelectedRequest(request)
    setRejectionReason("")
  }, [])

  const handleApprove = useCallback(() => {
    if (!selectedRequest) return

    const requestId = selectedRequest.id

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: "Approved" }
          : request
      )
    )

    setSelectedRequest((currentRequest) => ({
      ...currentRequest,
      status: "Approved",
    }))

    setToast({
      message: "Access request approved.",
      type: "success",
    })
  }, [selectedRequest])

  const handleReject = useCallback(() => {
    if (!selectedRequest) return

    const trimmedReason = rejectionReason.trim()

    if (trimmedReason.length < 10) {
      setToast({
        message: "Please enter a rejection reason of at least 10 characters.",
        type: "error",
      })
      return
    }

    const requestId = selectedRequest.id

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "Rejected",
              rejectionReason: trimmedReason,
            }
          : request
      )
    )

    setSelectedRequest((currentRequest) => ({
      ...currentRequest,
      status: "Rejected",
      rejectionReason: trimmedReason,
    }))

    setToast({
      message: "Access request rejected.",
      type: "success",
    })
  }, [selectedRequest, rejectionReason])

  const handleResetDemo = useCallback(() => {
    const confirmed = window.confirm(
      "Reset the demo? This will replace all saved requests with the original two demo requests."
    )

    if (!confirmed) return

    setRequests(initialRequests)
    setSelectedRequest(null)
    setRejectionReason("")

    setToast({
      message: "Demo data has been reset.",
      type: "success",
    })
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar pendingCount={pendingCount} />

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/catalog" replace />}
          />

          <Route
            path="/catalog"
            element={
              <Catalog
                onRequestSubmitted={handleRequestSubmitted}
              />
            }
          />

          <Route
            path="/inbox"
            element={
              <Inbox
                requests={requests}
                onViewRequest={handleViewRequest}
                onResetDemo={handleResetDemo}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/catalog" replace />}
          />
        </Routes>

        <RequestDetailsDrawer
          request={selectedRequest}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onClose={closeRequestDetails}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
