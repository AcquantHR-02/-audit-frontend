
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
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);
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

        setAudits(data || []);
      } catch (error: any) {
        console.error(
          "Error fetching audits:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Unauthorized. Please login again."
          );
        } else if (
          error.response?.status === 403
        ) {
          setError(
            "You do not have permission to view audits."
          );
        } else if (
          error.response?.data?.message
        ) {
          setError(
            error.response.data.message
          );
        } else {
          setError(
            "Unable to load audits. Please check your backend connection."
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
    (audit) =>
      audit.status?.toLowerCase() ===
      "completed"
  ).length;

  const progressCount = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() ===
      "in progress"
  ).length;

  const pendingCount = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() ===
      "pending"
  ).length;

  // ----------------------------------------
  // Search + Filter
  // ----------------------------------------

  const filteredAudits = audits.filter(
    (audit) => {
      const searchText =
        search.toLowerCase().trim();

      const auditorName =
        audit.auditor?.name?.toLowerCase() ||
        "";

      const matchesSearch =
        String(audit.id)
          .toLowerCase()
          .includes(searchText) ||
        audit.title
          ?.toLowerCase()
          .includes(searchText) ||
        audit.description
          ?.toLowerCase()
          .includes(searchText) ||
        auditorName.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        audit.status === statusFilter;

      // Department is not available
      // in current Audit backend entity.
      const matchesDepartment =
        departmentFilter === "All";

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    }
  );

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
    const audit = audits.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        audit?.title ||
        `AUD-${String(id).padStart(3, "0")}`
      }"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteAudit(id);

      setAudits((previousAudits) =>
        previousAudits.filter(
          (audit) => audit.id !== id
        )
      );

      alert(
        "Audit deleted successfully!"
      );
    } catch (error: any) {
      console.error(
        "Error deleting audit:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again."
        );
      } else if (
        error.response?.status === 403
      ) {
        setError(
          "You do not have permission to delete this audit."
        );
      } else if (
        error.response?.status === 404
      ) {
        setError(
          "Audit not found. It may have already been deleted."
        );
      } else if (
        error.response?.data?.message
      ) {
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "Unable to delete audit. Please try again."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ----------------------------------------
  // Status Badge
  // ----------------------------------------

  const getStatusBadge = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );

      case "in progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            In Progress
          </span>
        );

      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Pending
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {status || "Unknown"}
          </span>
        );
    }
  };

  // ----------------------------------------
  // Loading State
  // ----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-3 md:p-4">
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Loading audits...
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Fetching audit records
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Main UI
  // ----------------------------------------

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 p-3 md:p-4">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
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

          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Audits
          </h1>

          <p className="mt-0.5 text-[10px] text-slate-500 md:text-xs">
            Manage and monitor compliance audits.
          </p>
        </div>

        <Link
          href="/dashboard/audits/create"
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-sm leading-none">
            +
          </span>

          Create Audit
        </Link>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="mt-0.5 truncate text-[10px] text-red-600">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-sm font-bold text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4">

        {/* Total */}

        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Total Audits
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {audits.length}
              </h2>

              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                All audit records
              </p>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm">
              📋
            </div>
          </div>
        </div>

        {/* Completed */}

        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Completed
              </p>

              <h2 className="mt-1 text-xl font-bold text-emerald-600">
                {completedCount}
              </h2>

              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                Completed audits
              </p>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-sm">
              ✓
            </div>
          </div>
        </div>

        {/* In Progress */}

        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                In Progress
              </p>

              <h2 className="mt-1 text-xl font-bold text-amber-600">
                {progressCount}
              </h2>

              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                Currently active
              </p>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-sm">
              ◐
            </div>
          </div>
        </div>

        {/* Pending */}

        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Pending
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-700">
                {pendingCount}
              </h2>

              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                Awaiting action
              </p>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm">
              ⏳
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          SEARCH & FILTERS
      ====================================== */}

      <div className="mb-4 rounded-md border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-3.5 py-2.5">
          <h2 className="text-xs font-semibold text-slate-900">
            Search & Filters
          </h2>

          <p className="mt-0.5 text-[10px] text-slate-500">
            Search and filter audit records.
          </p>
        </div>

        <div className="p-3.5">

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-12">

            {/* Search */}

            <div className="lg:col-span-5">
              <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                Search
              </label>

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search ID, title, description or auditor..."
                  className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-7 pr-2.5 text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
                />
              </div>
            </div>

            {/* Status */}

            <div className="lg:col-span-2">
              <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] text-slate-700 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Pending">
                  Pending
                </option>
              </select>
            </div>

            {/* Department */}

            <div className="lg:col-span-3">
              <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                Department
              </label>

              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[10px] text-slate-700 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                <option value="All">
                  All Departments
                </option>

                <option value="Human Resources">
                  Human Resources
                </option>

                <option value="Operations">
                  Operations
                </option>

                <option value="Finance">
                  Finance
                </option>

                <option value="Legal">
                  Legal
                </option>
              </select>
            </div>

            {/* Reset */}

            <div className="flex items-end lg:col-span-2">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Filter Result */}

          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">

            <p className="text-[10px] text-slate-500">
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
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-600">
                Filters Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          AUDIT TABLE
      ====================================== */}

      <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-3.5 py-2.5">

          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-slate-900">
              Audit Records
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-500">
              Compliance audit list
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600">
            {filteredAudits.length} Records
          </span>
        </div>

        {/* Table */}

        <div className="w-full overflow-hidden">

          <table className="w-full table-fixed">

            <colgroup>
              <col className="w-[19%]" />
              <col className="w-[23%]" />
              <col className="w-[19%]" />
              <col className="w-[12%]" />
              <col className="w-[11%]" />
              <col className="w-[16%]" />
            </colgroup>

            <thead className="bg-slate-50">

              <tr>

                <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  Audit
                </th>

                <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>

                <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  Auditor
                </th>

                <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  End Date
                </th>

                <th className="px-2.5 py-2 text-right text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredAudits.length > 0 ? (

                filteredAudits.map((audit) => (

                  <tr
                    key={audit.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* AUDIT */}

                    <td className="overflow-hidden px-2.5 py-2.5">

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                          A
                        </div>

                        <div className="min-w-0">

                          <p
                            className="truncate text-[10px] font-semibold text-slate-800"
                            title={audit.title}
                          >
                            {audit.title}
                          </p>

                          <p className="mt-0.5 text-[9px] font-medium text-blue-600">
                            AUD-
                            {String(
                              audit.id
                            ).padStart(3, "0")}
                          </p>

                        </div>
                      </div>

                    </td>

                    {/* DESCRIPTION */}

                    <td className="overflow-hidden px-2.5 py-2.5">

                      <p
                        className="truncate text-[10px] text-slate-600"
                        title={
                          audit.description ||
                          ""
                        }
                      >
                        {audit.description ||
                          "-"}
                      </p>

                    </td>

                    {/* AUDITOR */}

                    <td className="overflow-hidden px-2.5 py-2.5">

                      <div className="flex min-w-0 items-center gap-1.5">

                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-semibold text-slate-600">

                          {audit.auditor?.name
                            ? audit.auditor.name
                                .split(" ")
                                .map(
                                  (name) =>
                                    name[0]
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "NA"}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-[10px] font-medium text-slate-700">
                            {audit.auditor?.name ||
                              "Not Assigned"}
                          </p>

                          {audit.auditor
                            ?.email && (
                            <p className="truncate text-[8px] text-slate-400">
                              {
                                audit.auditor
                                  .email
                              }
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="overflow-hidden px-2.5 py-2.5">
                      {getStatusBadge(
                        audit.status
                      )}
                    </td>

                    {/* END DATE */}

                    <td className="overflow-hidden px-2.5 py-2.5">

                      <span className="block truncate text-[9px] text-slate-600">
                        {audit.endDate || "-"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-2 py-2.5">

                      <div className="flex items-center justify-end gap-1">

                        {/* View */}

                        <Link
                          href={`/dashboard/audits/${audit.id}`}
                          title="View Audit"
                          className="inline-flex h-7 items-center justify-center rounded border border-slate-200 bg-white px-1.5 text-[9px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          👁
                        </Link>

                        {/* Edit */}

                        <Link
                          href={`/dashboard/audits/${audit.id}/edit`}
                          title="Edit Audit"
                          className="inline-flex h-7 items-center justify-center rounded border border-slate-200 bg-white px-1.5 text-[9px] font-semibold text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                        >
                          ✏️
                        </Link>

                        {/* Delete */}

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            audit.id
                          }
                          onClick={() =>
                            handleDelete(
                              audit.id
                            )
                          }
                          title="Delete Audit"
                          className="inline-flex h-7 items-center justify-center rounded border border-red-200 bg-white px-1.5 text-[9px] font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId ===
                          audit.id ? (
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                          ) : (
                            "🗑"
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center"
                  >

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-base">
                      🔍
                    </div>

                    <h3 className="mt-2 text-xs font-semibold text-slate-800">
                      No audits found
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Try changing your search
                      or filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        resetFilters
                      }
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
      </div>

      {/* =====================================
          FOOTER
      ====================================== */}

      <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-400">

        <p>
          Showing{" "}
          {filteredAudits.length} audit
          {filteredAudits.length !== 1
            ? "s"
            : ""}
        </p>

        <p className="hidden sm:block">
          Manage audit records using the
          actions above.
        </p>

      </div>

    </div>
  );
}

