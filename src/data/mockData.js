
export const currentUser = {
  name: "Rishabh Kumar",
  role: "Security Engineer",
  department: "Infrastructure",
}

export const catalog = [
  {
    id: "aws-security-hub",
    name: "AWS Security Hub",
    category: "Cloud",
    risk: "Low",
    recommended: true,
    recommendationReason:
      "85% of your team members use this tool.",
    description:
      "Monitor your cloud security posture and identify potential security issues across AWS resources.",
  },
  {
    id: "github-enterprise",
    name: "GitHub Enterprise",
    category: "Developer Tools",
    risk: "Medium",
    recommended: true,
    recommendationReason:
      "Standard requirement for development tasks.",
    description:
      "Collaborate on code, manage repositories, and support secure software development workflows.",
  },
  {
    id: "production-database-admin",
    name: "Production Database Admin",
    category: "Cloud",
    risk: "High",
    recommended: false,
    recommendationReason: "",
    description:
      "Manage production database configurations, access controls, and administrative operations.",
  },
  {
    id: "financial-erp-ledger",
    name: "Financial ERP Ledger",
    category: "Business Apps",
    risk: "High",
    recommended: false,
    recommendationReason: "",
    description:
      "Access enterprise financial records, ledger information, and accounting workflows.",
  },
]

export const initialRequests = [
  {
    id: "req_1001",
    requesterName: "Priya Sharma",
    role: "Cloud DevOps Engineer",
    tool: "AWS Security Hub",
    duration: "8 Hours (1 Day)",
    justification:
      "I need access to review cloud security findings and investigate potential configuration issues.",
    risk: "Low",
    status: "Pending",
    requestDate: "05 Oct 2026",
    complianceNote:
      "Safe request: Matches standard role permissions.",
  },
  {
    id: "req_1002",
    requesterName: "Alex Morgan",
    role: "Financial Analyst",
    tool: "Production Database Admin",
    duration: "30 Days",
    justification:
      "I need access to investigate database records required for a financial reconciliation task.",
    risk: "High",
    status: "Pending",
    requestDate: "04 Oct 2026",
    complianceNote:
      "Warning: High privilege request outside normal department baseline.",
  },
]
