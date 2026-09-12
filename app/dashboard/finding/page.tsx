"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const findings = [
  {
    id: "FND-001",
    title: "Missing Employee Records",
    audit: "HR Compliance Audit",
    severity: "High",
    assignedTo: "Rahul Sharma",
    status: "Open",
    dueDate: "12 Sep 2026",
  },
  {
    id: "FND-002",
    title: "Incomplete Attendance Register",
    audit: "HR Compliance Audit",
    severity: "Medium",
    assignedTo: "Priya Singh",
    status: "In Progress",
    dueDate: "15 Sep 2026",
  },
  {
    id: "FND-003",
    title: "Delayed Statutory Payment",
    audit: "Finance Process Audit",
    severity: "Critical",
    assignedTo: "Amit Kumar",
    status: "Open",
    dueDate: "10 Sep 2026",
  },
  {
    id: "FND-004",
    title: "Weak Password Policy",
    audit: "IT Security Audit",
    severity: "High",
    assignedTo: "Neha Verma",
    status: "In Progress",
    dueDate: "18 Sep 2026",
  },
  {
    id: "FND-005",
    title: "Missing Vendor Documents",
    audit: "Vendor Management Audit",
    severity: "Medium",
    assignedTo: "Rahul Sharma",
    status: "Resolved",
    dueDate: "05 Sep 2026",
  },
  {
    id: "FND-006",
    title: "Safety Training Not Completed",
    audit: "Workplace Safety Audit",
    severity: "High",
    assignedTo: "Priya Singh",
    status: "Open",
    dueDate: "20 Sep 2026",
  },
  {
    id: "FND-007",
    title: "Expired Compliance Certificate",
    audit: "Factory Compliance Audit",
    severity: "Critical",
    assignedTo: "Amit Kumar",
    status: "Open",
    dueDate: "22 Sep 2026",
  },
  {
    id: "FND-008",
    title: "Incomplete Leave Records",
    audit: "HR Compliance Audit",
    severity: "Low",
    assignedTo: "Neha Verma",
    status: "Resolved",
    dueDate: "25 Sep 2026",
  },
  {
    id: "FND-009",
    title: "Missing Safety Inspection Report",
    audit: "Workplace Safety Audit",
    severity: "High",
    assignedTo: "Rahul Sharma",
    status: "In Progress",
    dueDate: "28 Sep 2026",
  },
  {
    id: "FND-010",
    title: "Incorrect Vendor Tax Details",
    audit: "Vendor Management Audit",
    severity: "Medium",
    assignedTo: "Amit Kumar",
    status: "Resolved",
    dueDate: "30 Sep 2026",
  },
];

/* ================= STATUS ================= */

function getStatusClass(status) {
  if (status === "Open") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "In Progress") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "Resolved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getStatusDot(status) {
  if (status === "Open") {
    return "bg-red-500";
  }

  if (status === "In Progress") {
    return "bg-blue-500";
  }

  if (status === "Resolved") {
    return "bg-emerald-500";
  }

  return "bg-slate-400";
}

/* ================= SEVERITY ================= */

