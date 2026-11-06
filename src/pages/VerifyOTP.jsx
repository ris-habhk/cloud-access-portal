
import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../Context/AuthContext.jsx";

import { API_BASE_URL } from "../services/api.js";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const { setSession } = useAuth();

  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "registration";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  async function handleVerify(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        purpose === "login"
          ? "/auth/login/verify-otp"
          : "/auth/verify-registration";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "OTP verification failed."
        );
      }

      if (purpose === "login") {
        const token = result.data?.accessToken;
        const user = result.data?.user;

        if (!token || !user) {
          throw new Error("Login response is incomplete.");
        }

        setSession(token, user);

        navigate("/catalog", { replace: true });
      } else {
        setMessage(result.message);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            purpose,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to resend OTP."
        );
      }

      setMessage(result.message);
    } catch (err) {
      setError(err.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            C
          </div>

          <h1 className="text-2xl font-bold text-white">
            {purpose === "login"
              ? "Verify your login"
              : "Verify your email"}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Enter the 6-digit verification code sent to
          </p>

          <p className="mt-1 text-sm font-medium text-blue-400">
            {email}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Verification code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center text-xl tracking-[0.5em] text-white outline-none placeholder:text-slate-500 placeholder:tracking-normal focus:border-blue-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="mt-5 w-full text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          Resend verification code
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link
            to={purpose === "login" ? "/login" : "/register"}
            className="text-blue-400 hover:text-blue-300"
          >
            {purpose === "login"
              ? "Back to login"
              : "Back to registration"}
          </Link>
        </p>

      </div>
    </div>
  );
}
