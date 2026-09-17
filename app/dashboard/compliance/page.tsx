"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { useTheme } from "@/app/context/ThemeContext";
import baseApi from "@/app/lib/api/baseapi";

import {
  createCompliance,
  deleteCompliance,
  getAllCompliance,
  type Compliance,
  type ComplianceRequest,
} from "@/app/lib/api/complianceApi";

import {
  getAllAudits,
  type Audit,
} from "@/app/lib/api/auditApi";

// ======================================================
// TYPES
// ======================================================

type ModalType = "create" | "edit" | "view" | null;

type StatusFilter =
  | "All Status"
  | "Compliant"
  | "Due Soon"
  | "Overdue"
  | "In Progress"
  | "Pending";

// ======================================================
// ICONS
// ======================================================

function ComplianceIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function SearchIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function RefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8.1 8.1 0 00-15.5-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0015.5 2M20 19v-4h-4" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronDownIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CheckIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ClockIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.8L2.6 17a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

// ======================================================
// HELPERS
// ======================================================

function normalizeArray<T>(response: any): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.content)) {
    return response.data.content;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  return [];
}

function statusClasses(status: string, dark: boolean) {
  switch (status?.toLowerCase()) {
    case "compliant":
      return dark
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "due soon":
      return dark
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-amber-50 text-amber-700 border-amber-200";

    case "overdue":
      return dark
        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
        : "bg-rose-50 text-rose-700 border-rose-200";

    case "in progress":
      return dark
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-blue-50 text-blue-700 border-blue-200";

    case "pending":
      return dark
        ? "bg-slate-500/10 text-slate-300 border-slate-500/20"
        : "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return dark
        ? "bg-slate-500/10 text-slate-300 border-slate-500/20"
        : "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function statusDot(status: string) {
  switch (status?.toLowerCase()) {
    case "compliant":
      return "bg-emerald-500";

    case "due soon":
      return "bg-amber-500";

    case "overdue":
      return "bg-rose-500";

    case "in progress":
      return "bg-blue-500";

    default:
      return "bg-slate-400";
  }
}

// ======================================================
// PAGE
// ======================================================

export default function CompliancePage() {
  const { theme } = useTheme();

  const dark = theme === "dark";

  // ====================================================
  // DATA STATES
  // ====================================================

  const [compliance, setCompliance] = useState<Compliance[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // FILTER STATES
  // ====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All Status");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ====================================================
  // MODAL STATES
  // ====================================================

  const [modal, setModal] = useState<ModalType>(null);

  const [selected, setSelected] = useState<Compliance | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Compliance | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // ====================================================
  // FORM STATES
  // ====================================================

  const [requirement, setRequirement] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [auditId, setAuditId] = useState("");

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // ====================================================
  // THEME COLORS
  // ====================================================

  const pageBg = dark ? "bg-[#0b1220]" : "bg-[#f5f8fc]";

  const cardBg = dark ? "bg-[#111a2e]" : "bg-white";

  const inputBg = dark ? "bg-[#172238]" : "bg-white";

  const borderColor = dark
    ? "border-slate-700/70"
    : "border-slate-200";

  const textPrimary = dark
    ? "text-slate-100"
    : "text-[#10213f]";

  const textSecondary = dark
    ? "text-slate-400"
    : "text-[#637897]";

  // ====================================================
  // LOAD COMPLIANCE
  // ====================================================

  async function loadCompliance() {
    try {
      setLoading(true);
      setError("");

      const response = await getAllCompliance();

      setCompliance(normalizeArray<Compliance>(response));
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err?.response?.status === 403) {
        setError("You do not have permission to view compliance.");
      } else {
        setError("Failed to load compliance records.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // LOAD AUDITS
  // ====================================================

  async function loadAudits() {
    try {
      const response = await getAllAudits();

      setAudits(normalizeArray<Audit>(response));
    } catch (err) {
      console.error("Failed to load audits:", err);
    }
  }

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadCompliance();
    loadAudits();
  }, []);

  // ====================================================
  // STATS
  // ====================================================

  const stats = useMemo(() => {
    const total = compliance.length;

    const compliant = compliance.filter(
      (item) =>
        item.status?.toLowerCase() === "compliant"
    ).length;

    const dueSoon = compliance.filter(
      (item) =>
        item.status?.toLowerCase() === "due soon"
    ).length;

    const overdue = compliance.filter(
      (item) =>
        item.status?.toLowerCase() === "overdue"
    ).length;

    return {
      total,
      compliant,
      dueSoon,
      overdue,
    };
  }, [compliance]);

  // ====================================================
  // FILTERED DATA
  // ====================================================

  const filteredCompliance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return compliance.filter((item) => {
      const matchesSearch =
        !query ||
        String(item.id).includes(query) ||
        item.requirement?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.audit?.title?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Status" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [compliance, search, statusFilter]);

  // ====================================================
  // PAGINATION
  // ====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompliance.length / pageSize)
  );

  const paginatedCompliance = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredCompliance.slice(
      start,
      start + pageSize
    );
  }, [filteredCompliance, currentPage, pageSize]);

  const showingStart =
    filteredCompliance.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const showingEnd = Math.min(
    currentPage * pageSize,
    filteredCompliance.length
  );

  // ====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, pageSize]);

  // ====================================================
  // OPEN CREATE MODAL
  // ====================================================

  function openCreateModal() {
    setSelected(null);

    setRequirement("");
    setDescription("");
    setStatus("Pending");
    setAuditId("");

    setFormError("");

    setModal("create");
  }

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  function openEditModal(item: Compliance) {
    setSelected(item);

    setRequirement(item.requirement || "");
    setDescription(item.description || "");
    setStatus(item.status || "Pending");
    setAuditId(item.audit?.id ? String(item.audit.id) : "");

    setFormError("");

    setModal("edit");
  }

  // ====================================================
  // OPEN VIEW MODAL
  // ====================================================

  function openViewModal(item: Compliance) {
    setSelected(item);
    setModal("view");
  }

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  function closeModal() {
    if (formLoading) return;

    setModal(null);
    setSelected(null);
    setFormError("");
  }

  // ====================================================
  // SUBMIT FORM
  // ====================================================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFormError("");

    if (!requirement.trim()) {
      setFormError("Requirement is required.");
      return;
    }

    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }

    if (!status) {
      setFormError("Status is required.");
      return;
    }

    if (!auditId) {
      setFormError("Please select an audit.");
      return;
    }

    const payload: ComplianceRequest = {
      requirement: requirement.trim(),
      description: description.trim(),
      status,
      audit: {
        id: Number(auditId),
      },
    };

    try {
      setFormLoading(true);

      if (modal === "create") {
        await createCompliance(payload);
      } else if (modal === "edit" && selected?.id) {
        await baseApi.put(
          `/api/compliance/${selected.id}`,
          payload
        );
      }

      closeModal();

      await loadCompliance();
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 401) {
        setFormError("Session expired. Please login again.");
      } else if (err?.response?.status === 403) {
        setFormError("You do not have permission for this action.");
      } else {
        setFormError(
          err?.response?.data?.message ||
            "Failed to save compliance."
        );
      }
    } finally {
      setFormLoading(false);
    }
  }

  // ====================================================
  // DELETE
  // ====================================================

  async function handleDelete() {
    if (!deleteTarget?.id) return;

    try {
      setDeleteLoading(true);

      await deleteCompliance(deleteTarget.id);

      setDeleteTarget(null);

      await loadCompliance();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete compliance."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  // ====================================================
  // STAT CARD
  // ====================================================

  function StatCard({
    title,
    value,
    icon,
    iconBg,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
  }) {
    return (
      <div
        className={`rounded-xl border ${borderColor} ${cardBg}
        px-4 py-3 shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-[11px] font-medium ${textSecondary}`}
            >
              {title}
            </p>

            <p
              className={`mt-1 text-[22px] font-semibold ${textPrimary}`}
            >
              {value}
            </p>
          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div
      className={`min-h-full w-full ${pageBg} ${textPrimary} px-4 py-5 sm:px-6`}
    >
      <div className="mx-auto w-full max-w-[1500px]">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg
                ${
                  dark
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <ComplianceIcon size={19} />
              </div>

              <div>
                <h1
                  className={`text-xl font-semibold tracking-tight ${textPrimary}`}
                >
                  Compliance
                </h1>

                <p
                  className={`mt-0.5 text-xs ${textSecondary}`}
                >
                  Manage and monitor compliance requirements
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadCompliance}
              disabled={loading}
              className={`inline-flex h-9 items-center gap-2 rounded-lg
              border px-3 text-xs font-medium transition
              ${
                dark
                  ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:bg-[#172238]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <RefreshIcon size={14} />

              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-9 items-center gap-2 rounded-lg
              bg-blue-600 px-3.5 text-xs font-semibold text-white
              transition hover:bg-blue-700"
            >
              <PlusIcon size={14} />

              Add Compliance
            </button>
          </div>
        </div>

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            title="Total Requirements"
            value={stats.total}
            icon={
              <ComplianceIcon
                size={18}
              />
            }
            iconBg={
              dark
                ? "bg-blue-500/10 text-blue-400"
                : "bg-blue-50 text-blue-600"
            }
          />

          <StatCard
            title="Compliant"
            value={stats.compliant}
            icon={<CheckIcon size={18} />}
            iconBg={
              dark
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
            }
          />

          <StatCard
            title="Due Soon"
            value={stats.dueSoon}
            icon={<ClockIcon size={18} />}
            iconBg={
              dark
                ? "bg-amber-500/10 text-amber-400"
                : "bg-amber-50 text-amber-600"
            }
          />

          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<AlertIcon size={18} />}
            iconBg={
              dark
                ? "bg-rose-500/10 text-rose-400"
                : "bg-rose-50 text-rose-600"
            }
          />
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-xs
            ${
              dark
                ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <div
          className={`overflow-hidden rounded-xl border ${borderColor} ${cardBg} shadow-sm`}
        >

          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div
            className={`border-b ${borderColor} p-3.5`}
          >
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

              <div className="relative w-full xl:max-w-[360px]">
                <div
                  className={`pointer-events-none absolute left-3 top-1/2
                  -translate-y-1/2 ${textSecondary}`}
                >
                  <SearchIcon size={15} />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search requirement, description, audit..."
                  className={`h-9 w-full rounded-lg border
                  ${borderColor} ${inputBg}
                  pl-9 pr-3 text-xs outline-none
                  transition
                  ${
                    dark
                      ? "text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50"
                      : "text-slate-700 placeholder:text-slate-400 focus:border-blue-400"
                  }`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">

                {/* STATUS */}

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as StatusFilter
                      )
                    }
                    className={`h-9 appearance-none rounded-lg border
                    ${borderColor} ${inputBg}
                    px-3 pr-8 text-xs outline-none
                    ${
                      dark
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}
                  >
                    <option>All Status</option>
                    <option>Compliant</option>
                    <option>Due Soon</option>
                    <option>Overdue</option>
                    <option>In Progress</option>
                    <option>Pending</option>
                  </select>

                  <div
                    className={`pointer-events-none absolute right-2.5
                    top-1/2 -translate-y-1/2 ${textSecondary}`}
                  >
                    <ChevronDownIcon size={13} />
                  </div>
                </div>

                {/* PAGE SIZE */}

                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      setPageSize(
                        Number(e.target.value)
                      )
                    }
                    className={`h-9 appearance-none rounded-lg border
                    ${borderColor} ${inputBg}
                    px-3 pr-8 text-xs outline-none
                    ${
                      dark
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>

                  <div
                    className={`pointer-events-none absolute right-2.5
                    top-1/2 -translate-y-1/2 ${textSecondary}`}
                  >
                    <ChevronDownIcon size={13} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[920px] border-collapse">

              <thead>
                <tr
                  className={`border-b ${borderColor}
                  ${
                    dark
                      ? "bg-[#0e1728]"
                      : "bg-slate-50/80"
                  }`}
                >
                  <th
                    className={`w-[70px] px-4 py-2.5 text-left
                    text-[10px] font-semibold uppercase tracking-wide
                    ${textSecondary}`}
                  >
                    ID
                  </th>

                  <th
                    className={`w-[190px] px-4 py-2.5 text-left
                    text-[10px] font-semibold uppercase tracking-wide
                    ${textSecondary}`}
                  >
                    Requirement
                  </th>

                  <th
                    className={`w-[260px] px-4 py-2.5 text-left
                    text-[10px] font-semibold uppercase tracking-wide
                    ${textSecondary}`}
                  >
                    Description
                  </th>

                  <th
                    className={`w-[180px] px-4 py-2.5 text-left
                    text-[10px] font-semibold uppercase tracking-wide
                    ${textSecondary}`}
                  >
                    Audit
                  </th>

                  <th
                    className={`w-[140px] px-4 py-2.5 text-left
                    text-[10px] font-semibold uppercase tracking-wide
                    ${textSecondary}`}
                  >
                    Status
                  </th>

                  <th
                    className={`w-[150px] px-4 py-2.5 text-center
                    text-[10px] font-semibold uppercase tracking-wide
                    ${textSecondary}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-4 py-12 text-center text-xs ${textSecondary}`}
                    >
                      Loading compliance records...
                    </td>
                  </tr>
                ) : paginatedCompliance.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-4 py-12 text-center text-xs ${textSecondary}`}
                    >
                      No compliance records found.
                    </td>
                  </tr>
                ) : (
                  paginatedCompliance.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b ${borderColor}
                      transition-colors
                      ${
                        dark
                          ? "hover:bg-[#172238]/60"
                          : "hover:bg-slate-50/70"
                      }`}
                    >

                      {/* ID */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex h-9 w-9 items-center
                          justify-center rounded-lg text-[10px]
                          font-semibold
                          ${
                            dark
                              ? "bg-slate-800 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{item.id}
                        </span>
                      </td>

                      {/* REQUIREMENT */}

                      <td className="px-4 py-3">
                        <div
                          className={`max-w-[180px] truncate
                          text-[12px] font-semibold ${textPrimary}`}
                          title={item.requirement}
                        >
                          {item.requirement}
                        </div>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-4 py-3">
                        <div
                          className={`max-w-[230px] line-clamp-2
                          text-[11px] leading-4 ${textSecondary}`}
                          title={item.description}
                        >
                          {item.description}
                        </div>
                      </td>

                      {/* AUDIT */}

                      <td className="px-4 py-3">
                        {item.audit ? (
                          <div className="max-w-[165px]">
                            <div
                              className={`truncate text-[12px]
                              font-medium ${textPrimary}`}
                              title={item.audit.title}
                            >
                              {item.audit.title ||
                                "Untitled Audit"}
                            </div>

                            <div
                              className={`mt-0.5 text-[10px]
                              ${textSecondary}`}
                            >
                              Audit #{item.audit.id}
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`text-[11px] ${textSecondary}`}
                          >
                            No audit
                          </span>
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5
                          rounded-full border px-2.5 py-1
                          text-[10px] font-semibold
                          ${statusClasses(item.status, dark)}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full
                            ${statusDot(item.status)}`}
                          />

                          {item.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              openViewModal(item)
                            }
                            title="View"
                            className={`flex h-9 w-9 items-center
                            justify-center rounded-lg border
                            transition
                            ${
                              dark
                                ? "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                                : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            <EyeIcon size={15} />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(item)
                            }
                            title="Edit"
                            className={`flex h-9 w-9 items-center
                            justify-center rounded-lg border
                            transition
                            ${
                              dark
                                ? "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
                                : "border-slate-200 bg-white text-slate-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                            }`}
                          >
                            <EditIcon size={15} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(item)
                            }
                            title="Delete"
                            className={`flex h-9 w-9 items-center
                            justify-center rounded-lg border
                            transition
                            ${
                              dark
                                ? "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
                                : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                          >
                            <TrashIcon size={15} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          <div
            className={`flex flex-col gap-3 border-t
            ${borderColor} px-4 py-3
            sm:flex-row sm:items-center sm:justify-between`}
          >
            <p
              className={`text-[11px] ${textSecondary}`}
            >
              Showing{" "}
              <span className={`font-medium ${textPrimary}`}>
                {showingStart}
              </span>{" "}
              to{" "}
              <span className={`font-medium ${textPrimary}`}>
                {showingEnd}
              </span>{" "}
              of{" "}
              <span className={`font-medium ${textPrimary}`}>
                {filteredCompliance.length}
              </span>{" "}
              records
            </p>

            <div className="flex items-center gap-1">

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
                className={`flex h-8 w-8 items-center justify-center
                rounded-lg border transition
                disabled:cursor-not-allowed disabled:opacity-40
                ${
                  dark
                    ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:bg-[#172238]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ChevronLeftIcon size={14} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter((page) => {
                  if (totalPages <= 5) return true;

                  if (currentPage <= 3) {
                    return page <= 5;
                  }

                  if (currentPage >= totalPages - 2) {
                    return page >= totalPages - 4;
                  }

                  return (
                    page >= currentPage - 2 &&
                    page <= currentPage + 2
                  );
                })
                .map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`flex h-8 min-w-8 items-center
                    justify-center rounded-lg border px-2
                    text-[11px] font-medium transition
                    ${
                      currentPage === page
                        ? "border-blue-600 bg-blue-600 text-white"
                        : dark
                        ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:bg-[#172238]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                  )
                }
                className={`flex h-8 w-8 items-center justify-center
                rounded-lg border transition
                disabled:cursor-not-allowed disabled:opacity-40
                ${
                  dark
                    ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:bg-[#172238]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ChevronRightIcon size={14} />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          CREATE / EDIT MODAL
      ==================================================== */}

      {(modal === "create" ||
        modal === "edit") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={closeModal}
        >
          <div
            className={`w-full max-w-xl rounded-2xl border
            ${borderColor} ${cardBg} shadow-2xl`}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <div
              className={`flex items-center justify-between
              border-b ${borderColor} px-5 py-4`}
            >
              <div>
                <h2
                  className={`text-base font-semibold ${textPrimary}`}
                >
                  {modal === "create"
                    ? "Add Compliance"
                    : "Edit Compliance"}
                </h2>

                <p
                  className={`mt-0.5 text-[11px] ${textSecondary}`}
                >
                  {modal === "create"
                    ? "Create a new compliance requirement."
                    : "Update compliance requirement details."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className={`flex h-8 w-8 items-center
                justify-center rounded-lg transition
                ${
                  dark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <CloseIcon size={17} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              <div className="grid gap-4">

                {/* REQUIREMENT */}

                <div>
                  <label
                    className={`mb-1.5 block text-xs
                    font-medium ${textPrimary}`}
                  >
                    Requirement
                  </label>

                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) =>
                      setRequirement(e.target.value)
                    }
                    placeholder="Enter requirement"
                    className={`h-10 w-full rounded-lg border
                    ${borderColor} ${inputBg}
                    px-3 text-xs outline-none
                    ${
                      dark
                        ? "text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                        : "text-slate-700 placeholder:text-slate-400 focus:border-blue-400"
                    }`}
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label
                    className={`mb-1.5 block text-xs
                    font-medium ${textPrimary}`}
                  >
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Enter description"
                    rows={4}
                    className={`w-full resize-none rounded-lg border
                    ${borderColor} ${inputBg}
                    px-3 py-2.5 text-xs outline-none
                    ${
                      dark
                        ? "text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                        : "text-slate-700 placeholder:text-slate-400 focus:border-blue-400"
                    }`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* STATUS */}

                  <div>
                    <label
                      className={`mb-1.5 block text-xs
                      font-medium ${textPrimary}`}
                    >
                      Status
                    </label>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value)
                        }
                        className={`h-10 w-full appearance-none
                        rounded-lg border ${borderColor}
                        ${inputBg} px-3 pr-8 text-xs
                        outline-none
                        ${
                          dark
                            ? "text-slate-200"
                            : "text-slate-700"
                        }`}
                      >
                        <option>Compliant</option>
                        <option>Due Soon</option>
                        <option>Overdue</option>
                        <option>In Progress</option>
                        <option>Pending</option>
                      </select>

                      <div
                        className={`pointer-events-none absolute
                        right-3 top-1/2 -translate-y-1/2
                        ${textSecondary}`}
                      >
                        <ChevronDownIcon size={13} />
                      </div>
                    </div>
                  </div>

                  {/* AUDIT */}

                  <div>
                    <label
                      className={`mb-1.5 block text-xs
                      font-medium ${textPrimary}`}
                    >
                      Audit
                    </label>

                    <div className="relative">
                      <select
                        value={auditId}
                        onChange={(e) =>
                          setAuditId(e.target.value)
                        }
                        className={`h-10 w-full appearance-none
                        rounded-lg border ${borderColor}
                        ${inputBg} px-3 pr-8 text-xs
                        outline-none
                        ${
                          dark
                            ? "text-slate-200"
                            : "text-slate-700"
                        }`}
                      >
                        <option value="">
                          Select Audit
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

                      <div
                        className={`pointer-events-none absolute
                        right-3 top-1/2 -translate-y-1/2
                        ${textSecondary}`}
                      >
                        <ChevronDownIcon size={13} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM ERROR */}

                {formError && (
                  <div
                    className={`rounded-lg border px-3 py-2.5
                    text-[11px]
                    ${
                      dark
                        ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {formError}
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div
                className="mt-5 flex justify-end gap-2"
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className={`h-9 rounded-lg border px-4
                  text-xs font-medium transition
                  ${
                    dark
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="h-9 rounded-lg bg-blue-600 px-4
                  text-xs font-semibold text-white transition
                  hover:bg-blue-700 disabled:cursor-not-allowed
                  disabled:opacity-60"
                >
                  {formLoading
                    ? "Saving..."
                    : modal === "create"
                    ? "Create Compliance"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          VIEW MODAL
      ==================================================== */}

      {modal === "view" && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={closeModal}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border
            ${borderColor} ${cardBg} shadow-2xl`}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <div
              className={`flex items-center justify-between
              border-b ${borderColor} px-5 py-4`}
            >
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase
                  tracking-wider ${textSecondary}`}
                >
                  Compliance Details
                </p>

                <h2
                  className={`mt-1 text-base font-semibold ${textPrimary}`}
                >
                  {selected.requirement}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className={`flex h-8 w-8 items-center
                justify-center rounded-lg transition
                ${
                  dark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <CloseIcon size={17} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="space-y-4 p-5">

              <div>
                <p
                  className={`mb-1 text-[10px] font-semibold
                  uppercase tracking-wide ${textSecondary}`}
                >
                  Requirement
                </p>

                <p
                  className={`text-sm font-medium ${textPrimary}`}
                >
                  {selected.requirement}
                </p>
              </div>

              <div>
                <p
                  className={`mb-1 text-[10px] font-semibold
                  uppercase tracking-wide ${textSecondary}`}
                >
                  Description
                </p>

                <p
                  className={`text-xs leading-5 ${textSecondary}`}
                >
                  {selected.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <p
                    className={`mb-1 text-[10px] font-semibold
                    uppercase tracking-wide ${textSecondary}`}
                  >
                    Audit
                  </p>

                  <p
                    className={`text-xs font-medium ${textPrimary}`}
                  >
                    {selected.audit?.title ||
                      "No audit"}
                  </p>

                  {selected.audit?.id && (
                    <p
                      className={`mt-0.5 text-[10px] ${textSecondary}`}
                    >
                      Audit #{selected.audit.id}
                    </p>
                  )}
                </div>

                <div>
                  <p
                    className={`mb-1 text-[10px] font-semibold
                    uppercase tracking-wide ${textSecondary}`}
                  >
                    Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5
                    rounded-full border px-2.5 py-1
                    text-[10px] font-semibold
                    ${statusClasses(
                      selected.status,
                      dark
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full
                      ${statusDot(selected.status)}`}
                    />

                    {selected.status}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div
              className={`flex justify-end border-t
              ${borderColor} px-5 py-3`}
            >
              <button
                type="button"
                onClick={closeModal}
                className="h-9 rounded-lg bg-blue-600
                px-4 text-xs font-semibold text-white
                hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          DELETE CONFIRMATION MODAL
      ==================================================== */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center
          justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={() => {
            if (!deleteLoading) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className={`w-full max-w-sm rounded-2xl border
            ${borderColor} ${cardBg} p-5 shadow-2xl`}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex items-start gap-3">

              <div
                className={`flex h-10 w-10 shrink-0
                items-center justify-center rounded-full
                ${
                  dark
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                <TrashIcon size={17} />
              </div>

              <div>
                <h3
                  className={`text-sm font-semibold ${textPrimary}`}
                >
                  Delete Compliance?
                </h3>

                <p
                  className={`mt-1 text-xs leading-5 ${textSecondary}`}
                >
                  This action cannot be undone. The selected
                  compliance record will be permanently deleted.
                </p>
              </div>
            </div>

            <div
              className={`mt-4 rounded-lg border ${borderColor}
              ${
                dark
                  ? "bg-[#172238]"
                  : "bg-slate-50"
              } p-3`}
            >
              <p
                className={`truncate text-xs font-medium ${textPrimary}`}
              >
                {deleteTarget.requirement}
              </p>

              <p
                className={`mt-0.5 text-[10px] ${textSecondary}`}
              >
                Compliance #{deleteTarget.id}
              </p>
            </div>

            <div
              className="mt-5 flex justify-end gap-2"
            >
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() =>
                  setDeleteTarget(null)
                }
                className={`h-9 rounded-lg border px-4
                text-xs font-medium transition
                ${
                  dark
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="h-9 rounded-lg bg-rose-600 px-4
                text-xs font-semibold text-white transition
                hover:bg-rose-700 disabled:cursor-not-allowed
                disabled:opacity-60"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}