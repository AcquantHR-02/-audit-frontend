"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getAllAudits,
  deleteAudit,
  type Audit,
} from "@/app/lib/api/auditApi";

import { useTheme } from "@/app/context/ThemeContext";

// ======================================================
// ICONS
// ======================================================

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5" />
      <path d="M9 10h6" />
      <path d="M9 14h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 4.5 3.7 17a2 2 0 0 0 1.8 3h13a2 2 0 0 0 1.8-3L13.7 4.5a1.9 1.9 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="m9 7 .7-2h4.6l.7 2" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

// ======================================================
// PAGE
// ======================================================

export default function AuditsPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [audits, setAudits] = useState<Audit[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH AUDITS
  // ======================================================

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllAudits();

        console.log("Audits from backend:", data);

        setAudits(data || []);
      } catch (error: any) {
        console.error("Error fetching audits:", error);

        if (error.response?.status === 401) {
          setError(
            "Unauthorized. Please login again."
          );
        } else if (error.response?.status === 403) {
          setError(
            "You do not have permission to view audits."
          );
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
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

  // ======================================================
  // STATUS COUNTS
  // ======================================================

  const completedCount = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() === "completed"
  ).length;

  const progressCount = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() === "in progress"
  ).length;

  const pendingCount = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() === "pending"
  ).length;

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredAudits = audits.filter((audit) => {
    const searchText = search.toLowerCase().trim();

    const auditorName =
      audit.auditor?.name?.toLowerCase() || "";

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
  });

  // ======================================================
  // RESET
  // ======================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
  };

  // ======================================================
  // DELETE
  // ======================================================

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

      alert("Audit deleted successfully!");
    } catch (error: any) {
      console.error(
        "Error deleting audit:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again."
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to delete this audit."
        );
      } else if (error.response?.status === 404) {
        setError(
          "Audit not found. It may have already been deleted."
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to delete audit. Please try again."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // STATUS BADGE
  // ======================================================

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              isDark
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );

      case "in progress":
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              isDark
                ? "bg-amber-500/15 text-amber-300"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            In Progress
          </span>
        );

      case "pending":
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              isDark
                ? "bg-slate-600/60 text-slate-200"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Pending
          </span>
        );

      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              isDark
                ? "bg-blue-500/15 text-blue-300"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {status || "Unknown"}
          </span>
        );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className={`min-h-screen p-3 md:p-4 ${
          isDark
            ? "bg-slate-900"
            : "bg-slate-50"
        }`}
      >
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="text-center">
            <div
              className={`mx-auto h-8 w-8 animate-spin rounded-full border-4 ${
                isDark
                  ? "border-slate-600 border-t-blue-400"
                  : "border-slate-200 border-t-blue-600"
              }`}
            />

            <p
              className={`mt-3 text-sm font-medium ${
                isDark
                  ? "text-slate-200"
                  : "text-slate-600"
              }`}
            >
              Loading audits...
            </p>

            <p
              className={`mt-1 text-[10px] ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-400"
              }`}
            >
              Fetching audit records
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div
      className={`min-h-screen overflow-x-hidden p-3 md:p-4 ${
        isDark
          ? "bg-slate-900"
          : "bg-slate-50"
      }`}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div
            className={`flex items-center gap-1.5 text-[10px] ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            <Link
              href="/dashboard"
              className="transition hover:text-blue-500"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span
              className={
                isDark
                  ? "font-medium text-slate-200"
                  : "font-medium text-slate-700"
              }
            >
              Audits
            </span>
          </div>

          <h1
            className={`mt-1 text-xl font-bold tracking-tight md:text-2xl ${
              isDark
                ? "text-slate-100"
                : "text-slate-900"
            }`}
          >
            Audits
          </h1>

          <p
            className={`mt-0.5 text-[10px] md:text-xs ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Manage and monitor compliance audits.
          </p>
        </div>

        <Link
          href="/dashboard/audits/create"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <PlusIcon />
          Create Audit
        </Link>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className={`mb-4 flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 ${
            isDark
              ? "border-red-500/30 bg-red-500/10"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="min-w-0">
            <p
              className={`text-[11px] font-semibold ${
                isDark
                  ? "text-red-300"
                  : "text-red-700"
              }`}
            >
              Something went wrong
            </p>

            <p
              className={`mt-0.5 truncate text-[10px] ${
                isDark
                  ? "text-red-300/80"
                  : "text-red-600"
              }`}
            >
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className={`shrink-0 transition ${
              isDark
                ? "text-red-300 hover:text-red-200"
                : "text-red-400 hover:text-red-600"
            }`}
          >
            <XIcon />
          </button>
        </div>
      )}

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {/* TOTAL */}

        <div
          className={`rounded-lg border p-3 shadow-sm transition hover:-translate-y-0.5 ${
            isDark
              ? "border-slate-600 bg-slate-800 shadow-black/10"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p
                className={`text-[10px] font-medium ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Total Audits
              </p>

              <h2
                className={`mt-1 text-xl font-bold ${
                  isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                }`}
              >
                {audits.length}
              </h2>

              <p
                className={`mt-0.5 text-[9px] ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                All audit records
              </p>
            </div>

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isDark
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <ClipboardIcon />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div
          className={`rounded-lg border p-3 shadow-sm transition hover:-translate-y-0.5 ${
            isDark
              ? "border-slate-600 bg-slate-800"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p
                className={`text-[10px] font-medium ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Completed
              </p>

              <h2 className="mt-1 text-xl font-bold text-emerald-500">
                {completedCount}
              </h2>

              <p
                className={`mt-0.5 text-[9px] ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Completed audits
              </p>
            </div>

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isDark
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <CheckIcon />
            </div>
          </div>
        </div>

        {/* IN PROGRESS */}

        <div
          className={`rounded-lg border p-3 shadow-sm transition hover:-translate-y-0.5 ${
            isDark
              ? "border-slate-600 bg-slate-800"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p
                className={`text-[10px] font-medium ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                In Progress
              </p>

              <h2 className="mt-1 text-xl font-bold text-amber-500">
                {progressCount}
              </h2>

              <p
                className={`mt-0.5 text-[9px] ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Currently active
              </p>
            </div>

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isDark
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <ClockIcon />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div
          className={`rounded-lg border p-3 shadow-sm transition hover:-translate-y-0.5 ${
            isDark
              ? "border-slate-600 bg-slate-800"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p
                className={`text-[10px] font-medium ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Pending
              </p>

              <h2
                className={`mt-1 text-xl font-bold ${
                  isDark
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}
              >
                {pendingCount}
              </h2>

              <p
                className={`mt-0.5 text-[9px] ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Awaiting action
              </p>
            </div>

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isDark
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <ClockIcon />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          SEARCH & FILTERS
      ================================================== */}

      <div
        className={`mb-4 rounded-lg border shadow-sm ${
          isDark
            ? "border-slate-600 bg-slate-800"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`border-b px-3.5 py-2.5 ${
            isDark
              ? "border-slate-600"
              : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isDark
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <FilterIcon />
            </div>

            <div>
              <h2
                className={`text-xs font-semibold ${
                  isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                }`}
              >
                Search & Filters
              </h2>

              <p
                className={`mt-0.5 text-[10px] ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Search and filter audit records.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-12">
            {/* SEARCH */}

            <div className="lg:col-span-5">
              <label
                className={`mb-1 block text-[10px] font-semibold ${
                  isDark
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
              >
                Search
              </label>

              <div className="relative">
                <span
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-400"
                  }`}
                >
                  <SearchIcon />
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search ID, title, description or auditor..."
                  className={`w-full rounded-md border py-2 pl-8 pr-2.5 text-[10px] outline-none transition focus:border-blue-500 ${
                    isDark
                      ? "border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                      : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400"
                  }`}
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="lg:col-span-2">
              <label
                className={`mb-1 block text-[10px] font-semibold ${
                  isDark
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
              >
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className={`w-full rounded-md border px-2.5 py-2 text-[10px] outline-none transition focus:border-blue-500 ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-100"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
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

            {/* DEPARTMENT */}

            <div className="lg:col-span-3">
              <label
                className={`mb-1 block text-[10px] font-semibold ${
                  isDark
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
              >
                Department
              </label>

              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(
                    e.target.value
                  )
                }
                className={`w-full rounded-md border px-2.5 py-2 text-[10px] outline-none transition focus:border-blue-500 ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-100"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
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

            {/* RESET */}

            <div className="flex items-end lg:col-span-2">
              <button
                type="button"
                onClick={resetFilters}
                className={`w-full rounded-md border px-2.5 py-2 text-[10px] font-semibold transition ${
                  isDark
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* RESULT */}

          <div
            className={`mt-2.5 flex items-center justify-between border-t pt-2.5 ${
              isDark
                ? "border-slate-600"
                : "border-slate-100"
            }`}
          >
            <p
              className={`text-[10px] ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Showing{" "}
              <span
                className={`font-semibold ${
                  isDark
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}
              >
                {filteredAudits.length}
              </span>{" "}
              of{" "}
              <span
                className={`font-semibold ${
                  isDark
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}
              >
                {audits.length}
              </span>{" "}
              audits
            </p>

            {(search ||
              statusFilter !== "All" ||
              departmentFilter !== "All") && (
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  isDark
                    ? "bg-blue-500/15 text-blue-300"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                Filters Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          AUDIT TABLE
      ================================================== */}

      <div
        className={`w-full overflow-hidden rounded-lg border shadow-sm ${
          isDark
            ? "border-slate-600 bg-slate-800"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* TABLE HEADER */}

        <div
          className={`flex items-center justify-between border-b px-3.5 py-2.5 ${
            isDark
              ? "border-slate-600"
              : "border-slate-200"
          }`}
        >
          <div>
            <h2
              className={`text-xs font-semibold ${
                isDark
                  ? "text-slate-100"
                  : "text-slate-900"
              }`}
            >
              Audit Records
            </h2>

            <p
              className={`mt-0.5 text-[9px] ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Compliance audit list
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${
              isDark
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {filteredAudits.length} Records
          </span>
        </div>

        {/* TABLE */}

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

            <thead
              className={
                isDark
                  ? "bg-slate-700/70"
                  : "bg-slate-50"
              }
            >
              <tr>
                <th
                  className={`px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  Audit
                </th>

                <th
                  className={`px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  Description
                </th>

                <th
                  className={`px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  Auditor
                </th>

                <th
                  className={`px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  Status
                </th>

                <th
                  className={`px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  End Date
                </th>

                <th
                  className={`px-2.5 py-2 text-right text-[9px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody
              className={`divide-y ${
                isDark
                  ? "divide-slate-600"
                  : "divide-slate-100"
              }`}
            >
              {filteredAudits.length > 0 ? (
                filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className={`transition ${
                      isDark
                        ? "hover:bg-slate-700/60"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* AUDIT */}

                    <td className="overflow-hidden px-2.5 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                            isDark
                              ? "bg-blue-500/15 text-blue-300"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          A
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`truncate text-[10px] font-semibold ${
                              isDark
                                ? "text-slate-100"
                                : "text-slate-800"
                            }`}
                            title={audit.title}
                          >
                            {audit.title}
                          </p>

                          <p className="mt-0.5 text-[9px] font-medium text-blue-500">
                            AUD-
                            {String(audit.id).padStart(
                              3,
                              "0"
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="overflow-hidden px-2.5 py-2.5">
                      <p
                        className={`truncate text-[10px] ${
                          isDark
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}
                        title={
                          audit.description || ""
                        }
                      >
                        {audit.description || "-"}
                      </p>
                    </td>

                    {/* AUDITOR */}

                    <td className="overflow-hidden px-2.5 py-2.5">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${
                            isDark
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {audit.auditor?.name
                            ? audit.auditor.name
                                .split(" ")
                                .map(
                                  (name) => name[0]
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "NA"}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`truncate text-[10px] font-medium ${
                              isDark
                                ? "text-slate-200"
                                : "text-slate-700"
                            }`}
                          >
                            {audit.auditor?.name ||
                              "Not Assigned"}
                          </p>

                          {audit.auditor?.email && (
                            <p
                              className={`truncate text-[8px] ${
                                isDark
                                  ? "text-slate-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {audit.auditor.email}
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
                      <span
                        className={`block truncate text-[9px] ${
                          isDark
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}
                      >
                        {audit.endDate || "-"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-2 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* VIEW */}

                        <Link
                          href={`/dashboard/audits/${audit.id}`}
                          title="View Audit"
                          className={`inline-flex h-7 w-7 items-center justify-center rounded border transition ${
                            isDark
                              ? "border-slate-600 bg-slate-700 text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <EyeIcon />
                        </Link>

                        {/* EDIT */}

                        <Link
                          href={`/dashboard/audits/${audit.id}/edit`}
                          title="Edit Audit"
                          className={`inline-flex h-7 w-7 items-center justify-center rounded border transition ${
                            isDark
                              ? "border-slate-600 bg-slate-700 text-slate-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300"
                              : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                          }`}
                        >
                          <EditIcon />
                        </Link>

                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={
                            deletingId === audit.id
                          }
                          onClick={() =>
                            handleDelete(
                              audit.id
                            )
                          }
                          title="Delete Audit"
                          className={`inline-flex h-7 w-7 items-center justify-center rounded border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            isDark
                              ? "border-red-500/30 bg-slate-700 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                              : "border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                          }`}
                        >
                          {deletingId ===
                          audit.id ? (
                            <span
                              className={`h-3 w-3 animate-spin rounded-full border-2 ${
                                isDark
                                  ? "border-red-300/30 border-t-red-300"
                                  : "border-red-200 border-t-red-600"
                              }`}
                            />
                          ) : (
                            <TrashIcon />
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
                    <div
                      className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                        isDark
                          ? "bg-slate-700 text-slate-300"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <SearchIcon />
                    </div>

                    <h3
                      className={`mt-2 text-xs font-semibold ${
                        isDark
                          ? "text-slate-100"
                          : "text-slate-800"
                      }`}
                    >
                      No audits found
                    </h3>

                    <p
                      className={`mt-1 text-[10px] ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Try changing your search
                      or filters.
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
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        className={`mt-2.5 flex items-center justify-between text-[9px] ${
          isDark
            ? "text-slate-500"
            : "text-slate-400"
        }`}
      >
        <p>
          Showing {filteredAudits.length} audit
          {filteredAudits.length !== 1
            ? "s"
            : ""}
        </p>

        <p className="hidden sm:block">
          Manage audit records using the actions
          above.
        </p>
      </div>
    </div>
  );
}