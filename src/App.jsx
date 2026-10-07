import { useState } from "react"

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

import { initialRequests } from "./data/mockData.js"

function App() {
  const [requests, setRequests] = useState(initialRequests)

  const [toast, setToast] = useState("")

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

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-8">

          <Routes>

            <Route
              path="/"
              element={
                <Navigate
                  to="/catalog"
                  replace
                />
              }
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
                />
              }
            />

          </Routes>

        </main>

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