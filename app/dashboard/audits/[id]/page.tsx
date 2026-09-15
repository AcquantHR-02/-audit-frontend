"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  getAuditById,
  type Audit,
} from "@/app/lib/api/auditApi";

import { useTheme } from "@/app/context/ThemeContext";

// ======================================================
// ICONS
// ======================================================

function ArrowLeftIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
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

function CalendarIcon() {
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
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M7 3.5v3" />
      <path d="M17 3.5v3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 16.5h.01" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function UserIcon() {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16.5 9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m10.3 4.7-7 12.6A2 2 0 0 0 5 20.3h14a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
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
// STATUS STYLE
// ======================================================

function getStatusStyle(
  status: string,
  isDark: boolean
) {
  switch (status) {
    case "Completed":
      return {
        badge: isDark
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
        icon: <CheckCircleIcon />,
        label: "Completed",
      };

    case "In Progress":
      return {
        badge: isDark
          ? "border-blue-500/25 bg-blue-500/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
        icon: <ClockIcon />,
        label: "In Progress",
      };

    case "Pending":
      return {
        badge: isDark
          ? "border-amber-500/25 bg-amber-500/10 text-amber-300"
          : "border-amber-200 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
        icon: <ClockIcon />,
        label: "Pending",
      };

    default:
      return {
        badge: isDark
          ? "border-slate-600 bg-slate-700 text-slate-300"
          : "border-slate-200 bg-slate-50 text-slate-700",
        dot: "bg-slate-400",
        icon: <ShieldIcon />,
        label: status || "Unknown",
      };
  }
}

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ======================================================
// PAGE
// ======================================================

export default function AuditDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [audit, setAudit] =
    useState<Audit | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // FETCH AUDIT
  // ======================================================

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(params.id);

        if (Number.isNaN(id)) {
          setError("Invalid audit ID.");
          return;
        }

        const data = await getAuditById(id);

        setAudit(data);
      } catch (error: any) {
        console.error(
          "Error fetching audit:",
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
            "You do not have permission to view this audit."
          );
        } else if (
          error.response?.status === 404
        ) {
          setError(
            "Audit not found. It may have been deleted."
          );
        } else if (
          error.response?.data?.message
        ) {
          setError(
            error.response.data.message
          );
        } else {
          setError(
            "Unable to load audit. Please check your backend connection."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAudit();
    }
  }, [params.id]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className={`min-h-screen p-4 md:p-5 ${
          isDark
            ? "bg-slate-900"
            : "bg-slate-50"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div
              className={`h-3 w-28 rounded ${
                isDark
                  ? "bg-slate-700"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`mt-4 h-8 w-72 rounded ${
                isDark
                  ? "bg-slate-700"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`mt-2 h-3 w-96 max-w-full rounded ${
                isDark
                  ? "bg-slate-700"
                  : "bg-slate-200"
              }`}
            />

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div
                className={`h-72 rounded-xl ${
                  isDark
                    ? "bg-slate-800"
                    : "bg-white"
                }`}
              />

              <div
                className={`h-72 rounded-xl lg:col-span-2 ${
                  isDark
                    ? "bg-slate-800"
                    : "bg-white"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div
        className={`min-h-screen px-4 py-6 ${
          isDark
            ? "bg-slate-900"
            : "bg-slate-50"
        }`}
      >
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <div
            className={`w-full rounded-xl border p-7 text-center shadow-sm ${
              isDark
                ? "border-slate-600 bg-slate-800"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                isDark
                  ? "bg-red-500/10 text-red-300"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <AlertIcon />
            </div>

            <h1
              className={`mt-4 text-lg font-bold ${
                isDark
                  ? "text-slate-100"
                  : "text-slate-900"
              }`}
            >
              Unable to Load Audit
            </h1>

            <p
              className={`mt-2 text-xs leading-5 ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {error}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/audits"
                  )
                }
                className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Back to Audits
              </button>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className={`rounded-md border px-4 py-2 text-xs font-semibold transition ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!audit) {
    return (
      <div
        className={`min-h-screen px-4 py-6 ${
          isDark
            ? "bg-slate-900"
            : "bg-slate-50"
        }`}
      >
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <div
            className={`w-full rounded-xl border p-7 text-center shadow-sm ${
              isDark
                ? "border-slate-600 bg-slate-800"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                isDark
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <FileIcon />
            </div>

            <h1
              className={`mt-4 text-lg font-bold ${
                isDark
                  ? "text-slate-100"
                  : "text-slate-900"
              }`}
            >
              Audit Not Found
            </h1>

            <p
              className={`mt-2 text-xs ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              No audit information was found
              for this ID.
            </p>

            <Link
              href="/dashboard/audits"
              className="mt-5 inline-flex rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Audits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // STATUS
  // ======================================================

  const statusStyle = getStatusStyle(
    audit.status || "",
    isDark
  );

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
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-3 flex items-center gap-1.5 text-[10px]">
          <Link
            href="/dashboard"
            className={`transition hover:text-blue-500 ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Dashboard
          </Link>

          <span
            className={
              isDark
                ? "text-slate-600"
                : "text-slate-300"
            }
          >
            /
          </span>

          <Link
            href="/dashboard/audits"
            className={`transition hover:text-blue-500 ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Audits
          </Link>

          <span
            className={
              isDark
                ? "text-slate-600"
                : "text-slate-300"
            }
          >
            /
          </span>

          <span
            className={`font-medium ${
              isDark
                ? "text-slate-200"
                : "text-slate-700"
            }`}
          >
            Details
          </span>
        </div>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className={`mb-4 rounded-xl border p-4 shadow-sm md:p-5 ${
            isDark
              ? "border-slate-600 bg-slate-800"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                    isDark
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  AUD-
                  {String(audit.id).padStart(
                    3,
                    "0"
                  )}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyle.badge}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                  />

                  {statusStyle.label}
                </span>
              </div>

              <h1
                className={`mt-2.5 truncate text-xl font-bold tracking-tight md:text-2xl ${
                  isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                }`}
                title={audit.title}
              >
                {audit.title}
              </h1>

              <p
                className={`mt-1 text-[10px] md:text-xs ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Complete information and details
                for this compliance audit.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 gap-2">
              <Link
                href="/dashboard/audits"
                className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[10px] font-semibold transition ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ArrowLeftIcon />
                All Audits
              </Link>

              <Link
                href={`/dashboard/audits/${audit.id}/edit`}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <EditIcon />
                Edit Audit
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="grid gap-4 lg:grid-cols-3">

          {/* ==================================================
              LEFT CONTENT
          ================================================== */}

          <div className="space-y-4 lg:col-span-2">

            {/* ==================================================
                AUDIT OVERVIEW
            ================================================== */}

            <div
              className={`overflow-hidden rounded-xl border shadow-sm ${
                isDark
                  ? "border-slate-600 bg-slate-800"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-4 py-3.5 ${
                  isDark
                    ? "border-slate-600"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-blue-500/10 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <FileIcon />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-bold ${
                        isDark
                          ? "text-slate-100"
                          : "text-slate-900"
                      }`}
                    >
                      Audit Overview
                    </h2>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Basic information about
                      the audit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2">

                {/* AUDIT ID */}

                <div
                  className={`p-4 ${
                    isDark
                      ? "border-b border-slate-600 sm:border-r"
                      : "border-b border-slate-100 sm:border-r"
                  }`}
                >
                  <p
                    className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Audit ID
                  </p>

                  <p
                    className={`mt-1.5 text-sm font-bold ${
                      isDark
                        ? "text-slate-100"
                        : "text-slate-900"
                    }`}
                  >
                    AUD-
                    {String(audit.id).padStart(
                      3,
                      "0"
                    )}
                  </p>
                </div>

                {/* STATUS */}

                <div
                  className={`p-4 ${
                    isDark
                      ? "border-b border-slate-600"
                      : "border-b border-slate-100"
                  }`}
                >
                  <p
                    className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Current Status
                  </p>

                  <span
                    className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${statusStyle.badge}`}
                  >
                    {statusStyle.icon}
                    {statusStyle.label}
                  </span>
                </div>

                {/* TITLE */}

                <div className="p-4 sm:col-span-2">
                  <p
                    className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Audit Title
                  </p>

                  <p
                    className={`mt-1.5 text-sm font-semibold ${
                      isDark
                        ? "text-slate-100"
                        : "text-slate-900"
                    }`}
                  >
                    {audit.title || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div
              className={`rounded-xl border shadow-sm ${
                isDark
                  ? "border-slate-600 bg-slate-800"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-4 py-3.5 ${
                  isDark
                    ? "border-slate-600"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-violet-500/10 text-violet-300"
                        : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    <FileIcon />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-bold ${
                        isDark
                          ? "text-slate-100"
                          : "text-slate-900"
                      }`}
                    >
                      Audit Description
                    </h2>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Description and scope of
                      the audit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div
                  className={`rounded-lg border p-4 ${
                    isDark
                      ? "border-slate-600 bg-slate-700/50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <p
                    className={`whitespace-pre-wrap text-xs leading-6 ${
                      isDark
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}
                  >
                    {audit.description ||
                      "No description has been provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                TIMELINE
            ================================================== */}

            <div
              className={`rounded-xl border shadow-sm ${
                isDark
                  ? "border-slate-600 bg-slate-800"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-4 py-3.5 ${
                  isDark
                    ? "border-slate-600"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <CalendarIcon />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-bold ${
                        isDark
                          ? "text-slate-100"
                          : "text-slate-900"
                      }`}
                    >
                      Audit Timeline
                    </h2>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Scheduled audit period.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2">

                {/* START DATE */}

                <div
                  className={`rounded-lg border p-3.5 ${
                    isDark
                      ? "border-slate-600 bg-slate-700/40"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isDark
                          ? "bg-blue-500/10 text-blue-300"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <CalendarIcon />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-[9px] font-semibold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        Start Date
                      </p>

                      <p
                        className={`mt-1 text-xs font-bold ${
                          isDark
                            ? "text-slate-100"
                            : "text-slate-900"
                        }`}
                      >
                        {formatDate(
                          audit.startDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* END DATE */}

                <div
                  className={`rounded-lg border p-3.5 ${
                    isDark
                      ? "border-slate-600 bg-slate-700/40"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isDark
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <CalendarIcon />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-[9px] font-semibold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        End Date
                      </p>

                      <p
                        className={`mt-1 text-xs font-bold ${
                          isDark
                            ? "text-slate-100"
                            : "text-slate-900"
                        }`}
                      >
                        {formatDate(
                          audit.endDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <div className="space-y-4">

            {/* ==================================================
                AUDITOR
            ================================================== */}

            <div
              className={`rounded-xl border shadow-sm ${
                isDark
                  ? "border-slate-600 bg-slate-800"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-4 py-3.5 ${
                  isDark
                    ? "border-slate-600"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-cyan-500/10 text-cyan-300"
                        : "bg-cyan-50 text-cyan-600"
                    }`}
                  >
                    <UserIcon />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-bold ${
                        isDark
                          ? "text-slate-100"
                          : "text-slate-900"
                      }`}
                    >
                      Auditor
                    </h2>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Assigned auditor information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {audit.auditor ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isDark
                            ? "bg-blue-500/15 text-blue-300"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {audit.auditor.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "A"}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-xs font-bold ${
                            isDark
                              ? "text-slate-100"
                              : "text-slate-900"
                          }`}
                        >
                          {audit.auditor.name}
                        </p>

                        <p
                          className={`mt-0.5 truncate text-[10px] ${
                            isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        >
                          {audit.auditor.email ||
                            "-"}
                        </p>
                      </div>
                    </div>

                    {audit.auditor.role?.name && (
                      <div
                        className={`mt-4 border-t pt-3 ${
                          isDark
                            ? "border-slate-600"
                            : "border-slate-100"
                        }`}
                      >
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark
                              ? "text-slate-400"
                              : "text-slate-400"
                          }`}
                        >
                          Role
                        </p>

                        <p
                          className={`mt-1.5 text-xs font-semibold ${
                            isDark
                              ? "text-slate-200"
                              : "text-slate-800"
                          }`}
                        >
                          {audit.auditor.role.name}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`rounded-lg border border-dashed p-5 text-center ${
                      isDark
                        ? "border-slate-600 bg-slate-700/40"
                        : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    <div
                      className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                        isDark
                          ? "bg-slate-700 text-slate-400"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <UserIcon />
                    </div>

                    <p
                      className={`mt-3 text-xs font-semibold ${
                        isDark
                          ? "text-slate-200"
                          : "text-slate-700"
                      }`}
                    >
                      No Auditor Assigned
                    </p>

                    <p
                      className={`mt-1 text-[10px] leading-5 ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      This audit currently has
                      no assigned auditor.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                QUICK SUMMARY
            ================================================== */}

            <div
              className={`rounded-xl border shadow-sm ${
                isDark
                  ? "border-slate-600 bg-slate-800"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`border-b px-4 py-3.5 ${
                  isDark
                    ? "border-slate-600"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-violet-500/10 text-violet-300"
                        : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    <ShieldIcon />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-bold ${
                        isDark
                          ? "text-slate-100"
                          : "text-slate-900"
                      }`}
                    >
                      Quick Summary
                    </h2>

                    <p
                      className={`mt-0.5 text-[10px] ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Key audit information.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`divide-y ${
                  isDark
                    ? "divide-slate-600"
                    : "divide-slate-100"
                }`}
              >
                {/* STATUS */}

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span
                    className={`text-[10px] ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Status
                  </span>

                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${statusStyle.badge}`}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* ID */}

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span
                    className={`text-[10px] ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Audit ID
                  </span>

                  <span
                    className={`text-[10px] font-semibold ${
                      isDark
                        ? "text-slate-200"
                        : "text-slate-800"
                    }`}
                  >
                    #{audit.id}
                  </span>
                </div>

                {/* START */}

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span
                    className={`text-[10px] ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Start Date
                  </span>

                  <span
                    className={`text-[10px] font-semibold ${
                      isDark
                        ? "text-slate-200"
                        : "text-slate-800"
                    }`}
                  >
                    {formatDate(
                      audit.startDate
                    )}
                  </span>
                </div>

                {/* END */}

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span
                    className={`text-[10px] ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    End Date
                  </span>

                  <span
                    className={`text-[10px] font-semibold ${
                      isDark
                        ? "text-slate-200"
                        : "text-slate-800"
                    }`}
                  >
                    {formatDate(
                      audit.endDate
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div
              className={`rounded-xl border p-4 shadow-sm ${
                isDark
                  ? "border-slate-600 bg-slate-800"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p
                className={`text-xs font-bold ${
                  isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                }`}
              >
                Audit Actions
              </p>

              <p
                className={`mt-1 text-[10px] leading-5 ${
                  isDark
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Manage this audit using the
                available actions.
              </p>

              <Link
                href={`/dashboard/audits/${audit.id}/edit`}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-700"
              >
                <EditIcon />
                Edit This Audit
              </Link>

              <Link
                href="/dashboard/audits"
                className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[10px] font-semibold transition ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ArrowLeftIcon />
                Back to Audit List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}