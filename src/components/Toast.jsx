function Toast({ message, onClose }) {
  if (!message) {
    return null
  }

  return (
    <div className="fixed right-6 top-6 z-[100] flex items-center gap-3 rounded-lg border border-green-200 bg-white px-5 py-4 shadow-lg">
      
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
        ✓
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          Success
        </p>

        <p className="text-sm text-slate-600">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="ml-3 text-slate-400 hover:text-slate-700"
        aria-label="Close notification"
      >
        ×
      </button>

    </div>
  )
}

export default Toast