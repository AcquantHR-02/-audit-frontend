
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  deleteCompliance,
  getAllCompliance,
  type Compliance,
} from "@/app/lib/api/complianceApi";

export default function CompliancePage() {
  const [complianceRecords, setComplianceRecords] = useState<
    Compliance[]
  >([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // =========================
  // Fetch Compliance Records
  // =========================

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCompliance();

      setComplianceRecords(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load compliance records. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  // =========================
  // Status List
  // =========================

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(
        complianceRecords
          .map((record) => record.status)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueStatuses];
  }, [complianceRecords]);

  // =========================
  // Search + Filter
  // =========================

  const filteredRecords = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return complianceRecords.filter((record) => {
      const matchesSearch =
        !searchValue ||
        record.id.toString().includes(searchValue) ||
        record.requirement
          ?.toLowerCase()
          .includes(searchValue) ||
        record.description
          ?.toLowerCase()
          .includes(searchValue) ||
        record.status
          ?.toLowerCase()
          .includes(searchValue) ||
        record.audit?.title
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complianceRecords, search, statusFilter]);

  // =========================
  // Statistics
  // =========================

  const totalCompliance = complianceRecords.length;

  const compliantCount = complianceRecords.filter(
    (record) =>
      record.status?.toLowerCase() === "compliant"
  ).length;

  const dueSoonCount = complianceRecords.filter(
    (record) =>
      record.status?.toLowerCase() === "due soon"
  ).length;

  const overdueCount = complianceRecords.filter(
    (record) =>
      record.status?.toLowerCase() === "overdue"
  ).length;

  // =========================
  // Delete
  // =========================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this compliance record?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteCompliance(id);

      setComplianceRecords((records) =>
        records.filter((record) => record.id !== id)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete compliance record. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // Reset Filters
  // =========================

  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // =========================
  // Status Style
  // =========================

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "compliant":
        return "bg-green-50 text-green-700 border-green-200";

      case "due soon":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";

      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-gray-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-gray-500">
                Loading compliance records...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Main UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Compliance
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Manage and monitor compliance requirements
            </p>
          </div>

          <Link
            href="/dashboard/compliance/create"
            className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:text-sm"
          >
            + Create Compliance
          </Link>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
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

        {/* ================= STAT CARDS ================= */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Total Compliance
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {totalCompliance}
            </p>
          </div>

          {/* Compliant */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Compliant
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {compliantCount}
            </p>
          </div>

          {/* Due Soon */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Due Soon
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {dueSoonCount}
            </p>
          </div>

          {/* Overdue */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Overdue
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              {overdueCount}
            </p>
          </div>

        </div>

        {/* ================= SEARCH / FILTER ================= */}

        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">

            {/* Search */}

            <div>
              <label
                htmlFor="search"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                Search
              </label>

              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search compliance..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition-all duration-150 placeholder:text-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              />
            </div>

            {/* Status */}

            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                Status
              </label>

              <select
                id="status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition-all duration-150 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Reset
            </button>

          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Table Header */}

          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Compliance Records
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Showing {filteredRecords.length} of{" "}
              {complianceRecords.length} records
            </p>
          </div>

          {/* Empty State */}

          {filteredRecords.length === 0 ? (
            <div className="flex min-h-52 items-center justify-center p-5 text-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  No compliance records found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Try changing your search or filter.
                </p>
              </div>
            </div>
          ) : (

            /* Table */

            <div className="w-full">
              <table className="w-full table-fixed">

                {/* Column Widths */}

                <colgroup>
                  <col className="w-[9%]" />
                  <col className="w-[21%]" />
                  <col className="w-[27%]" />
                  <col className="w-[16%]" />
                  <col className="w-[11%]" />
                  <col className="w-[16%]" />
                </colgroup>

                {/* Table Head */}

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">

                    <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>

                    <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Requirement
                    </th>

                    <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Description
                    </th>

                    <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Audit
                    </th>

                    <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                {/* Table Body */}

                <tbody className="divide-y divide-gray-100">

                  {filteredRecords.map((record) => (

                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-gray-50"
                    >

                      {/* ID */}

                      <td className="px-3 py-3">
                        <Link
                          href={`/dashboard/compliance/${record.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          CMP-
                          {String(record.id).padStart(3, "0")}
                        </Link>
                      </td>

                      {/* Requirement */}

                      <td className="px-3 py-3">
                        <p
                          title={record.requirement}
                          className="truncate text-xs font-semibold text-gray-900"
                        >
                          {record.requirement || "-"}
                        </p>
                      </td>

                      {/* Description */}

                      <td className="px-3 py-3">
                        <p
                          title={record.description}
                          className="truncate text-xs text-gray-600"
                        >
                          {record.description || "-"}
                        </p>
                      </td>

                      {/* Audit */}

                      <td className="px-3 py-3">
                        {record.audit ? (
                          <Link
                            href={`/dashboard/audits/${record.audit.id}`}
                            title={
                              record.audit.title ||
                              `Audit #${record.audit.id}`
                            }
                            className="block truncate text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {record.audit.title ||
                              `Audit #${record.audit.id}`}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not assigned
                          </span>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusStyle(
                            record.status
                          )}`}
                        >
                          {record.status || "Unknown"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">

                          {/* View */}

                          <Link
                            href={`/dashboard/compliance/${record.id}`}
                            className="rounded-md border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                          >
                            View
                          </Link>

                          {/* Edit */}

                          <Link
                            href={`/dashboard/compliance/${record.id}/edit`}
                            className="rounded-md border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            Edit
                          </Link>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(record.id)
                            }
                            disabled={
                              deletingId === record.id
                            }
                            className="rounded-md border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === record.id
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

        </div>
      </div>
    </div>
  );
}
