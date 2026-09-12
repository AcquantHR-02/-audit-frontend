import Link from "next/link";
import { notFound } from "next/navigation";

const reports = [
  {
    id: "RPT-001",
    name: "HR Compliance Audit Report",
    type: "Audit Report",
    audit: "HR Compliance Audit",
    generatedBy: "Rahul Sharma",
    status: "Generated",
    generatedDate: "10 Sep 2026",
  },
  {
    id: "RPT-002",
    name: "Finance Process Audit Report",
    type: "Audit Report",
    audit: "Finance Process Audit",
    generatedBy: "Priya Singh",
    status: "Generated",
    generatedDate: "09 Sep 2026",
  },
  {
    id: "RPT-003",
    name: "IT Security Audit Report",
    type: "Compliance Report",
    audit: "IT Security Audit",
    generatedBy: "Amit Kumar",
    status: "Pending",
    generatedDate: "08 Sep 2026",
  },
  {
    id: "RPT-004",
    name: "Operations Audit Summary",
    type: "Summary Report",
    audit: "Operations Audit",
    generatedBy: "Neha Verma",
    status: "Generated",
    generatedDate: "07 Sep 2026",
  },
  {
    id: "RPT-005",
    name: "Vendor Compliance Report",
    type: "Compliance Report",
    audit: "Vendor Management Audit",
    generatedBy: "Rahul Sharma",
    status: "Generated",
    generatedDate: "06 Sep 2026",
  },
  {
    id: "RPT-006",
    name: "Workplace Safety Audit Report",
    type: "Audit Report",
    audit: "Workplace Safety Audit",
    generatedBy: "Priya Singh",
    status: "Pending",
    generatedDate: "05 Sep 2026",
  },
];

function getStatusClass(status: string) {
  if (status === "Generated") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-gray-100 text-gray-700";
}

type ReportDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReportDetailsPage({
  params,
}: ReportDetailsPageProps) {
  const { id } = await params;

  const report = reports.find(
    (report) => report.id === id
  );

  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* BREADCRUMB */}
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          Dashboard / Reports / {report.id}
        </p>
      </div>

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Report Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View detailed information about this report.
          </p>
        </div>

        <Link
          href="/dashboard/reports"
          className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          ← Back to Reports
        </Link>

      </div>

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* CARD HEADER */}
        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>
              <p className="text-sm font-semibold text-blue-600">
                {report.id}
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {report.name}
              </h2>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                report.status
              )}`}
            >
              {report.status}
            </span>

          </div>

        </div>

        {/* REPORT INFORMATION */}
        <div className="p-6">

          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Report Information
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            {/* REPORT ID */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report ID
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {report.id}
              </p>
            </div>

            {/* REPORT NAME */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report Name
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {report.name}
              </p>
            </div>

            {/* TYPE */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report Type
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {report.type}
              </p>
            </div>

            {/* AUDIT */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Related Audit
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {report.audit}
              </p>
            </div>

            {/* GENERATED BY */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Generated By
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {report.generatedBy}
              </p>
            </div>

            {/* STATUS */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>

            {/* DATE */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Generated Date
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {report.generatedDate}
              </p>
            </div>

          </div>

        </div>

        {/* SUMMARY */}
        <div className="border-t border-slate-200 p-6">

          <h3 className="text-lg font-semibold text-slate-900">
            Report Summary
          </h3>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">

            <p className="text-sm leading-6 text-slate-600">
              This report was generated for the{" "}
              <span className="font-semibold text-slate-900">
                {report.audit}
              </span>{" "}
              and contains relevant audit and compliance
              information. The current report status is{" "}
              <span className="font-semibold text-slate-900">
                {report.status}
              </span>
              .
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}