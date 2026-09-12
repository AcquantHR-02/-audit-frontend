import Link from "next/link";
import { notFound } from "next/navigation";

const complianceRecords = [
  {
    id: "CMP-001",
    act: "Shops and Establishments Act",
    category: "Registration",
    state: "Karnataka",
    status: "Compliant",
    dueDate: "15 Sep 2026",
  },
  {
    id: "CMP-002",
    act: "Payment of Wages Act",
    category: "Returns",
    state: "Karnataka",
    status: "Due Soon",
    dueDate: "20 Sep 2026",
  },
  {
    id: "CMP-003",
    act: "Factories Act",
    category: "Registers",
    state: "Maharashtra",
    status: "Compliant",
    dueDate: "25 Sep 2026",
  },
  {
    id: "CMP-004",
    act: "Contract Labour Act",
    category: "Registration",
    state: "Delhi",
    status: "Overdue",
    dueDate: "05 Sep 2026",
  },
  {
    id: "CMP-005",
    act: "Minimum Wages Act",
    category: "Remittance",
    state: "Karnataka",
    status: "Compliant",
    dueDate: "30 Sep 2026",
  },
  {
    id: "CMP-006",
    act: "Employees' Provident Funds Act",
    category: "Returns",
    state: "Tamil Nadu",
    status: "Due Soon",
    dueDate: "02 Oct 2026",
  },
  {
    id: "CMP-007",
    act: "Payment of Bonus Act",
    category: "Returns",
    state: "Karnataka",
    status: "Compliant",
    dueDate: "05 Oct 2026",
  },
  {
    id: "CMP-008",
    act: "Payment of Gratuity Act",
    category: "Registers",
    state: "Maharashtra",
    status: "Overdue",
    dueDate: "08 Oct 2026",
  },
  {
    id: "CMP-009",
    act: "Maternity Benefit Act",
    category: "Registers",
    state: "Delhi",
    status: "Compliant",
    dueDate: "12 Oct 2026",
  },
  {
    id: "CMP-010",
    act: "Equal Remuneration Act",
    category: "Returns",
    state: "Tamil Nadu",
    status: "Due Soon",
    dueDate: "15 Oct 2026",
  },
];

function getStatusClass(status) {
  if (status === "Compliant") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "Due Soon") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (status === "Overdue") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function getStatusDot(status) {
  if (status === "Compliant") {
    return "bg-emerald-500";
  }

  if (status === "Due Soon") {
    return "bg-amber-500";
  }

  if (status === "Overdue") {
    return "bg-red-500";
  }

  return "bg-slate-400";
}

export default async function ComplianceDetailsPage({ params }) {
  const { id } = await params;

  const record = complianceRecords.find(
    (record) => record.id === id
  );

  if (!record) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">

      {/* HEADER */}
      <div className="mb-5">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/dashboard"
            className="transition hover:text-blue-600"
          >
            Dashboard
          </Link>

          <span>/</span>

          <Link
            href="/dashboard/compliance"
            className="transition hover:text-blue-600"
          >
            Compliance
          </Link>

          <span>/</span>

          <span className="text-slate-700">
            {record.id}
          </span>
        </div>

        {/* TITLE AREA */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Compliance Details
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              View statutory compliance requirement details.
            </p>
          </div>

          <Link
            href="/dashboard/compliance"
            className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            ← Back to Compliance
          </Link>

        </div>
      </div>

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

        {/* CARD HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            {/* ICON */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
              📋
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Compliance ID
              </p>

              <h2 className="mt-0.5 text-base font-bold text-slate-900">
                {record.id}
              </h2>
            </div>

          </div>

          {/* STATUS */}
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
              record.status
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                record.status
              )}`}
            ></span>

            {record.status}
          </span>

        </div>

        {/* CONTENT */}
        <div className="p-4">

          {/* ACT TITLE */}
          <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Applicable Act
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {record.act}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Statutory compliance requirement
            </p>

          </div>

          {/* KEY INFORMATION */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Compliance Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {/* CATEGORY */}
              <div className="rounded-md border border-slate-200 p-3">
                <p className="text-[10px] font-medium text-slate-400">
                  Category
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {record.category}
                </p>
              </div>

              {/* STATE */}
              <div className="rounded-md border border-slate-200 p-3">
                <p className="text-[10px] font-medium text-slate-400">
                  State
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {record.state}
                </p>
              </div>

              {/* DUE DATE */}
              <div className="rounded-md border border-slate-200 p-3">
                <p className="text-[10px] font-medium text-slate-400">
                  Due Date
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {record.dueDate}
                </p>
              </div>

              {/* STATUS */}
              <div className="rounded-md border border-slate-200 p-3">
                <p className="text-[10px] font-medium text-slate-400">
                  Current Status
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {record.status}
                </p>
              </div>

            </div>
          </div>

          {/* SUMMARY */}
          <div className="mt-5">

            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Compliance Summary
            </h3>

            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">

              <div className="flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-sm">
                  ℹ
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Requirement Overview
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600">
                    This compliance requirement belongs to the{" "}
                    <span className="font-semibold text-slate-800">
                      {record.category}
                    </span>{" "}
                    category under the{" "}
                    <span className="font-semibold text-slate-800">
                      {record.act}
                    </span>{" "}
                    applicable in{" "}
                    <span className="font-semibold text-slate-800">
                      {record.state}
                    </span>
                    .
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* COMPLIANCE STATUS */}
          <div className="mt-5">

            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Status Information
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              <div className="rounded-md bg-emerald-50 p-3">
                <p className="text-[10px] font-medium text-emerald-600">
                  Current Status
                </p>

                <p className="mt-1 text-xs font-bold text-emerald-700">
                  {record.status}
                </p>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-[10px] font-medium text-slate-500">
                  Compliance Category
                </p>

                <p className="mt-1 text-xs font-bold text-slate-700">
                  {record.category}
                </p>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-[10px] font-medium text-slate-500">
                  Applicable State
                </p>

                <p className="mt-1 text-xs font-bold text-slate-700">
                  {record.state}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-slate-400">
            Compliance ID: {record.id}
          </p>

          <div className="flex gap-2">

            <Link
              href="/dashboard/compliance"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Back
            </Link>

            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-blue-700"
            >
              Update Compliance
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}