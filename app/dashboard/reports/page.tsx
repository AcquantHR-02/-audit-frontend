"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";

/* =========================================================
   REPORT TYPE
========================================================= */

interface Report {
  id: string;
  name: string;
  type: string;
  audit: string;
  generatedBy: string;
  status: string;
  generatedDate: string;
}

/* =========================================================
   DUMMY REPORT DATA
========================================================= */

const reports: Report[] = [
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

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusClass(status: string, theme: string) {
  const isDark = theme === "dark";

  switch (status?.toLowerCase()) {
    case "generated":
      return isDark
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "pending":
      return isDark
        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
        : "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return isDark
        ? "border-slate-600 bg-slate-700 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-700";
  }
}

/* =========================================================
   STATUS DOT
========================================================= */

function getStatusDot(status: string) {
  switch (status?.toLowerCase()) {
    case "generated":
      return "bg-emerald-500";

    case "pending":
      return "bg-amber-500";

    default:
      return "bg-slate-400";
  }
}

/* =========================================================
   TYPE STYLE
========================================================= */

function getTypeClass(type: string, theme: string) {
  const isDark = theme === "dark";

  switch (type?.toLowerCase()) {
    case "audit report":
      return isDark
        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
        : "border-blue-200 bg-blue-50 text-blue-700";

    case "compliance report":
      return isDark
        ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
        : "border-purple-200 bg-purple-50 text-purple-700";

    case "summary report":
      return isDark
        ? "border-slate-600 bg-slate-700 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-700";

    default:
      return isDark
        ? "border-slate-600 bg-slate-700 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-700";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function ReportsPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  /* =======================================================
     FILTER STATES
  ======================================================= */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [audit, setAudit] = useState("All");

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const statusOptions = useMemo(() => {
    return ["All", "Generated", "Pending"];
  }, []);

  const typeOptions = useMemo(() => {
    return [
      "All",
      "Audit Report",
      "Compliance Report",
      "Summary Report",
    ];
  }, []);

  const auditOptions = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(reports.map((report) => report.audit))),
    ];
  }, []);

  /* =======================================================
     FILTERED REPORTS
  ======================================================= */

  const filteredReports = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !searchText ||
        report.id.toLowerCase().includes(searchText) ||
        report.name.toLowerCase().includes(searchText) ||
        report.type.toLowerCase().includes(searchText) ||
        report.audit.toLowerCase().includes(searchText) ||
        report.generatedBy.toLowerCase().includes(searchText) ||
        report.status.toLowerCase().includes(searchText);

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

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalReports = reports.length;

  const generatedReports = reports.filter(
    (report) => report.status.toLowerCase() === "generated",
  ).length;

  const pendingReports = reports.filter(
    (report) => report.status.toLowerCase() === "pending",
  ).length;

  const complianceReports = reports.filter(
    (report) => report.type.toLowerCase() === "compliance report",
  ).length;

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setType("All");
    setAudit("All");
  };

  const filtersActive =
    search.trim() !== "" ||
    status !== "All" ||
    type !== "All" ||
    audit !== "All";

  /* =======================================================
     VIEW REPORT
  ======================================================= */

  const handleView = (report: Report) => {
    window.alert(`Opening ${report.name}`);
  };

  /* =======================================================
     DOWNLOAD REPORT
  ======================================================= */

  const handleDownload = (report: Report) => {
    window.alert(`Downloading ${report.name}`);
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden px-3 py-4 transition-colors duration-300 sm:px-4 md:px-5 lg:px-6 ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl min-w-0">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 min-w-0">

          {/* Breadcrumb */}

          <div
            className={`flex items-center gap-2 text-[11px] ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <Link
              href="/dashboard"
              className={`transition ${
                isDark
                  ? "hover:text-blue-400"
                  : "hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>

            <span>/</span>

            <span
              className={`font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Reports
            </span>
          </div>

          {/* Title */}

          <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1
                className={`truncate text-xl font-bold tracking-tight sm:text-2xl ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Reports
              </h1>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Generate, view and manage audit reports.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {/* Total */}

          <div
            className={`min-w-0 rounded-xl border p-3.5 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`truncate text-[10px] font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Total Reports
              </p>

              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                  isDark ? "bg-blue-500/10" : "bg-blue-50"
                }`}
              >
                📊
              </div>
            </div>

            <p
              className={`mt-2 text-2xl font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {totalReports}
            </p>

            <p
              className={`mt-0.5 text-[10px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              All reports
            </p>
          </div>

          {/* Generated */}

          <div
            className={`min-w-0 rounded-xl border p-3.5 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`truncate text-[10px] font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Generated
              </p>

              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            </div>

            <p
              className={`mt-2 text-2xl font-bold ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              {generatedReports}
            </p>

            <p
              className={`mt-0.5 text-[10px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Ready to view
            </p>
          </div>

          {/* Pending */}

          <div
            className={`min-w-0 rounded-xl border p-3.5 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`truncate text-[10px] font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Pending
              </p>

              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
            </div>

            <p
              className={`mt-2 text-2xl font-bold ${
                isDark ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {pendingReports}
            </p>

            <p
              className={`mt-0.5 text-[10px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Awaiting generation
            </p>
          </div>

          {/* Compliance */}

          <div
            className={`min-w-0 rounded-xl border p-3.5 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`truncate text-[10px] font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Compliance
              </p>

              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                  isDark
                    ? "bg-purple-500/10"
                    : "bg-purple-50"
                }`}
              >
                ✓
              </div>
            </div>

            <p
              className={`mt-2 text-2xl font-bold ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {complianceReports}
            </p>

            <p
              className={`mt-0.5 text-[10px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Compliance reports
            </p>
          </div>
        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className={`w-full min-w-0 overflow-hidden rounded-xl border shadow-sm ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >

          {/* Card Header */}

          <div
            className={`border-b px-4 py-3.5 ${
              isDark
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          >
            <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">
                <h2
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Reports List
                </h2>

                <p
                  className={`mt-0.5 text-[10px] ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-500"
                  }`}
                >
                  Review and manage generated audit reports.
                </p>
              </div>

              <div
                className={`shrink-0 text-[10px] ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-500"
                }`}
              >
                Showing{" "}
                <span
                  className={`font-bold ${
                    isDark
                      ? "text-slate-200"
                      : "text-slate-800"
                  }`}
                >
                  {filteredReports.length}
                </span>{" "}
                of{" "}
                <span
                  className={`font-bold ${
                    isDark
                      ? "text-slate-200"
                      : "text-slate-800"
                  }`}
                >
                  {reports.length}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div
            className={`border-b p-3 ${
              isDark
                ? "border-slate-800 bg-slate-800/40"
                : "border-slate-200 bg-slate-50/60"
            }`}
          >
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">

              {/* Search */}

              <div className="relative min-w-0">
                <span
                  className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  🔎
                </span>

                <input
                  type="text"
                  placeholder="Search reports..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`h-9 w-full min-w-0 rounded-lg border pl-8 pr-3 text-xs outline-none transition-all ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                      : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Status */}

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`h-9 w-full min-w-0 rounded-lg border px-3 text-xs outline-none transition-all ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500"
                    : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                }`}
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Statuses"
                      : item}
                  </option>
                ))}
              </select>

              {/* Type */}

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`h-9 w-full min-w-0 rounded-lg border px-3 text-xs outline-none transition-all ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500"
                    : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                }`}
              >
                {typeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Report Types"
                      : item}
                  </option>
                ))}
              </select>

              {/* Audit */}

              <select
                value={audit}
                onChange={(e) => setAudit(e.target.value)}
                className={`h-9 w-full min-w-0 rounded-lg border px-3 text-xs outline-none transition-all ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500"
                    : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                }`}
              >
                {auditOptions.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Audits"
                      : item}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Bottom */}

            <div className="mt-2 flex items-center justify-between gap-3">

              <div className="min-w-0 text-[10px]">
                {filtersActive ? (
                  <span
                    className={`font-semibold ${
                      isDark
                        ? "text-blue-400"
                        : "text-blue-600"
                    }`}
                  >
                    ● Filters Active
                  </span>
                ) : (
                  <span
                    className={
                      isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                    }
                  >
                    No filters applied
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className={`shrink-0 rounded-md border px-3 py-1.5 text-[10px] font-semibold transition ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredReports.length === 0 ? (
            <div className="flex min-h-56 items-center justify-center p-5 text-center">
              <div>

                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                    isDark
                      ? "bg-slate-800"
                      : "bg-slate-100"
                  }`}
                >
                  🔎
                </div>

                <p
                  className={`mt-3 text-sm font-semibold ${
                    isDark
                      ? "text-slate-100"
                      : "text-slate-700"
                  }`}
                >
                  No reports found
                </p>

                <p
                  className={`mt-1 text-xs ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>

              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden w-full min-w-0 md:block">

                <table className="w-full table-fixed border-collapse">

                  {/* IMPORTANT:
                      Total = 100%
                      Action ko enough space diya hai
                  */}

                  <colgroup>
                    <col className="w-[8%]" />
                    <col className="w-[22%]" />
                    <col className="w-[15%]" />
                    <col className="w-[17%]" />
                    <col className="w-[13%]" />
                    <col className="w-[11%]" />
                    <col className="w-[14%]" />
                  </colgroup>

                  {/* TABLE HEAD */}

                  <thead>
                    <tr
                      className={`border-b text-left ${
                        isDark
                          ? "border-slate-800 bg-slate-800/70"
                          : "border-slate-200 bg-slate-50/80"
                      }`}
                    >
                      <th
                        className={`px-2.5 py-3 text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        ID
                      </th>

                      <th
                        className={`px-2.5 py-3 text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Report
                      </th>

                      <th
                        className={`px-2.5 py-3 text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Type
                      </th>

                      <th
                        className={`px-2.5 py-3 text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Audit
                      </th>

                      <th
                        className={`px-2.5 py-3 text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Generated By
                      </th>

                      <th
                        className={`px-2.5 py-3 text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Status
                      </th>

                      <th
                        className={`px-2.5 py-3 text-right text-[9px] font-bold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody
                    className={`divide-y ${
                      isDark
                        ? "divide-slate-800"
                        : "divide-slate-100"
                    }`}
                  >
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className={`transition-colors ${
                          isDark
                            ? "hover:bg-slate-800/60"
                            : "hover:bg-blue-50/30"
                        }`}
                      >

                        {/* ID */}

                        <td className="min-w-0 px-2.5 py-3">
                          <Link
                            href={`/dashboard/reports/${report.id}`}
                            className={`truncate text-[11px] font-semibold hover:underline ${
                              isDark
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            {report.id}
                          </Link>
                        </td>

                        {/* REPORT */}

                        <td className="min-w-0 px-2.5 py-3">
                          <Link
                            href={`/dashboard/reports/${report.id}`}
                            title={report.name}
                            className={`block truncate text-[11px] font-semibold hover:underline ${
                              isDark
                                ? "text-slate-100 hover:text-white"
                                : "text-slate-800 hover:text-slate-900"
                            }`}
                          >
                            {report.name}
                          </Link>

                          <p
                            className={`mt-0.5 truncate text-[9px] ${
                              isDark
                                ? "text-slate-500"
                                : "text-slate-400"
                            }`}
                          >
                            {report.generatedDate}
                          </p>
                        </td>

                        {/* TYPE */}

                        <td className="min-w-0 px-2.5 py-3">
                          <span
                            title={report.type}
                            className={`inline-flex max-w-full truncate rounded-md border px-1.5 py-1 text-[9px] font-semibold ${getTypeClass(
                              report.type,
                              theme,
                            )}`}
                          >
                            {report.type}
                          </span>
                        </td>

                        {/* AUDIT */}

                        <td className="min-w-0 px-2.5 py-3">
                          <p
                            title={report.audit}
                            className={`truncate text-[11px] font-medium ${
                              isDark
                                ? "text-blue-400"
                                : "text-blue-600"
                            }`}
                          >
                            {report.audit}
                          </p>
                        </td>

                        {/* GENERATED BY */}

                        <td className="min-w-0 px-2.5 py-3">
                          <p
                            title={report.generatedBy}
                            className={`truncate text-[11px] ${
                              isDark
                                ? "text-slate-300"
                                : "text-slate-600"
                            }`}
                          >
                            {report.generatedBy}
                          </p>
                        </td>

                        {/* STATUS */}

                        <td className="min-w-0 px-2.5 py-3">
                          <span
                            title={report.status}
                            className={`inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-1 text-[9px] font-semibold ${getStatusClass(
                              report.status,
                              theme,
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${getStatusDot(
                                report.status,
                              )}`}
                            />

                            <span className="truncate">
                              {report.status}
                            </span>
                          </span>
                        </td>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <td className="px-2 py-3">
                          <div className="flex w-full items-center justify-end gap-1">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(report)
                              }
                              title="View Report"
                              className={`shrink-0 whitespace-nowrap rounded-md border px-1.5 py-1.5 text-[9px] font-semibold leading-none transition ${
                                isDark
                                  ? "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              View
                            </button>

                            {/* DOWNLOAD */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(report)
                              }
                              title="Download Report"
                              className={`shrink-0 whitespace-nowrap rounded-md border px-1.5 py-1.5 text-[9px] font-semibold leading-none transition ${
                                isDark
                                  ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                  : "border-blue-200 text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              Download
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              <div className="space-y-3 p-3 md:hidden">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`rounded-lg border p-3 ${
                      isDark
                        ? "border-slate-800 bg-slate-800"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    {/* Top */}

                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">

                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className={`text-xs font-bold hover:underline ${
                            isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        >
                          {report.id}
                        </Link>

                        <h3
                          className={`mt-1 truncate text-sm font-semibold ${
                            isDark
                              ? "text-slate-100"
                              : "text-slate-800"
                          }`}
                        >
                          {report.name}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                          report.status,
                          theme,
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            report.status,
                          )}`}
                        />

                        {report.status}
                      </span>
                    </div>

                    {/* Details */}

                    <div className="mt-3 grid grid-cols-2 gap-3">

                      {/* Type */}

                      <div className="min-w-0">
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          Type
                        </p>

                        <span
                          className={`mt-1 inline-flex max-w-full truncate rounded-md border px-2 py-1 text-[10px] font-semibold ${getTypeClass(
                            report.type,
                            theme,
                          )}`}
                        >
                          {report.type}
                        </span>
                      </div>

                      {/* Generated By */}

                      <div className="min-w-0">
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          Generated By
                        </p>

                        <p
                          className={`mt-1 truncate text-xs ${
                            isDark
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >
                          {report.generatedBy}
                        </p>
                      </div>

                      {/* Audit */}

                      <div className="col-span-2 min-w-0">
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          Audit
                        </p>

                        <p
                          className={`mt-1 truncate text-xs ${
                            isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        >
                          {report.audit}
                        </p>
                      </div>

                      {/* Generated Date */}

                      <div className="col-span-2">
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          Generated Date
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isDark
                              ? "text-slate-300"
                              : "text-slate-600"
                          }`}
                        >
                          {report.generatedDate}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div
                      className={`mt-3 flex gap-2 border-t pt-3 ${
                        isDark
                          ? "border-slate-700"
                          : "border-slate-200"
                      }`}
                    >
                      <Link
                        href={`/dashboard/reports/${report.id}`}
                        className={`flex-1 rounded-md border px-3 py-2 text-center text-[10px] font-semibold transition ${
                          isDark
                            ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(report)
                        }
                        className={`flex-1 rounded-md border px-3 py-2 text-center text-[10px] font-semibold transition ${
                          isDark
                            ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            : "border-blue-200 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className={`flex flex-col gap-1.5 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
              isDark
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          >
            <p
              className={`text-[10px] ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Audit Management System • Reports
            </p>

            <p
              className={`text-[10px] ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {filteredReports.length} result
              {filteredReports.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}