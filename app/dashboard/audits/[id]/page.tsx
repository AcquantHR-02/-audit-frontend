"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import type { Audit } from "@/app/lib/api/auditApi";
import { getAllAudits } from "@/app/lib/api/auditApi";
import { useTheme } from "@/app/context/ThemeContext";

// ======================================================
// ICONS
// ======================================================

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function FileIcon({ size = 18 }: { size?: number }) {
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
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function CalendarIcon({ size = 18 }: { size?: number }) {
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
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M7 3.5v3" />
      <path d="M17 3.5v3" />
      <path d="M3.5 9.5h17" />
    </svg>
  );
}

function UserIcon({ size = 18 }: { size?: number }) {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2" />
    </svg>
  );
}

function ShieldIcon({ size = 18 }: { size?: number }) {
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
      <path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
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

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
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
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      <path d="M10.3 4.1 2.7 17.3A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.7L13.7 4.1a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

// ======================================================
// DATE FORMAT
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
// STATUS
// ======================================================

function getStatusStyle(status: string, isDark: boolean) {
  switch (status) {
    case "Completed":
      return {
        badge: isDark
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
        icon: <CheckIcon />,
      };

    case "In Progress":
      return {
        badge: isDark
          ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
        icon: <ClockIcon />,
      };

    case "Pending":
      return {
        badge: isDark
          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
          : "border-amber-200 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
        icon: <ClockIcon />,
      };

    default:
      return {
        badge: isDark
          ? "border-slate-600 bg-slate-700/50 text-slate-300"
          : "border-slate-200 bg-slate-50 text-slate-600",
        dot: "bg-slate-400",
        icon: <ShieldIcon size={13} />,
      };
  }
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
  icon,
  label,
  children,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`border p-4 transition ${
        isDark
          ? "border-slate-700/80 bg-[#182235]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
            isDark
              ? "bg-blue-500/10 text-blue-300"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {label}
          </p>

          <div className="mt-1.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function AuditDetailsPage() {
  const params = useParams();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const auditId = useMemo(() => {
    const value = params?.id;

    if (Array.isArray(value)) {
      return Number(value[0]);
    }

    return Number(value);
  }, [params]);

  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // FETCH AUDIT
  // ====================================================

  useEffect(() => {
    let mounted = true;

    async function fetchAudit() {
      if (!auditId || Number.isNaN(auditId)) {
        setError("Invalid audit ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * We are using the existing audit API.
         * This avoids requiring a new backend endpoint.
         */
        const response = await getAllAudits(0, 1000);

        const audits = response?.content ?? [];

        const selectedAudit = audits.find(
          (item: Audit) => Number(item.id) === auditId
        );

        if (!selectedAudit) {
          setError(`Audit #${auditId} was not found.`);
          setAudit(null);
          return;
        }

        if (mounted) {
          setAudit(selectedAudit);
        }
      } catch (err) {
        console.error("Failed to load audit:", err);

        if (mounted) {
          setError(
            "Unable to load audit details. Please check your session and backend."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAudit();

    return () => {
      mounted = false;
    };
  }, [auditId]);

  // ====================================================
  // INITIALS
  // ====================================================

  const initials =
    audit?.auditor?.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AU";

  // ====================================================
  // STATUS
  // ====================================================

  const statusStyle = getStatusStyle(
    audit?.status || "",
    isDark
  );

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        className={`min-h-full p-4 sm:p-5 lg:p-6 ${
          isDark ? "bg-[#0b1220]" : "bg-[#f5f7fb]"
        }`}
      >
        <div className="mx-auto max-w-[1200px]">
          <div
            className={`mb-5 h-10 w-32 animate-pulse rounded-md ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          <div
            className={`h-36 animate-pulse rounded-lg border ${
              isDark
                ? "border-slate-800 bg-[#111a2e]"
                : "border-slate-200 bg-white"
            }`}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className={`h-32 animate-pulse rounded-lg ${
                isDark ? "bg-[#111a2e]" : "bg-white"
              }`}
            />

            <div
              className={`h-32 animate-pulse rounded-lg ${
                isDark ? "bg-[#111a2e]" : "bg-white"
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error || !audit) {
    return (
      <div
        className={`min-h-full p-4 sm:p-5 lg:p-6 ${
          isDark ? "bg-[#0b1220]" : "bg-[#f5f7fb]"
        }`}
      >
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/dashboard/audits"
            className={`mb-5 inline-flex items-center gap-2 border px-3 py-2 text-[11px] font-semibold transition ${
              isDark
                ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:border-blue-500/40 hover:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
            }`}
          >
            <ArrowLeftIcon />
            Back to Audits
          </Link>

          <div
            className={`flex min-h-[300px] flex-col items-center justify-center rounded-lg border text-center ${
              isDark
                ? "border-slate-700 bg-[#111a2e]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                isDark
                  ? "bg-red-500/10 text-red-400"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <AlertIcon />
            </div>

            <h2
              className={`text-base font-bold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Audit Not Found
            </h2>

            <p
              className={`mt-2 max-w-md text-xs ${
                isDark ? "text-slate-500" : "text-slate-500"
              }`}
            >
              {error || "The requested audit could not be found."}
            </p>

            <Link
              href="/dashboard/audits"
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeftIcon />
              Back to Audits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div
      className={`min-h-full w-full overflow-x-hidden ${
        isDark ? "bg-[#0b1220]" : "bg-[#f5f7fb]"
      }`}
    >
      <div className="mx-auto max-w-[1200px] p-4 sm:p-5 lg:p-6">

        {/* ==================================================
            TOP NAVIGATION
        ================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/audits"
            className={`inline-flex w-fit items-center gap-2 border px-3 py-2 text-[11px] font-semibold transition ${
              isDark
                ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
            }`}
          >
            <ArrowLeftIcon />
            Back to Audits
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Audit Management
            </span>

            <span
              className={
                isDark ? "text-slate-700" : "text-slate-300"
              }
            >
              /
            </span>

            <span
              className={`text-[10px] font-semibold ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Audit Details
            </span>
          </div>
        </div>

        {/* ==================================================
            HEADER CARD
        ================================================== */}

        <section
          className={`relative overflow-hidden rounded-lg border ${
            isDark
              ? "border-slate-700 bg-[#111a2e]"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* TOP ACCENT */}

          <div className="h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              {/* LEFT */}

              <div className="flex min-w-0 items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${
                    isDark
                      ? "border-blue-400/10 bg-blue-500/10 text-blue-300"
                      : "border-blue-100 bg-blue-50 text-blue-600"
                  }`}
                >
                  <FileIcon size={22} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2.5 py-1 text-[9px] font-bold tracking-wider ${
                        isDark
                          ? "border-slate-700 bg-slate-800 text-slate-300"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      AUD-{String(audit.id).padStart(3, "0")}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-semibold ${statusStyle.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                      />

                      {audit.status || "Unknown"}
                    </span>
                  </div>

                  <h1
                    className={`break-words text-xl font-bold tracking-tight sm:text-2xl ${
                      isDark ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {audit.title || "Untitled Audit"}
                  </h1>

                  <p
                    className={`mt-1.5 text-xs ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Audit record and operational details
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <Link
                href={`/dashboard/audits/${audit.id}/edit`}
                className="inline-flex w-fit items-center justify-center gap-2 bg-blue-600 px-4 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <EditIcon />
                Edit Audit
              </Link>
            </div>
          </div>
        </section>

        {/* ==================================================
            AUDIT INFORMATION
        ================================================== */}

        <section
          className={`mt-4 overflow-hidden rounded-lg border ${
            isDark
              ? "border-slate-700 bg-[#111a2e]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`flex items-center gap-3 border-b px-4 py-3 ${
              isDark
                ? "border-slate-700 bg-slate-800/40"
                : "border-slate-200 bg-slate-50/70"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                isDark
                  ? "bg-blue-500/10 text-blue-300"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <ShieldIcon size={16} />
            </div>

            <div>
              <h2
                className={`text-xs font-bold ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Audit Information
              </h2>

              <p
                className={`mt-0.5 text-[9px] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Core audit details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* ID */}

            <div
              className={`border-b p-4 md:border-r ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <p
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Audit ID
              </p>

              <p
                className={`mt-1.5 text-sm font-semibold ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                AUD-{String(audit.id).padStart(3, "0")}
              </p>
            </div>

            {/* STATUS */}

            <div
              className={`border-b p-4 ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <p
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Current Status
              </p>

              <span
                className={`mt-1.5 inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-semibold ${statusStyle.badge}`}
              >
                {statusStyle.icon}
                {audit.status || "Unknown"}
              </span>
            </div>

            {/* TITLE */}

            <div
              className={`border-b p-4 md:col-span-2 ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <p
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Audit Title
              </p>

              <p
                className={`mt-1.5 text-sm font-semibold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                {audit.title || "-"}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            TIMELINE + AUDITOR
        ================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* TIMELINE */}

          <InfoCard
            icon={<CalendarIcon />}
            label="Audit Timeline"
            isDark={isDark}
          >
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border p-3 ${
                  isDark
                    ? "border-slate-700 bg-[#172235]"
                    : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <p
                  className={`text-[8px] font-bold uppercase tracking-wider ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Start Date
                </p>

                <p
                  className={`mt-1 text-[11px] font-bold ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {formatDate(audit.startDate)}
                </p>
              </div>

              <div
                className={`border p-3 ${
                  isDark
                    ? "border-slate-700 bg-[#172235]"
                    : "border-slate-200 bg-slate-50/70"
                }`}
              >
                <p
                  className={`text-[8px] font-bold uppercase tracking-wider ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  End Date
                </p>

                <p
                  className={`mt-1 text-[11px] font-bold ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {formatDate(audit.endDate)}
                </p>
              </div>
            </div>
          </InfoCard>

          {/* AUDITOR */}

          <InfoCard
            icon={<UserIcon />}
            label="Assigned Auditor"
            isDark={isDark}
          >
            {audit.auditor ? (
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isDark
                      ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/10"
                      : "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                  }`}
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-[12px] font-bold ${
                      isDark ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {audit.auditor.name || "Unknown Auditor"}
                  </p>

                  <p
                    className={`mt-1 truncate text-[10px] ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {audit.auditor.email || "No email available"}
                  </p>

                  {audit.auditor.role?.name && (
                    <span
                      className={`mt-1.5 inline-block text-[9px] font-medium ${
                        isDark ? "text-blue-300" : "text-blue-600"
                      }`}
                    >
                      {audit.auditor.role.name}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`flex items-center gap-2 border border-dashed px-3 py-3 ${
                  isDark
                    ? "border-slate-700 text-slate-500"
                    : "border-slate-200 text-slate-400"
                }`}
              >
                <UserIcon size={15} />

                <span className="text-[10px] font-medium">
                  No auditor assigned
                </span>
              </div>
            )}
          </InfoCard>
        </div>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <section
          className={`mt-4 overflow-hidden rounded-lg border ${
            isDark
              ? "border-slate-700 bg-[#111a2e]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`flex items-center gap-3 border-b px-4 py-3 ${
              isDark
                ? "border-slate-700 bg-slate-800/40"
                : "border-slate-200 bg-slate-50/70"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                isDark
                  ? "bg-blue-500/10 text-blue-300"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <FileIcon size={16} />
            </div>

            <div>
              <h2
                className={`text-xs font-bold ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Description
              </h2>

              <p
                className={`mt-0.5 text-[9px] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Audit scope and details
              </p>
            </div>
          </div>

          <div className="p-4">
            <div
              className={`min-h-[120px] border p-4 ${
                isDark
                  ? "border-slate-700 bg-[#172235]"
                  : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <p
                className={`whitespace-pre-wrap text-[11px] leading-6 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {audit.description ||
                  "No description has been provided for this audit."}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            BOTTOM ACTIONS
        ================================================== */}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/audits"
            className={`inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-[11px] font-semibold transition ${
              isDark
                ? "border-slate-700 bg-[#111a2e] text-slate-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ArrowLeftIcon />
            Back to Audits
          </Link>

          <Link
            href={`/dashboard/audits/${audit.id}/edit`}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <EditIcon />
            Edit Audit
          </Link>
        </div>
      </div>
    </div>
  );
}