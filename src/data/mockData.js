export const catalog = [
  {
    id: "app_1",
    name: "AWS Security Hub",
    category: "Cloud",
    description:
      "Read-only access to inspect security findings and alerts.",
    risk: "Low",
    recommended: true,
    recommendationReason:
      "85% of your team members use this tool.",
  },
  {
    id: "app_2",
    name: "GitHub Enterprise",
    category: "Developer Tools",
    description:
      "Write and pull-request permissions on core repositories.",
    risk: "Medium",
    recommended: true,
    recommendationReason:
      "Standard requirement for development tasks.",
  },
  {
    id: "app_3",
    name: "Production Database Admin",
    category: "Cloud",
    description:
      "Direct read/write query access to production clusters.",
    risk: "High",
    recommended: false,
    recommendationReason: null,
  },
  {
    id: "app_4",
    name: "Financial ERP Ledger",
    category: "Business Apps",
    description:
      "Posting ledger entries and reviewing accounting balances.",
    risk: "High",
    recommended: false,
    recommendationReason: null,
  },
]

export const initialRequests = [
  {
    id: "req_101",
    requesterName: "Priya Sharma",
    role: "Cloud DevOps Engineer",
    tool: "AWS Security Hub",
    duration: "8 Hours (1 Day)",
    justification:
      "Investigating cloud firewall alerts on test cluster.",
    risk: "Low",
    status: "Pending",
    complianceNote:
      "Safe request: Matches standard role permissions.",
  },

  {
    id: "req_102",
    requesterName: "Alex Morgan",
    role: "Financial Analyst",
    tool: "Production Database Admin",
    duration: "30 Days",
    justification:
      "Need raw SQL query access to pull custom reports.",
    risk: "High",
    status: "Pending",
    complianceNote:
      "Warning: High privilege request outside normal department baseline.",
  },
]