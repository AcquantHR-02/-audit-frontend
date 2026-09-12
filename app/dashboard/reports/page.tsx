"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

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

function getStatusClass(status) {
  if (status === "Generated") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "Pending") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getTypeClass(type) {
  if (type === "Audit Report") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (type === "Compliance Report") {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (type === "Summary Report") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [audit, setAudit] = useState("All");

  // Unique report types
  const typeOptions = [...new Set(reports.map((report) => report.type))];

  // Unique audits
  const auditOptions = [...new Set(reports.map((report) => report.audit))];

  // ================= FILTER LOGIC =================

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        report.id.toLowerCase().includes(searchText) ||
        report.name.toLowerCase().includes(searchText) ||
        report.type.toLowerCase().includes(searchText) ||
        report.audit.toLowerCase().includes(searchText) ||
        report.generatedBy.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || report.status === status;

      const matchesType =
        type === "All" || report.type === type;

      const matchesAudit =
        audit === "All" || report.audit === audit;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesAudit
      );
    });
  }, [search, status, type, audit]);

  // ================= SUMMARY =================

  const totalReports = reports.length;

  const generatedReports = reports.filter(
    (report) => report.status === "Generated"
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  // ================= RESET =================

  const filtersActive =
    search !== "" ||
    status !== "All" ||
    type !== "All" ||
    audit !== "All";

  function resetFilters() {
    setSearch("");
    setStatus("All");
    setType("All");
    setAudit("All");
  }

  // ================= ACTIONS =================

  function handleView(report) {
    alert(`Opening ${report.name}`);
  }

  function handleDownload(report) {
    if (report.status === "Pending") {
      alert("This report is still pending and cannot be downloaded.");
      return;
    }

    alert(`Downloading ${report.name}`);
  }
return (
  <div className="min-h-screen overflow-x-hidden bg-slate-50 p-4 md:p-5">

    {/* =====================================================
        PAGE HEADER
    ====================================================== */}

    <div className="mb-5">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <span>Dashboard</span>

        <span>/</span>

        <span className="font-medium text-slate-700">
          Reports
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage audit and compliance reports.
          </p>
        </div>

        {/* Report status indicator */}
        <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-green-500" />

          <span className="text-xs font-semibold text-slate-600">
            {generatedReports} reports ready
          </span>
        </div>
      </div>
    </div>

    {/* =====================================================
        SUMMARY CARDS
    ====================================================== */}

    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

      {/* TOTAL */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Reports
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalReports}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              All available reports
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <svg
              className="h-5 w-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* GENERATED */}
      <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Generated
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {generatedReports}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Reports ready to view
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* PENDING */}
      <div className="rounded-xl border border-yellow-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {pendingReports}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Waiting to be generated
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* =====================================================
        MAIN REPORT CARD
    ====================================================== */}

    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}
      <div className="border-b border-slate-200 px-4 py-4 md:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Report List
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Search, filter and manage available reports.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredReports.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {totalReports}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="border-b border-slate-200 bg-slate-50/70 p-4 md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">

          {/* SEARCH */}
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Search Reports
            </label>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, name, audit or person..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Status</option>
              <option value="Generated">Generated</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Report Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Types</option>

              {typeOptions.map((typeName) => (
                <option key={typeName} value={typeName}>
                  {typeName}
                </option>
              ))}
            </select>
          </div>

          {/* AUDIT */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Related Audit
            </label>

            <select
              value={audit}
              onChange={(e) => setAudit(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Audits</option>

              {auditOptions.map((auditName) => (
                <option key={auditName} value={auditName}>
                  {auditName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FILTER FOOTER */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            {filtersActive
              ? "Filters are currently active."
              : "No filters applied."}
          </div>

          {filtersActive && (
            <button
              onClick={resetFilters}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          DESKTOP TABLE
      ====================================================== */}

      <div className="hidden lg:block">
        <table className="w-full table-fixed">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left">

              <th className="w-[9%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                ID
              </th>

              <th className="w-[20%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Report Name
              </th>

              <th className="w-[14%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="w-[19%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Related Audit
              </th>

              <th className="w-[14%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Generated By
              </th>

              <th className="w-[10%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="w-[14%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* =================================================
                      ID - CLICKABLE
                  ================================================== */}
                  <td className="px-3 py-3 align-top">
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {report.id}
                    </Link>
                  </td>

                  {/* NAME */}
                  <td className="px-3 py-3 align-top">
                    <p
                      title={report.name}
                      className="break-words text-xs font-semibold leading-5 text-slate-800"
                    >
                      {report.name}
                    </p>
                  </td>

                  {/* TYPE */}
                  <td className="px-3 py-3 align-top">
                    <span
                      className={`inline-flex max-w-full rounded-md border px-2 py-1 text-[10px] font-semibold leading-4 ${getTypeClass(
                        report.type
                      )}`}
                    >
                      {report.type}
                    </span>
                  </td>

                  {/* AUDIT */}
                  <td className="px-3 py-3 align-top">
                    <p className="break-words text-xs text-slate-600">
                      {report.audit}
                    </p>
                  </td>

                  {/* GENERATED BY */}
                  <td className="px-3 py-3 align-top">
                    <p className="break-words text-xs font-medium text-slate-700">
                      {report.generatedBy}
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="px-3 py-3 align-top">
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-3 py-3 align-top">
                    <p className="text-xs text-slate-500">
                      {report.generatedDate}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      No reports found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE / TABLET CARDS
      ====================================================== */}

      <div className="divide-y divide-slate-200 lg:hidden">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 transition hover:bg-slate-50"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  {/* CLICKABLE ID */}
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {report.id}
                  </Link>

                  <h3 className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {report.name}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              {/* TYPE */}
              <div className="mt-3">
                <span
                  className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${getTypeClass(
                    report.type
                  )}`}
                >
                  {report.type}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Related Audit
                  </p>

                  <p className="mt-1 break-words text-xs font-medium text-slate-700">
                    {report.audit}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Generated By
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {report.generatedBy}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Generated Date
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {report.generatedDate}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">

                <button
                  onClick={() => handleView(report)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  View
                </button>

                <button
                  onClick={() => handleDownload(report)}
                  disabled={report.status === "Pending"}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    report.status === "Pending"
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Download
                </button>

              </div>
            </div>
          ))
        ) : (
          <div className="px-5 py-12 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-700">
              No reports found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 md:px-5">
        <div className="flex flex-col gap-1 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Audit Management System • Reports
          </span>

          <span>
            {filteredReports.length} report
            {filteredReports.length !== 1 ? "s" : ""} displayed
          </span>

        </div>
      </div>

    </div>
  </div>
)};