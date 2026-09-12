"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getAllAudits,
  deleteAudit,
  type Audit,
} from "@/app/lib/api/auditApi";

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // ----------------------------------------
  // Fetch Audits
  // ----------------------------------------

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllAudits();

        console.log("Audits from backend:", data);

        setAudits(data);
      } catch (error: any) {
        console.error("Error fetching audits:", error);

        if (error.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (error.response?.status === 403) {
          setError("You do not have permission to view audits.");
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError(
            "Unable to load audits. Please check your backend connection.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // ----------------------------------------
  // Status Counts
  // ----------------------------------------

  const completedCount = audits.filter(
    (audit) => audit.status === "Completed",
  ).length;

  const progressCount = audits.filter(
    (audit) => audit.status === "In Progress",
  ).length;

  const pendingCount = audits.filter(
    (audit) => audit.status === "Pending",
  ).length;

  // ----------------------------------------
  // Search + Filter
  // ----------------------------------------

  const filteredAudits = audits.filter((audit) => {
    const searchText = search.toLowerCase().trim();

    const auditorName = audit.auditor?.name?.toLowerCase() || "";

    const matchesSearch =
      String(audit.id).toLowerCase().includes(searchText) ||
      audit.title.toLowerCase().includes(searchText) ||
      audit.description.toLowerCase().includes(searchText) ||
      auditorName.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || audit.status === statusFilter;

    /*
      Department backend Audit entity mein available nahi hai.

      Isliye department filter abhi UI mein available hai,
      lekin actual filtering "All" ke alawa apply nahi hogi.

      Backend mein department field add hone ke baad
      isko properly connect kar sakte hain.
    */

    const matchesDepartment = departmentFilter === "All";

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // ----------------------------------------
  // Reset Filters
  // ----------------------------------------

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
  };

  // ----------------------------------------
  // Delete Audit
  // ----------------------------------------

  const handleDelete = async (id: number) => {
    const audit = audits.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        audit?.title || `AUD-${String(id).padStart(3, "0")}`
      }"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteAudit(id);

      // Remove deleted audit from UI
      setAudits((previousAudits) =>
        previousAudits.filter((audit) => audit.id !== id),
      );

      alert("Audit deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting audit:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to delete this audit.");
      } else if (error.response?.status === 404) {
        setError("Audit not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to delete audit. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ----------------------------------------
  // Loading State
  // ----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-5">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Loading audits...
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Please wait while we fetch audit records.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">
      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link
              href="/dashboard"
              className="transition hover:text-blue-600"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="font-medium text-slate-700">
              Audits
            </span>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
            Audits
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Manage and monitor compliance audits.
          </p>
        </div>

        {/* Create Audit */}

        <Link
          href="/dashboard/audits/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
        >
          <span className="text-base leading-none">+</span>

          Create Audit
        </Link>
      </div>

      {/* =========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="mt-0.5 text-xs text-red-600">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-sm font-bold text-red-400 transition hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* =========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* Total */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Total Audits
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {audits.length}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                All audit records
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-base">
              📋
            </div>
          </div>
        </div>

        {/* Completed */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Completed
              </p>

              <h2 className="mt-1 text-2xl font-bold text-emerald-600">
                {completedCount}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Completed audits
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-base">
              ✓
            </div>
          </div>
        </div>

        {/* In Progress */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                In Progress
              </p>

              <h2 className="mt-1 text-2xl font-bold text-amber-600">
                {progressCount}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Currently active
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-base">
              ◐
            </div>
          </div>
        </div>

        {/* Pending */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Pending
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-700">
                {pendingCount}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Awaiting action
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-base">
              ⏳
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SEARCH & FILTER
      ========================================== */}

      <div className="mb-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Filter Header */}

        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Search & Filters
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Search and filter audit records.
          </p>
        </div>

        {/* Filter Body */}

        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">
            {/* Search */}

            <div className="xl:col-span-5">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                Search
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID, title, description or auditor..."
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* Status */}

            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">All Status</option>

                <option value="Completed">Completed</option>

                <option value="In Progress">In Progress</option>

                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Department */}

            <div className="xl:col-span-3">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                Department
              </label>

              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(e.target.value)
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">All Departments</option>

                <option value="Human Resources">
                  Human Resources
                </option>

                <option value="Operations">
                  Operations
                </option>

                <option value="Finance">
                  Finance
                </option>

                <option value="Legal">Legal</option>
              </select>
            </div>

            {/* Reset */}

            <div className="flex items-end xl:col-span-2">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Filter Result */}

          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredAudits.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {audits.length}
              </span>{" "}
              audits
            </p>

            {(search ||
              statusFilter !== "All" ||
              departmentFilter !== "All") && (
              <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                Filters Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          AUDIT TABLE
      ========================================== */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Table Header */}

        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Audit Records
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Compliance audit list
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
            {filteredAudits.length} Records
          </span>
        </div>

        {/* Table Wrapper */}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            {/* Table Head */}

            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Audit
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Auditor
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  End Date
                </th>

                <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}

            <tbody className="divide-y divide-slate-100">
              {filteredAudits.length > 0 ? (
                filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* ---------------------------------
                        Audit
                    ---------------------------------- */}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600">
                          A
                        </div>

                        <div className="min-w-0">
                          <p
                            className="max-w-[190px] truncate text-xs font-semibold text-slate-800"
                            title={audit.title}
                          >
                            {audit.title}
                          </p>

                          <p className="mt-0.5 text-[10px] font-medium text-blue-600">
                            AUD-
                            {String(audit.id).padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ---------------------------------
                        Description
                    ---------------------------------- */}

                    <td className="px-4 py-3">
                      <p
                        className="max-w-[240px] truncate text-xs text-slate-600"
                        title={audit.description || ""}
                      >
                        {audit.description || "-"}
                      </p>
                    </td>

                    {/* ---------------------------------
                        Auditor
                    ---------------------------------- */}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-600">
                          {audit.auditor?.name
                            ? audit.auditor.name
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "NA"}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[130px] truncate text-xs font-medium text-slate-700">
                            {audit.auditor?.name ||
                              "Not Assigned"}
                          </p>

                          {audit.auditor?.email && (
                            <p className="max-w-[130px] truncate text-[9px] text-slate-400">
                              {audit.auditor.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ---------------------------------
                        Status
                    ---------------------------------- */}

                    <td className="px-4 py-3">
                      {audit.status === "Completed" && (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                          Completed
                        </span>
                      )}

                      {audit.status === "In Progress" && (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                          In Progress
                        </span>
                      )}

                      {audit.status === "Pending" && (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

                          Pending
                        </span>
                      )}

                      {/* Other / Unknown Status */}

                      {![
                        "Completed",
                        "In Progress",
                        "Pending",
                      ].includes(audit.status) && (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                          {audit.status || "Unknown"}
                        </span>
                      )}
                    </td>

                    {/* ---------------------------------
                        End Date
                    ---------------------------------- */}

                    <td className="px-4 py-3">
                      <span className="whitespace-nowrap text-xs text-slate-600">
                        {audit.endDate || "-"}
                      </span>
                    </td>

                    {/* ---------------------------------
                        ACTION
                    ---------------------------------- */}

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}

                        <Link
                          href={`/dashboard/audits/${audit.id}`}
                          title="View Audit"
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="mr-1">
                            👁
                          </span>

                          View
                        </Link>

                        {/* Edit */}

                        <Link
                          href={`/dashboard/audits/${audit.id}/edit`}
                          title="Edit Audit"
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <span className="mr-1">
                            ✏️
                          </span>

                          Edit
                        </Link>

                        {/* Delete */}

                        <button
                          type="button"
                          disabled={deletingId === audit.id}
                          onClick={() =>
                            handleDelete(audit.id)
                          }
                          title="Delete Audit"
                          className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === audit.id ? (
                            <>
                              <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />

                              Deleting...
                            </>
                          ) : (
                            <>
                              <span className="mr-1">
                                🗑
                              </span>

                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* ---------------------------------
                   No Records
                ---------------------------------- */

                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-14 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg">
                      🔍
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                      No audits found
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or filters.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          FOOTER INFO
      ========================================== */}

      <div className="mt-3 flex flex-col gap-1 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {filteredAudits.length} audit
          {filteredAudits.length !== 1 ? "s" : ""}
        </p>

        <p>
          View, edit or delete audit records using the
          actions above.
        </p>
      </div>
    </div>
  );
}