function getSeverityClass(severity) {
  if (severity === "Critical") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (severity === "High") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  if (severity === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (severity === "Low") {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

/* ================= PAGE ================= */

export default function FindingsPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");

  /* ================= FILTER ================= */

  const filteredFindings = useMemo(() => {
    return findings.filter((finding) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        finding.id.toLowerCase().includes(searchText) ||
        finding.title.toLowerCase().includes(searchText) ||
        finding.audit.toLowerCase().includes(searchText) ||
        finding.assignedTo.toLowerCase().includes(searchText);

      const matchesSeverity =
        severity === "All" || finding.severity === severity;

      const matchesStatus =
        status === "All" || finding.status === status;

      const matchesAssigned =
        assignedTo === "All" ||
        finding.assignedTo === assignedTo;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus &&
        matchesAssigned
      );
    });
  }, [search, severity, status, assignedTo]);

  /* ================= SUMMARY ================= */

  const totalFindings = findings.length;

  const openFindings = findings.filter(
    (finding) => finding.status === "Open"
  ).length;

  const inProgressFindings = findings.filter(
    (finding) => finding.status === "In Progress"
  ).length;

  const resolvedFindings = findings.filter(
    (finding) => finding.status === "Resolved"
  ).length;

  const criticalFindings = findings.filter(
    (finding) => finding.severity === "Critical"
  ).length;

  /* ================= RESET ================= */

  function resetFilters() {
    setSearch("");
    setSeverity("All");
    setStatus("All");
    setAssignedTo("All");
  }

  const filtersActive =
    search ||
    severity !== "All" ||
    status !== "All" ||
    assignedTo !== "All";

  return (
    <div className="min-h-screen w-full bg-slate-50 px-3 py-4 sm:px-4 md:px-5 lg:px-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Link
            href="/dashboard"
            className="transition hover:text-blue-600"
          >
            Dashboard
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-600">
            Findings
          </span>
        </div>

        {/* Title Area */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Findings
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage, assign and track audit findings.
            </p>

          </div>

          <Link
            href="/dashboard/finding/create"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            <span className="text-base leading-none">
              +
            </span>

            Add Finding
          </Link>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">

        {/* Total */}
        <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs">
              📋
            </div>

          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalFindings}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            All findings
          </p>

        </div>


        {/* Open */}
        <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Open
            </p>

            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

          </div>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {openFindings}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Requires action
          </p>

        </div>


        {/* In Progress */}
        <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              In Progress
            </p>

            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

          </div>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {inProgressFindings}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Under remediation
          </p>

        </div>


        {/* Resolved */}
        <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Resolved
            </p>

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

          </div>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {resolvedFindings}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Successfully closed
          </p>

        </div>


        {/* Critical */}
        <div className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Critical
            </p>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-xs">
              ⚠️
            </div>

          </div>

          <p className="mt-2 text-2xl font-bold text-orange-600">
            {criticalFindings}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            High priority
          </p>

        </div>

      </div>


      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Card Header */}
        <div className="border-b border-slate-200 px-4 py-3.5">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-bold text-slate-900">
                Findings List
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Review and track all audit findings.
              </p>

            </div>

            <div className="text-[10px] text-slate-500">

              Showing{" "}

              <span className="font-bold text-slate-800">
                {filteredFindings.length}
              </span>

              {" "}of{" "}

              <span className="font-bold text-slate-800">
                {findings.length}
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <div className="border-b border-slate-200 bg-slate-50/60 p-3">

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                🔎
              </span>

              <input
                type="text"
                placeholder="Search findings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Severity */}
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Severities
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>


            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>


            {/* Assigned */}
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">
                All Assignees
              </option>

              <option value="Rahul Sharma">
                Rahul Sharma
              </option>

              <option value="Priya Singh">
                Priya Singh
              </option>

              <option value="Amit Kumar">
                Amit Kumar
              </option>

              <option value="Neha Verma">
                Neha Verma
              </option>
            </select>

          </div>


          {/* Filter Bottom */}
          <div className="mt-2 flex items-center justify-between">

            <div className="text-[10px]">

              {filtersActive ? (
                <span className="font-semibold text-blue-600">
                  ● Filters Active
                </span>
              ) : (
                <span className="text-slate-400">
                  No filters applied
                </span>
              )}

            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Reset Filters
            </button>

          </div>

        </div>


        {/* =================================================
            DESKTOP TABLE
            lg and above
        ================================================= */}

        <div className="hidden lg:block">

          <table className="w-full table-fixed">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50/80">

                <th className="w-[10%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  ID
                </th>

                <th className="w-[21%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Finding
                </th>

                <th className="w-[18%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Audit
                </th>

                <th className="w-[11%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Severity
                </th>

                <th className="w-[15%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Assigned
                </th>

                <th className="w-[12%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="w-[9%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Due Date
                </th>

                <th className="w-[4%] px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  -
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {filteredFindings.length > 0 ? (

                filteredFindings.map((finding) => (

                  <tr
                    key={finding.id}
                    className="group transition hover:bg-blue-50/30"
                  >

                    {/* ID */}
                    <td className="px-3 py-3">

                      <Link
                        href={`/dashboard/finding/${finding.id}`}
                        className="font-semibold text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {finding.id}
                      </Link>

                    </td>


                    {/* Finding */}
                    <td className="px-3 py-3">

                      <p
                        title={finding.title}
                        className="truncate text-xs font-semibold text-slate-800"
                      >
                        {finding.title}
                      </p>

                    </td>


                    {/* Audit */}
                    <td className="px-3 py-3">

                      <p
                        title={finding.audit}
                        className="truncate text-xs text-slate-500"
                      >
                        {finding.audit}
                      </p>

                    </td>


                    {/* Severity */}
                    <td className="px-3 py-3">

                      <span
                        className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${getSeverityClass(
                          finding.severity
                        )}`}
                      >
                        {finding.severity}
                      </span>

                    </td>


                    {/* Assigned */}
                    <td className="min-w-0 px-3 py-3">

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600">
                          {finding.assignedTo
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>

                        <span
                          title={finding.assignedTo}
                          className="truncate text-xs text-slate-600"
                        >
                          {finding.assignedTo}
                        </span>

                      </div>

                    </td>


                    {/* Status */}
                    <td className="px-3 py-3">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                          finding.status
                        )}`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            finding.status
                          )}`}
                        />

                        {finding.status}

                      </span>

                    </td>


                    {/* Due Date */}
                    <td className="whitespace-nowrap px-3 py-3">

                      <span className="text-xs text-slate-500">
                        {finding.dueDate}
                      </span>

                    </td>


                    {/* Action */}
                    <td className="px-2 py-3 text-center">

                      <Link
                        href={`/dashboard/finding/${finding.id}`}
                        title="View finding"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        →
                      </Link>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="px-4 py-14 text-center"
                  >

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      🔎
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      No findings found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            MOBILE / TABLET CARDS
            lg se chhoti screen
        ================================================= */}

        <div className="grid grid-cols-1 gap-3 p-3 lg:hidden">

          {filteredFindings.length > 0 ? (

            filteredFindings.map((finding) => (

              <div
                key={finding.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-blue-200 hover:shadow-sm"
              >

                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <Link
                      href={`/dashboard/finding/${finding.id}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      {finding.id}
                    </Link>

                    <h3 className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {finding.title}
                    </h3>

                  </div>

                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold ${getSeverityClass(
                      finding.severity
                    )}`}
                  >
                    {finding.severity}
                  </span>

                </div>


                {/* Card Details */}
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3">

                  <div className="min-w-0">

                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Audit
                    </p>

                    <p className="mt-1 break-words text-xs text-slate-600">
                      {finding.audit}
                    </p>

                  </div>


                  <div className="min-w-0">

                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Assigned To
                    </p>

                    <p className="mt-1 break-words text-xs text-slate-600">
                      {finding.assignedTo}
                    </p>

                  </div>


                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-semibold ${getStatusClass(
                        finding.status
                      )}`}
                    >

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                          finding.status
                        )}`}
                      />

                      {finding.status}

                    </span>

                  </div>


                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Due Date
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {finding.dueDate}
                    </p>

                  </div>

                </div>


                {/* Card Footer */}
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">

                  <Link
                    href={`/dashboard/finding/${finding.id}`}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View Finding →
                  </Link>

                </div>

              </div>

            ))

          ) : (

            <div className="px-4 py-12 text-center">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                🔎
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No findings found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex flex-col gap-1.5 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-slate-400">
            Audit Management System • Findings
          </p>

          <p className="text-[10px] text-slate-400">
            {filteredFindings.length} result
            {filteredFindings.length !== 1 ? "s" : ""}
          </p>

        </div>

      </div>

    </div>
  );
}