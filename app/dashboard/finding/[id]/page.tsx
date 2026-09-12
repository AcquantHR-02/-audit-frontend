import Link from "next/link";
import { notFound } from "next/navigation";

const findings = [
  {
    id: "FND-001",
    title: "Missing Employee Records",
    audit: "HR Compliance Audit",
    department: "Human Resources",
    severity: "High",
    assignedTo: "Rahul Sharma",
    status: "Open",
    dueDate: "12 Sep 2026",
    description:
      "Required employee records were not maintained properly and some employee documents were missing during the audit.",
    recommendation:
      "Ensure all employee records are properly maintained and updated in the required format.",
  },
  {
    id: "FND-002",
    title: "Incomplete Attendance Register",
    audit: "HR Compliance Audit",
    department: "Human Resources",
    severity: "Medium",
    assignedTo: "Priya Singh",
    status: "In Progress",
    dueDate: "15 Sep 2026",
    description:
      "The attendance register contains incomplete entries for several employees.",
    recommendation:
      "Update the attendance register and ensure daily attendance is recorded correctly.",
  },
  {
    id: "FND-003",
    title: "Delayed Statutory Payment",
    audit: "Finance Process Audit",
    department: "Finance",
    severity: "Critical",
    assignedTo: "Amit Kumar",
    status: "Open",
    dueDate: "10 Sep 2026",
    description:
      "A statutory payment was not completed within the required timeline.",
    recommendation:
      "Create a proper compliance payment tracking process to avoid future delays.",
  },
  {
    id: "FND-004",
    title: "Weak Password Policy",
    audit: "IT Security Audit",
    department: "Information Technology",
    severity: "High",
    assignedTo: "Neha Verma",
    status: "In Progress",
    dueDate: "18 Sep 2026",
    description:
      "The current password policy does not enforce sufficient password complexity.",
    recommendation:
      "Implement stronger password complexity and password rotation requirements.",
  },
  {
    id: "FND-005",
    title: "Missing Vendor Documents",
    audit: "Vendor Management Audit",
    department: "Procurement",
    severity: "Medium",
    assignedTo: "Rahul Sharma",
    status: "Resolved",
    dueDate: "05 Sep 2026",
    description:
      "Required documents for some vendors were not available during the audit.",
    recommendation:
      "Maintain a complete vendor documentation checklist and review it periodically.",
  },
  {
    id: "FND-006",
    title: "Safety Training Not Completed",
    audit: "Workplace Safety Audit",
    department: "Operations",
    severity: "High",
    assignedTo: "Priya Singh",
    status: "Open",
    dueDate: "20 Sep 2026",
    description:
      "Some employees have not completed mandatory workplace safety training.",
    recommendation:
      "Schedule mandatory safety training and maintain completion records.",
  },
  {
    id: "FND-007",
    title: "Expired Compliance Certificate",
    audit: "Factory Compliance Audit",
    department: "Compliance",
    severity: "Critical",
    assignedTo: "Amit Kumar",
    status: "Open",
    dueDate: "22 Sep 2026",
    description:
      "A required compliance certificate was found to be expired.",
    recommendation:
      "Renew the certificate immediately and implement expiry reminders.",
  },
  {
    id: "FND-008",
    title: "Incomplete Leave Records",
    audit: "HR Compliance Audit",
    department: "Human Resources",
    severity: "Low",
    assignedTo: "Neha Verma",
    status: "Resolved",
    dueDate: "25 Sep 2026",
    description:
      "Some employee leave records were incomplete or missing required information.",
    recommendation:
      "Regularly review leave records and ensure all leave transactions are updated.",
  },
  {
    id: "FND-009",
    title: "Missing Safety Inspection Report",
    audit: "Workplace Safety Audit",
    department: "Operations",
    severity: "High",
    assignedTo: "Rahul Sharma",
    status: "In Progress",
    dueDate: "28 Sep 2026",
    description:
      "The latest workplace safety inspection report was not available.",
    recommendation:
      "Complete the inspection and maintain inspection reports in the compliance repository.",
  },
  {
    id: "FND-010",
    title: "Incorrect Vendor Tax Details",
    audit: "Vendor Management Audit",
    department: "Finance",
    severity: "Medium",
    assignedTo: "Amit Kumar",
    status: "Resolved",
    dueDate: "30 Sep 2026",
    description:
      "Incorrect tax information was found in vendor records.",
    recommendation:
      "Verify vendor tax information and update incorrect records.",
  },
];

function getSeverityClass(severity) {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "High":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-700 border-red-200";
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Resolved":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default async function FindingDetails({ params }) {
  const { id } = await params;

  const finding = findings.find(
    (item) => item.id.toLowerCase() === id.toLowerCase()
  );

  if (!finding) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">
      {/* Breadcrumb */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-slate-500 hover:text-blue-600"
        >
          Dashboard
        </Link>

        <span className="text-slate-400">/</span>

        <Link
          href="/dashboard/finding"
          className="text-slate-500 hover:text-blue-600"
        >
          Findings
        </Link>

        <span className="text-slate-400">/</span>

        <span className="font-medium text-slate-700">{finding.id}</span>
      </div>

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              {finding.id}
            </span>

            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${getSeverityClass(
                finding.severity
              )}`}
            >
              {finding.severity}
            </span>

            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                finding.status
              )}`}
            >
              {finding.status}
            </span>
          </div>

          <h1 className="break-words text-xl font-bold text-slate-900 md:text-2xl">
            {finding.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Finding details and audit information
          </p>
        </div>

        <Link
          href="/dashboard/finding"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ← Back to Findings
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-5 lg:col-span-2">
          {/* Finding Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Finding Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Finding ID
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {finding.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Finding Title
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {finding.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Audit
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {finding.audit}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Department
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {finding.department}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Assigned To
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {finding.assignedTo}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Due Date
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {finding.dueDate}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Description
              </h2>
            </div>

            <div className="p-5">
              <p className="break-words text-sm leading-6 text-slate-600">
                {finding.description}
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Recommendation
              </h2>
            </div>

            <div className="p-5">
              <p className="break-words text-sm leading-6 text-slate-600">
                {finding.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Finding Status
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-md border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                    finding.status
                  )}`}
                >
                  {finding.status}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Severity
                </p>

                <span
                  className={`mt-2 inline-flex rounded-md border px-3 py-1.5 text-xs font-semibold ${getSeverityClass(
                    finding.severity
                  )}`}
                >
                  {finding.severity}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Due Date
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {finding.dueDate}
                </p>
              </div>
            </div>
          </div>

          {/* Audit */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Audit Information
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Audit Name
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {finding.audit}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {finding.department}
                </p>
              </div>

              <Link
                href="/dashboard/audits"
                className="block rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Audits
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Audit Management System • Finding Details
      </div>
    </div>
  );
}