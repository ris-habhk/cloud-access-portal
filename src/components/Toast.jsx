
import { useEffect } from "react"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(() => {
      onClose()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [message, type, onClose])

  if (!message) return null

  const isError = type === "error"

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-[100] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border bg-white px-4 py-4 shadow-lg sm:right-6 sm:top-6 ${
        isError
          ? "border-red-200"
          : "border-green-200"
      }`}
    >
      {isError ? (
        <AlertCircle
          className="h-8 w-8 shrink-0 text-red-600"
          aria-hidden="true"
        />
      ) : (
        <CheckCircle2
          className="h-8 w-8 shrink-0 text-green-600"
          aria-hidden="true"
        />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {isError ? "Error" : "Success"}
        </p>

        <p className="break-words text-sm text-slate-600">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close notification"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

export default Toast
