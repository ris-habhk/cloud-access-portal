
import { ShieldCheck } from "lucide-react"

const riskStyles = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
}

function RiskBadge({ risk, showIcon = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        riskStyles[risk] || riskStyles.Medium
      }`}
    >
      {showIcon && <ShieldCheck size={14} aria-hidden="true" />}
      {risk || "Medium"} Risk
    </span>
  )
}

export default RiskBadge
