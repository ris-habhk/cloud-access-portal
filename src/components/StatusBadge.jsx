
import { CheckCircle2, Clock3, XCircle } from "lucide-react"

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
}

const statusIcons = {
  Pending: Clock3,
  Approved: CheckCircle2,
  Rejected: XCircle,
}

function StatusBadge({ status, showIcon = false }) {
  const Icon = statusIcons[status] || Clock3

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || statusStyles.Pending
      }`}
    >
      {showIcon && <Icon size={14} aria-hidden="true" />}
      {status || "Pending"}
    </span>
  )
}

export default StatusBadge
