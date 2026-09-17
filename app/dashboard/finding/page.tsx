"use client";

import { useEffect, useMemo, useState } from "react";

import { useTheme } from "@/app/context/ThemeContext";

import {
  getAllFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  type Finding,
  type FindingRequest,
} from "@/app/lib/api/findingApi";

import {
  getAllAudits,
  type Audit,
} from "@/app/lib/api/auditApi";

// ======================================================
// TYPES
// ======================================================

type ModalType = "create" | "edit" | "view" | null;

type SeverityFilter =
  | "All"
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

type StatusFilter =
  | "All"
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed";

// ======================================================
// ICONS
// ======================================================

function FindingIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l8.5 4.9v8.2L12 21l-8.5-4.9V7.9L12 3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16h.01"
      />
    </svg>
  );
}

function SearchIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11a8.1 8.1 0 0 0-15.5-3M4 5v3h3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 13a8.1 8.1 0 0 0 15.5 3M20 19v-3h-3"
      />
    </svg>
  );
}

function PlusIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EyeIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

function TrashIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function CloseIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronDownIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronLeftIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ======================================================
// HELPERS
// ======================================================

function getSeverityClass(
  severity: string,
  dark: boolean
) {
  switch (severity) {
    case "Critical":
      return dark
        ? "border-red-400/20 bg-red-500/10 text-red-300"
        : "border-red-200 bg-red-50 text-red-600";

    case "High":
      return dark
        ? "border-orange-400/20 bg-orange-500/10 text-orange-300"
        : "border-orange-200 bg-orange-50 text-orange-600";

    case "Medium":
      return dark
        ? "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
        : "border-yellow-200 bg-yellow-50 text-yellow-700";

    case "Low":
      return dark
        ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
        : "border-blue-200 bg-blue-50 text-blue-600";

    default:
      return dark
        ? "border-slate-400/20 bg-slate-500/10 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getStatusClass(
  status: string,
  dark: boolean
) {
  switch (status) {
    case "Open":
      return dark
        ? "border-red-400/20 bg-red-500/10 text-red-300"
        : "border-red-200 bg-red-50 text-red-600";

    case "In Progress":
      return dark
        ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
        : "border-blue-200 bg-blue-50 text-blue-600";

    case "Resolved":
      return dark
        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-600";

    case "Closed":
      return dark
        ? "border-slate-400/20 bg-slate-500/10 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-600";

    default:
      return dark
        ? "border-slate-400/20 bg-slate-500/10 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "Open":
      return "bg-red-500";

    case "In Progress":
      return "bg-blue-500";

    case "Resolved":
      return "bg-emerald-500";

    case "Closed":
      return "bg-slate-400";

    default:
      return "bg-slate-400";
  }
}

// ======================================================
// PAGE
// ======================================================

export default function FindingPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  // ====================================================
  // DATA
  // ====================================================

  const [findings, setFindings] = useState<Finding[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);

  // ====================================================
  // PAGINATION
  // ====================================================

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearch] = useState("");

  const [severity, setSeverity] =
    useState<SeverityFilter>("All");

  const [status, setStatus] =
    useState<StatusFilter>("All");

  // ====================================================
  // UI
  // ====================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] =
    useState<ModalType>(null);

  const [selected, setSelected] =
    useState<Finding | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Finding | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ====================================================
  // FORM
  // ====================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [formSeverity, setFormSeverity] =
    useState("Medium");

  const [formStatus, setFormStatus] =
    useState("Open");

  const [auditId, setAuditId] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const [formLoading, setFormLoading] =
    useState(false);

  // ====================================================
  // FETCH FINDINGS
  // ====================================================

  const fetchFindings = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await getAllFindings(
        currentPage,
        pageSize
      );

      const result = response?.data ?? response;

      setFindings(result?.content ?? []);
      setTotalPages(result?.totalPages ?? 0);
      setTotalElements(
        result?.totalElements ?? 0
      );
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err?.response?.status === 403) {
        setError(
          "You do not have permission to view findings."
        );
      } else {
        setError(
          "Unable to load findings. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ====================================================
  // FETCH AUDITS
  // ====================================================

  const fetchAudits = async () => {
    try {
      const response = await getAllAudits();

      const result = response?.data ?? response;

      if (Array.isArray(result)) {
        setAudits(result);
      } else if (Array.isArray(result?.content)) {
        setAudits(result.content);
      } else if (Array.isArray(result?.data)) {
        setAudits(result.data);
      } else if (
        Array.isArray(result?.data?.content)
      ) {
        setAudits(result.data.content);
      } else {
        setAudits([]);
      }
    } catch (err) {
      console.error(
        "Audit fetch error:",
        err
      );

      setAudits([]);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchAudits();
  }, []);

  // ====================================================
  // FILTERED FINDINGS
  // ====================================================

  const filteredFindings = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return findings.filter((finding) => {
      const matchesSearch =
        !query ||
        String(finding.id)
          .toLowerCase()
          .includes(query) ||
        finding.title
          ?.toLowerCase()
          .includes(query) ||
        finding.description
          ?.toLowerCase()
          .includes(query) ||
        finding.severity
          ?.toLowerCase()
          .includes(query) ||
        finding.status
          ?.toLowerCase()
          .includes(query) ||
        finding.audit?.title
          ?.toLowerCase()
          .includes(query);

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
  }, [
    findings,
    search,
    severity,
    status,
  ]);

  // ====================================================
  // STATS
  // ====================================================

  const openCount = findings.filter(
    (item) => item.status === "Open"
  ).length;

  const progressCount = findings.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolvedCount = findings.filter(
    (item) =>
      item.status === "Resolved" ||
      item.status === "Closed"
  ).length;

  const criticalCount = findings.filter(
    (item) => item.severity === "Critical"
  ).length;

  // ====================================================
  // FILTER RESET
  // ====================================================

  const filtersActive =
    search.trim() !== "" ||
    severity !== "All" ||
    status !== "All";

  const resetFilters = () => {
    setSearch("");
    setSeverity("All");
    setStatus("All");
    setCurrentPage(0);
  };

  // ====================================================
  // CREATE
  // ====================================================

  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setFormSeverity("Medium");
    setFormStatus("Open");
    setAuditId("");
    setFormError("");
    setSelected(null);
    setModal("create");
  };

  // ====================================================
  // EDIT
  // ====================================================

  const openEditModal = (
    finding: Finding
  ) => {
    setSelected(finding);

    setTitle(finding.title ?? "");

    setDescription(
      finding.description ?? ""
    );

    setFormSeverity(
      finding.severity ?? "Medium"
    );

    setFormStatus(
      finding.status ?? "Open"
    );

    setAuditId(
      finding.audit?.id
        ? String(finding.audit.id)
        : ""
    );

    setFormError("");
    setModal("edit");
  };

  // ====================================================
  // VIEW
  // ====================================================

  const openViewModal = (
    finding: Finding
  ) => {
    setSelected(finding);
    setModal("view");
  };

  // ====================================================
  // CLOSE
  // ====================================================

  const closeModal = () => {
    if (formLoading) return;

    setModal(null);
    setSelected(null);
    setFormError("");
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError(
        "Finding title is required."
      );
      return;
    }

    if (!description.trim()) {
      setFormError(
        "Description is required."
      );
      return;
    }

    if (!auditId) {
      setFormError(
        "Please select an audit."
      );
      return;
    }

    try {
      setFormLoading(true);
      setFormError("");

      const payload: FindingRequest = {
        title: title.trim(),
        description: description.trim(),
        severity: formSeverity,
        status: formStatus,
        audit: {
          id: Number(auditId),
        },
      };

      if (
        modal === "edit" &&
        selected?.id
      ) {
        await updateFinding(
          selected.id,
          payload
        );
      } else {
        await createFinding(payload);
      }

      closeModal();

      await fetchFindings(false);
    } catch (err: any) {
      console.error(err);

      setFormError(
        err?.response?.data?.message ||
          "Unable to save finding. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    try {
      setDeleteLoading(true);

      await deleteFinding(
        deleteTarget.id
      );

      setDeleteTarget(null);

      if (
        findings.length === 1 &&
        currentPage > 0
      ) {
        setCurrentPage(
          currentPage - 1
        );
      } else {
        await fetchFindings(false);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to delete finding. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ====================================================
  // THEME
  // ====================================================

  const pageBg = dark
    ? "bg-[#0b1220]"
    : "bg-[#f5f7fb]";

  const cardBg = dark
    ? "bg-[#111a2e]"
    : "bg-white";

  const border = dark
    ? "border-slate-700/60"
    : "border-slate-200";

  const textPrimary = dark
    ? "text-slate-100"
    : "text-slate-800";

  const textSecondary = dark
    ? "text-slate-400"
    : "text-slate-500";

  const inputBg = dark
    ? "bg-[#172238]"
    : "bg-white";

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        className={`min-h-full w-full min-w-0 overflow-x-hidden ${pageBg} px-2 py-3 sm:px-3 sm:py-4 lg:px-4`}
      >
        <div
          className={`flex min-h-[500px] w-full items-center justify-center rounded-xl border ${border} ${cardBg}`}
        >
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />

            Loading findings...
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN PAGE
  // ====================================================

  return (
    <div
      className={`min-h-full w-full min-w-0 max-w-full overflow-x-hidden ${pageBg} px-2 py-3 sm:px-3 sm:py-4 lg:px-4`}
    >
      {/* IMPORTANT:
          No mx-auto here.
          This keeps the content closer to the sidebar.
      */}

      <div className="w-full min-w-0 max-w-[1450px]">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                dark
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <FindingIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1
                className={`truncate text-lg font-semibold ${textPrimary}`}
              >
                Findings
              </h1>

              <p
                className={`truncate text-xs ${textSecondary}`}
              >
                Track and manage audit findings
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() =>
                fetchFindings(false)
              }
              disabled={refreshing}
              className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${
                dark
                  ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:bg-[#172238]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <RefreshIcon
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />

              Add Finding
            </button>
          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className={`mb-4 flex items-center justify-between rounded-lg border px-3 py-2.5 text-xs ${
              dark
                ? "border-red-400/20 bg-red-500/10 text-red-300"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-3 font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {/* TOTAL */}

          <div
            className={`rounded-xl border ${border} ${cardBg} px-3.5 py-3 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[11px] font-medium uppercase tracking-wide ${textSecondary}`}
              >
                Total
              </p>

              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>

            <p
              className={`mt-1 text-xl font-semibold ${textPrimary}`}
            >
              {totalElements}
            </p>

            <p
              className={`mt-0.5 text-[11px] ${textSecondary}`}
            >
              All findings
            </p>
          </div>

          {/* OPEN */}

          <div
            className={`rounded-xl border ${border} ${cardBg} px-3.5 py-3 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[11px] font-medium uppercase tracking-wide ${textSecondary}`}
              >
                Open
              </p>

              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>

            <p
              className={`mt-1 text-xl font-semibold ${textPrimary}`}
            >
              {openCount}
            </p>

            <p
              className={`mt-0.5 text-[11px] ${textSecondary}`}
            >
              Current page
            </p>
          </div>

          {/* IN PROGRESS */}

          <div
            className={`rounded-xl border ${border} ${cardBg} px-3.5 py-3 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[11px] font-medium uppercase tracking-wide ${textSecondary}`}
              >
                In Progress
              </p>

              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>

            <p
              className={`mt-1 text-xl font-semibold ${textPrimary}`}
            >
              {progressCount}
            </p>

            <p
              className={`mt-0.5 text-[11px] ${textSecondary}`}
            >
              Being addressed
            </p>
          </div>

          {/* RESOLVED */}

          <div
            className={`rounded-xl border ${border} ${cardBg} px-3.5 py-3 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[11px] font-medium uppercase tracking-wide ${textSecondary}`}
              >
                Resolved
              </p>

              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <p
              className={`mt-1 text-xl font-semibold ${textPrimary}`}
            >
              {resolvedCount}
            </p>

            <p
              className={`mt-0.5 text-[11px] ${textSecondary}`}
            >
              Resolved / closed
            </p>
          </div>

          {/* CRITICAL */}

          <div
            className={`rounded-xl border ${border} ${cardBg} px-3.5 py-3 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[11px] font-medium uppercase tracking-wide ${textSecondary}`}
              >
                Critical
              </p>

              <span className="h-2 w-2 rounded-full bg-orange-500" />
            </div>

            <p
              className={`mt-1 text-xl font-semibold ${textPrimary}`}
            >
              {criticalCount}
            </p>

            <p
              className={`mt-0.5 text-[11px] ${textSecondary}`}
            >
              Current page
            </p>
          </div>
        </div>

        {/* ==================================================
            TABLE CARD
        ================================================== */}

        <div
          className={`w-full min-w-0 overflow-hidden rounded-xl border ${border} ${cardBg} shadow-sm`}
        >
          {/* FILTER BAR */}

          <div
            className={`border-b ${border} p-3`}
          >
            <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}

              <div className="relative min-w-0 flex-1 lg:max-w-[540px]">
                <SearchIcon
                  className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${textSecondary}`}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(0);
                  }}
                  placeholder="Search findings..."
                  className={`h-9 w-full rounded-lg border ${border} ${inputBg} pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${textPrimary}`}
                />
              </div>

              {/* FILTERS */}

              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {/* SEVERITY */}

                <div className="relative">
                  <select
                    value={severity}
                    onChange={(e) => {
                      setSeverity(
                        e.target.value as SeverityFilter
                      );

                      setCurrentPage(0);
                    }}
                    className={`h-9 min-w-[125px] appearance-none rounded-lg border ${border} ${inputBg} px-3 pr-8 text-xs outline-none focus:border-blue-500 ${textPrimary}`}
                  >
                    <option value="All">
                      All Severity
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

                  <ChevronDownIcon
                    className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${textSecondary}`}
                  />
                </div>

                {/* STATUS */}

                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(
                        e.target.value as StatusFilter
                      );

                      setCurrentPage(0);
                    }}
                    className={`h-9 min-w-[125px] appearance-none rounded-lg border ${border} ${inputBg} px-3 pr-8 text-xs outline-none focus:border-blue-500 ${textPrimary}`}
                  >
                    <option value="All">
                      All Status
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

                    <option value="Closed">
                      Closed
                    </option>
                  </select>

                  <ChevronDownIcon
                    className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${textSecondary}`}
                  />
                </div>

                {/* RESET */}

                {filtersActive && (
                  <button
                    onClick={resetFilters}
                    className={`h-9 rounded-lg border px-3 text-xs font-medium transition ${
                      dark
                        ? "border-slate-700 text-slate-300 hover:bg-[#172238]"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <table className="w-full min-w-[980px] table-fixed">
              <colgroup>
                <col className="w-[7%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[16%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[9%]" />
              </colgroup>

              <thead
                className={
                  dark
                    ? "bg-[#0e1729]"
                    : "bg-slate-50"
                }
              >
                <tr
                  className={`border-b ${border}`}
                >
                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    ID
                  </th>

                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Finding
                  </th>

                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Description
                  </th>

                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Audit
                  </th>

                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Severity
                  </th>

                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Status
                  </th>

                  <th
                    className={`px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFindings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className={`px-4 py-12 text-center text-xs ${textSecondary}`}
                    >
                      No findings found.
                    </td>
                  </tr>
                ) : (
                  filteredFindings.map(
                    (finding) => (
                      <tr
                        key={finding.id}
                        className={`border-b last:border-b-0 ${
                          dark
                            ? "border-slate-700/50 hover:bg-[#172238]/40"
                            : "border-slate-100 hover:bg-slate-50/70"
                        }`}
                      >
                        {/* ID */}

                        <td
                          className={`px-3 py-2.5 text-xs font-medium ${textPrimary}`}
                        >
                          #{finding.id}
                        </td>

                        {/* FINDING */}

                        <td className="px-3 py-2.5">
                          <div
                            className={`truncate text-xs font-medium ${textPrimary}`}
                            title={
                              finding.title
                            }
                          >
                            {finding.title}
                          </div>
                        </td>

                        {/* DESCRIPTION */}

                        <td className="px-3 py-2.5">
                          <div
                            className={`line-clamp-2 max-w-[240px] text-[11px] leading-4 ${textSecondary}`}
                            title={
                              finding.description
                            }
                          >
                            {finding.description ||
                              "—"}
                          </div>
                        </td>

                        {/* AUDIT */}

                        <td className="px-3 py-2.5">
                          <div
                            className={`truncate text-[11px] ${textPrimary}`}
                            title={
                              finding.audit
                                ?.title || ""
                            }
                          >
                            {finding.audit
                              ?.title || "—"}
                          </div>
                        </td>

                        {/* SEVERITY */}

                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-medium ${getSeverityClass(
                              finding.severity,
                              dark
                            )}`}
                          >
                            {finding.severity}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium ${getStatusClass(
                              finding.status,
                              dark
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

                        {/* ACTIONS */}

                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                openViewModal(
                                  finding
                                )
                              }
                              title="View"
                              className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                                dark
                                  ? "border-slate-700 text-slate-300 hover:bg-blue-500/10 hover:text-blue-400"
                                  : "border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              <EyeIcon className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                openEditModal(
                                  finding
                                )
                              }
                              title="Edit"
                              className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                                dark
                                  ? "border-slate-700 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400"
                                  : "border-slate-200 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                              }`}
                            >
                              <EditIcon className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteTarget(
                                  finding
                                )
                              }
                              title="Delete"
                              className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                                dark
                                  ? "border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400"
                                  : "border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                              }`}
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          <div
            className={`flex flex-col gap-2 border-t ${border} px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between`}
          >
            <div
              className={`text-[11px] ${textSecondary}`}
            >
              {totalElements === 0
                ? "Showing 0 results"
                : `Showing ${
                    currentPage * pageSize + 1
                  }–${Math.min(
                    (currentPage + 1) *
                      pageSize,
                    totalElements
                  )} of ${totalElements}`}
            </div>

            <div className="flex items-center gap-2">
              {/* PAGE SIZE */}

              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(
                      Number(e.target.value)
                    );

                    setCurrentPage(0);
                  }}
                  className={`h-8 appearance-none rounded-md border ${border} ${inputBg} px-2.5 pr-7 text-[11px] outline-none ${textPrimary}`}
                >
                  <option value={5}>
                    5 / page
                  </option>

                  <option value={10}>
                    10 / page
                  </option>

                  <option value={20}>
                    20 / page
                  </option>

                  <option value={50}>
                    50 / page
                  </option>
                </select>

                <ChevronDownIcon
                  className={`pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 ${textSecondary}`}
                />
              </div>

              {/* PREVIOUS */}

              <button
                disabled={currentPage === 0}
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        0,
                        page - 1
                      )
                  )
                }
                className={`flex h-8 w-8 items-center justify-center rounded-md border ${border} ${
                  currentPage === 0
                    ? "cursor-not-allowed opacity-40"
                    : dark
                    ? "hover:bg-[#172238]"
                    : "hover:bg-slate-50"
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              {/* PAGE NUMBER */}

              <span
                className={`min-w-[65px] text-center text-[11px] ${textSecondary}`}
              >
                {totalPages === 0
                  ? 0
                  : currentPage + 1}{" "}
                / {totalPages}
              </span>

              {/* NEXT */}

              <button
                disabled={
                  currentPage >=
                  totalPages - 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages - 1,
                        page + 1
                      )
                  )
                }
                className={`flex h-8 w-8 items-center justify-center rounded-md border ${border} ${
                  currentPage >=
                  totalPages - 1
                    ? "cursor-not-allowed opacity-40"
                    : dark
                    ? "hover:bg-[#172238]"
                    : "hover:bg-slate-50"
                }`}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className={`mt-3 px-1 text-center text-[10px] ${textSecondary}`}
        >
          Audit Management System • Findings
        </div>
      </div>

      {/* ==================================================
          CREATE / EDIT MODAL
      ================================================== */}

      {(modal === "create" ||
        modal === "edit") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            className={`w-full max-w-xl rounded-xl border ${border} ${cardBg} shadow-2xl`}
          >
            {/* HEADER */}

            <div
              className={`flex items-center justify-between border-b ${border} px-4 py-3`}
            >
              <div>
                <h2
                  className={`text-sm font-semibold ${textPrimary}`}
                >
                  {modal === "edit"
                    ? "Edit Finding"
                    : "Create Finding"}
                </h2>

                <p
                  className={`mt-0.5 text-[11px] ${textSecondary}`}
                >
                  {modal === "edit"
                    ? "Update finding details"
                    : "Add a new audit finding"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  dark
                    ? "text-slate-400 hover:bg-[#172238] hover:text-white"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-3 p-4"
            >
              {formError && (
                <div
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    dark
                      ? "border-red-400/20 bg-red-500/10 text-red-300"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {formError}
                </div>
              )}

              {/* TITLE */}

              <div>
                <label
                  className={`mb-1.5 block text-[11px] font-medium ${textPrimary}`}
                >
                  Finding Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter finding title"
                  className={`h-9 w-full rounded-lg border ${border} ${inputBg} px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${textPrimary}`}
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  className={`mb-1.5 block text-[11px] font-medium ${textPrimary}`}
                >
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter finding description"
                  rows={3}
                  className={`w-full resize-none rounded-lg border ${border} ${inputBg} px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${textPrimary}`}
                />
              </div>

              {/* FORM ROW */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* AUDIT */}

                <div>
                  <label
                    className={`mb-1.5 block text-[11px] font-medium ${textPrimary}`}
                  >
                    Audit
                  </label>

                  <select
                    value={auditId}
                    onChange={(e) =>
                      setAuditId(
                        e.target.value
                      )
                    }
                    className={`h-9 w-full rounded-lg border ${border} ${inputBg} px-3 text-xs outline-none focus:border-blue-500 ${textPrimary}`}
                  >
                    <option value="">
                      Select audit
                    </option>

                    {audits.map((audit) => (
                      <option
                        key={audit.id}
                        value={audit.id}
                      >
                        {audit.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SEVERITY */}

                <div>
                  <label
                    className={`mb-1.5 block text-[11px] font-medium ${textPrimary}`}
                  >
                    Severity
                  </label>

                  <select
                    value={formSeverity}
                    onChange={(e) =>
                      setFormSeverity(
                        e.target.value
                      )
                    }
                    className={`h-9 w-full rounded-lg border ${border} ${inputBg} px-3 text-xs outline-none focus:border-blue-500 ${textPrimary}`}
                  >
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
                </div>

                {/* STATUS */}

                <div>
                  <label
                    className={`mb-1.5 block text-[11px] font-medium ${textPrimary}`}
                  >
                    Status
                  </label>

                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(
                        e.target.value
                      )
                    }
                    className={`h-9 w-full rounded-lg border ${border} ${inputBg} px-3 text-xs outline-none focus:border-blue-500 ${textPrimary}`}
                  >
                    <option value="Open">
                      Open
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className={`h-9 rounded-lg border ${border} px-4 text-xs font-medium ${
                    dark
                      ? "text-slate-300 hover:bg-[#172238]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="h-9 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formLoading
                    ? "Saving..."
                    : modal === "edit"
                    ? "Update Finding"
                    : "Create Finding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          VIEW MODAL
      ================================================== */}

      {modal === "view" &&
        selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <div
              className={`w-full max-w-lg rounded-xl border ${border} ${cardBg} shadow-2xl`}
            >
              {/* HEADER */}

              <div
                className={`flex items-center justify-between border-b ${border} px-4 py-3`}
              >
                <div>
                  <h2
                    className={`text-sm font-semibold ${textPrimary}`}
                  >
                    Finding Details
                  </h2>

                  <p
                    className={`mt-0.5 text-[11px] ${textSecondary}`}
                  >
                    Finding #{selected.id}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    dark
                      ? "text-slate-400 hover:bg-[#172238] hover:text-white"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              {/* DETAILS */}

              <div className="space-y-4 p-4">
                <div>
                  <p
                    className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Finding
                  </p>

                  <p
                    className={`text-sm font-semibold ${textPrimary}`}
                  >
                    {selected.title}
                  </p>
                </div>

                <div>
                  <p
                    className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                  >
                    Description
                  </p>

                  <p
                    className={`text-xs leading-5 ${textSecondary}`}
                  >
                    {selected.description ||
                      "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* AUDIT */}

                  <div>
                    <p
                      className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                    >
                      Audit
                    </p>

                    <p
                      className={`truncate text-xs font-medium ${textPrimary}`}
                    >
                      {selected.audit
                        ?.title || "—"}
                    </p>
                  </div>

                  {/* SEVERITY */}

                  <div>
                    <p
                      className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                    >
                      Severity
                    </p>

                    <span
                      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-medium ${getSeverityClass(
                        selected.severity,
                        dark
                      )}`}
                    >
                      {selected.severity}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div>
                    <p
                      className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${textSecondary}`}
                    >
                      Status
                    </p>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium ${getStatusClass(
                        selected.status,
                        dark
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                          selected.status
                        )}`}
                      />

                      {selected.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* FOOTER */}

              <div
                className={`flex justify-end border-t ${border} px-4 py-3`}
              >
                <button
                  onClick={closeModal}
                  className="h-9 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleteLoading
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className={`w-full max-w-sm rounded-xl border ${border} ${cardBg} shadow-2xl`}
          >
            <div className="p-5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <TrashIcon className="h-5 w-5" />
              </div>

              <div className="mt-3 text-center">
                <h2
                  className={`text-sm font-semibold ${textPrimary}`}
                >
                  Delete Finding?
                </h2>

                <p
                  className={`mt-1.5 text-xs leading-5 ${textSecondary}`}
                >
                  Are you sure you want to
                  delete{" "}
                  <span
                    className={`font-medium ${textPrimary}`}
                  >
                    {deleteTarget.title}
                  </span>
                  ? This action cannot be
                  undone.
                </p>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                  disabled={deleteLoading}
                  className={`h-9 rounded-lg border ${border} px-4 text-xs font-medium ${
                    dark
                      ? "text-slate-300 hover:bg-[#172238]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="h-9 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}