import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Catalog from "./pages/Catalog.jsx";
import Inbox from "./pages/Inbox.jsx";
import Navbar from "./components/Navbar.jsx";
import Toast from "./components/Toast.jsx";

function AppContent() {
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: "", type: "success" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Catalog onToast={showToast} />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <>
                <Navbar />
                <Inbox onToast={showToast} />
              </>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
