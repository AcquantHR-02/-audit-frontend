
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  deleteFinding,
  getAllFindings,
  type Finding,
} from "@/app/lib/api/findingApi";

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusClass(status: string) {
  switch (status?.toLowerCase()) {
    case "open":
      return "border-red-200 bg-red-50 text-red-700";

    case "in progress":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "resolved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "closed":
      return "border-slate-200 bg-slate-50 text-slate-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getStatusDot(status: string) {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-red-500";

    case "in progress":
      return "bg-blue-500";

    case "resolved":
      return "bg-emerald-500";

    case "closed":
      return "bg-slate-500";

    default:
      return "bg-slate-400";
  }
}

/* =========================================================
   SEVERITY STYLE
========================================================= */

function getSeverityClass(severity: string) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "border-red-200 bg-red-50 text-red-700";

    case "high":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "low":
      return "border-slate-200 bg-slate-50 text-slate-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(
    null
  );

  /* =======================================================
     FETCH FINDINGS
  ======================================================= */

  const fetchFindings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllFindings();

      setFindings(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load findings. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, []);

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const severityOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        findings
          .map((finding) => finding.severity)
          .filter(Boolean)
      )
    );

    return ["All", ...values];
  }, [findings]);

  const statusOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        findings
          .map((finding) => finding.status)
          .filter(Boolean)
      )
    );

    return ["All", ...values];
  }, [findings]);

  /* =======================================================
     FILTERED FINDINGS
  ======================================================= */

  const filteredFindings = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return findings.filter((finding) => {
      const matchesSearch =
        !searchText ||
        finding.id.toString().includes(searchText) ||
        finding.title
          ?.toLowerCase()
          .includes(searchText) ||
        finding.description
          ?.toLowerCase()
          .includes(searchText) ||
        finding.severity
          ?.toLowerCase()
          .includes(searchText) ||
        finding.status
          ?.toLowerCase()
          .includes(searchText) ||
        finding.audit?.title
          ?.toLowerCase()
          .includes(searchText);

      const matchesSeverity =
        severity === "All" ||
        finding.severity === severity;

      const matchesStatus =
        status === "All" ||
        finding.status === status;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [findings, search, severity, status]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalFindings = findings.length;

  const openFindings = findings.filter(
    (finding) =>
      finding.status?.toLowerCase() === "open"
  ).length;

  const inProgressFindings = findings.filter(
    (finding) =>
      finding.status?.toLowerCase() === "in progress"
  ).length;

  const resolvedFindings = findings.filter(
    (finding) =>
      finding.status?.toLowerCase() === "resolved"
  ).length;

  const criticalFindings = findings.filter(
    (finding) =>
      finding.severity?.toLowerCase() === "critical"
  ).length;

  /* =======================================================
     RESET
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setSeverity("All");
    setStatus("All");
  };

  const filtersActive =
    search.trim() !== "" ||
    severity !== "All" ||
    status !== "All";

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this finding?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteFinding(id);

      setFindings((records) =>
        records.filter((finding) => finding.id !== id)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete finding. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading findings...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen w-full bg-slate-50 px-3 py-4 sm:px-4 md:px-5 lg:px-6">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

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

          {/* Title */}

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Findings
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Manage and track audit findings.
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

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-3 text-sm font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">

          {/* Total */}

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Card Header */}

          <div className="border-b border-slate-200 px-4 py-3.5">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-sm font-bold text-slate-900">
                  Findings List
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Review and manage all audit findings.
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
              FILTERS
          ================================================= */}

          <div className="border-b border-slate-200 bg-slate-50/60 p-3">

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">

              {/* Search */}

              <div className="relative">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  🔎
                </span>

                <input
                  type="text"
                  placeholder="Search findings..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
                />

              </div>

              {/* Severity */}

              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value)
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition-all duration-150 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >

                <option value="All">
                  All Severities
                </option>

                {severityOptions
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

              </select>

              {/* Status */}

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition-all duration-150 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >

                <option value="All">
                  All Statuses
                </option>

                {statusOptions
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

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
              TABLE
          ================================================= */}

          {filteredFindings.length === 0 ? (

            <div className="flex min-h-56 items-center justify-center p-5 text-center">

              <div>

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

              </div>

            </div>

          ) : (

            <div className="w-full overflow-hidden">

              <table className="w-full table-fixed">

                <colgroup>

                  <col className="w-[9%]" />
                  <col className="w-[22%]" />
                  <col className="w-[25%]" />
                  <col className="w-[17%]" />
                  <col className="w-[11%]" />
                  <col className="w-[16%]" />

                </colgroup>

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50/80">

                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      ID
                    </th>

                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Finding
                    </th>

                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Description
                    </th>

                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Audit
                    </th>

                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Severity
                    </th>

                    <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredFindings.map((finding) => (

                    <tr
                      key={finding.id}
                      className="transition hover:bg-blue-50/30"
                    >

                      {/* ID */}

                      <td className="px-3 py-3">

                        <Link
                          href={`/dashboard/finding/${finding.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          FND-
                          {String(finding.id).padStart(3, "0")}
                        </Link>

                      </td>

                      {/* Title */}

                      <td className="px-3 py-3">

                        <p
                          title={finding.title}
                          className="truncate text-xs font-semibold text-slate-800"
                        >
                          {finding.title || "-"}
                        </p>

                      </td>

                      {/* Description */}

                      <td className="px-3 py-3">

                        <p
                          title={finding.description}
                          className="truncate text-xs text-slate-500"
                        >
                          {finding.description || "-"}
                        </p>

                      </td>

                      {/* Audit */}

                      <td className="px-3 py-3">

                        {finding.audit ? (

                          <Link
                            href={`/dashboard/audits/${finding.audit.id}`}
                            title={
                              finding.audit.title ||
                              `Audit #${finding.audit.id}`
                            }
                            className="block truncate text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {finding.audit.title ||
                              `Audit #${finding.audit.id}`}
                          </Link>

                        ) : (

                          <span className="text-xs text-slate-400">
                            Not assigned
                          </span>

                        )}

                      </td>

                      {/* Severity */}

                      <td className="px-3 py-3">

                        <span
                          className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${getSeverityClass(
                            finding.severity
                          )}`}
                        >
                          {finding.severity || "Unknown"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-3 py-3">

                        <div className="flex justify-end gap-1">

                          {/* View */}

                          <Link
                            href={`/dashboard/finding/${finding.id}`}
                            className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100"
                          >
                            View
                          </Link>

                          {/* Edit */}

                          <Link
                            href={`/dashboard/finding/${finding.id}/edit`}
                            className="rounded-md border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            Edit
                          </Link>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(finding.id)
                            }
                            disabled={
                              deletingId === finding.id
                            }
                            className="rounded-md border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === finding.id
                              ? "..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

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

    </div>
  );
}
