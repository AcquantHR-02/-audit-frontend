"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { deleteAudit, getAllAudits, type Audit } from "@/app/lib/api/auditApi";

import { useTheme } from "@/app/context/ThemeContext";

/* =========================================================
   ICONS
========================================================= */

function SearchIcon({ size = 18 }: { size?: number }) {
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
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PlusIcon({ size = 18 }: { size?: number }) {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function EyeIcon({ size = 17 }: { size?: number }) {
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
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon({ size = 17 }: { size?: number }) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon({ size = 17 }: { size?: number }) {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function ClipboardIcon({ size = 20 }: { size?: number }) {
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
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V2h6v2" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
      <path d="M9 18h4" />
    </svg>
  );
}

function CheckIcon({ size = 18 }: { size?: number }) {
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
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ClockIcon({ size = 18 }: { size?: number }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon({ size = 16 }: { size?: number }) {
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
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function UserIcon({ size = 16 }: { size?: number }) {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.4 3.2-5 7-5s6.2 1.6 7 5" />
    </svg>
  );
}

function AlertIcon({ size = 18 }: { size?: number }) {
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
      <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function XIcon({ size = 19 }: { size?: number }) {
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
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function RefreshIcon({
  size = 17,
  spinning = false,
}: {
  size?: number;
  spinning?: boolean;
}) {
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
      className={spinning ? "animate-spin" : ""}
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.7-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.7 2M20 19v-4h-4" />
    </svg>
  );
}

function LoaderIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 16 }: { size?: number }) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 16 }: { size?: number }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name?: string) {
  if (!name) return "NA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status, isDark }: { status?: string; isDark: boolean }) {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized === "completed") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
          isDark ?
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Completed
      </span>
    );
  }

  if (normalized === "in progress") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
          isDark ?
            "border-blue-500/20 bg-blue-500/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        In Progress
      </span>
    );
  }

  if (normalized === "pending") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
          isDark ?
            "border-amber-500/20 bg-amber-500/10 text-amber-300"
          : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        isDark ?
          "border-slate-600 bg-slate-700/50 text-slate-300"
        : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      {status || "Unknown"}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
  iconClass,
  isDark,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 transition ${
        isDark ?
          "border-slate-700/70 bg-[#111a2e] hover:border-slate-600"
        : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate text-[11px] font-medium ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <p
            className={`mt-0.5 text-xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>

        <div className={`rounded-lg p-2 ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

/* =========================================================
   VIEW AUDIT MODAL
========================================================= */

function AuditViewModal({
  audit,
  onClose,
  onEdit,
  isDark,
}: {
  audit: Audit;
  onClose: () => void;
  onEdit: (audit: Audit) => void;
  isDark: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`absolute inset-0 backdrop-blur-sm ${
          isDark ? "bg-slate-950/70" : "bg-slate-900/35"
        }`}
      />

      <div
        className={`relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
          isDark ? "border-slate-700 bg-[#111a2e]" : "border-slate-200 bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between gap-4 border-b px-5 py-4 ${
            isDark ? "border-slate-700/70" : "border-slate-200"
          }`}
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  isDark ?
                    "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-500"
                }`}
              >
                AUDIT #{audit.id}
              </span>

              <StatusBadge status={audit.status} isDark={isDark} />
            </div>

            <h2
              className={`truncate text-lg font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {audit.title || "Untitled Audit"}
            </h2>

            <p
              className={`mt-1 text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Audit details and assignment information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`shrink-0 rounded-lg p-2 transition ${
              isDark ?
                "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-xl border p-3.5 ${
                isDark ?
                  "border-slate-700/70 bg-slate-900/30"
                : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Start Date
                </span>
              </div>

              <p
                className={`mt-2 text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {formatDate(audit.startDate)}
              </p>
            </div>

            <div
              className={`rounded-xl border p-3.5 ${
                isDark ?
                  "border-slate-700/70 bg-slate-900/30"
                : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  End Date
                </span>
              </div>

              <p
                className={`mt-2 text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {formatDate(audit.endDate)}
              </p>
            </div>
          </div>

          {/* Auditor */}
          <div
            className={`mt-4 rounded-xl border p-4 ${
              isDark ?
                "border-slate-700/70 bg-slate-900/30"
              : "border-slate-200 bg-slate-50/70"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <UserIcon />

              <span
                className={`text-[11px] font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Assigned Auditor
              </span>
            </div>

            {audit.auditor ?
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isDark ?
                      "bg-blue-500/15 text-blue-300"
                    : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {getInitials(audit.auditor.name)}
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {audit.auditor.name}
                  </p>

                  <p
                    className={`truncate text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {audit.auditor.email}
                  </p>
                </div>
              </div>
            : <p
                className={`text-sm ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                No auditor assigned
              </p>
            }
          </div>

          {/* Description */}
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2">
              <ClipboardIcon size={17} />

              <h3
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Description
              </h3>
            </div>

            <div
              className={`rounded-xl border p-4 ${
                isDark ?
                  "border-slate-700/70 bg-slate-900/30"
                : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <p
                className={`whitespace-pre-wrap text-sm leading-6 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {audit.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-2 border-t px-5 py-3 ${
            isDark ? "border-slate-700/70" : "border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
              isDark ?
                "border-slate-700 text-slate-300 hover:bg-slate-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onEdit(audit)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <EditIcon size={15} />
            Edit Audit
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteAuditModal({
  audit,
  deleting,
  onCancel,
  onConfirm,
  isDark,
}: {
  audit: Audit;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDark: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [deleting, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onCancel();
        }
      }}
    >
      <div
        className={`absolute inset-0 backdrop-blur-sm ${
          isDark ? "bg-slate-950/75" : "bg-slate-900/40"
        }`}
      />

      <div
        className={`relative w-full max-w-md rounded-2xl border p-5 shadow-2xl ${
          isDark ? "border-slate-700 bg-[#111a2e]" : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
            }`}
          >
            <AlertIcon />
          </div>

          <div className="min-w-0">
            <h2
              className={`text-base font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Delete Audit?
            </h2>

            <p
              className={`mt-1 text-xs leading-5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              This action cannot be undone. The selected audit will be
              permanently removed.
            </p>
          </div>

          {!deleting && (
            <button
              type="button"
              onClick={onCancel}
              className={`ml-auto rounded-lg p-1.5 ${
                isDark ?
                  "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <XIcon size={17} />
            </button>
          )}
        </div>

        <div
          className={`mt-5 rounded-xl border p-3 ${
            isDark ?
              "border-slate-700 bg-slate-900/40"
            : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isDark ?
                  "bg-blue-500/10 text-blue-300"
                : "bg-blue-50 text-blue-600"
              }`}
            >
              <ClipboardIcon size={17} />
            </div>

            <div className="min-w-0">
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Audit #{audit.id}
              </p>

              <p
                className={`truncate text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {audit.title}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark ?
                "border-slate-700 text-slate-300 hover:bg-slate-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ?
              <>
                <LoaderIcon size={15} />
                Deleting...
              </>
            : <>
                <TrashIcon size={15} />
                Delete
              </>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function TableSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className={`grid grid-cols-6 gap-4 rounded-lg px-4 py-4 ${
            isDark ? "bg-slate-900/40" : "bg-slate-50"
          }`}
        >
          <div
            className={`h-4 animate-pulse rounded ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          <div
            className={`col-span-2 h-4 animate-pulse rounded ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          <div
            className={`h-4 animate-pulse rounded ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          <div
            className={`h-4 animate-pulse rounded ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          <div
            className={`h-4 animate-pulse rounded ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const pages: (number | "...")[] = [];

  pages.push(0);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages - 2, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 4) {
    pages.push("...");
  }

  pages.push(totalPages - 1);

  return pages;
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AuditsPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  /* =======================================================
     SERVER PAGINATION STATE
  ======================================================= */

  const [audits, setAudits] = useState<Audit[]>([]);

  const [currentPage, setCurrentPage] = useState(0);

  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  /* =======================================================
     UI STATE
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Audit | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* =======================================================
     FETCH AUDITS
  ======================================================= */

  const fetchAudits = useCallback(
    async (page = currentPage, size = pageSize, showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        /*
         * IMPORTANT:
         *
         * This is real SERVER-SIDE pagination.
         *
         * page = current page
         * size = records per page
         *
         * Example:
         * page=0&size=10
         */

        const data = await getAllAudits(page, size);

        console.log("AUDITS PAGINATED RESPONSE:", data);

        /*
         * data.content is Audit[]
         */
        setAudits(data.content ?? []);

        /*
         * Pagination metadata comes from backend.
         */
        setTotalPages(data.totalPages ?? 0);

        setTotalElements(data.totalElements ?? 0);
      } catch (err) {
        console.error("Failed to fetch audits:", err);

        setError("Unable to load audit records. Please try again.");

        setAudits([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, pageSize],
  );

  /* =======================================================
     FETCH WHEN PAGE / SIZE CHANGES
  ======================================================= */

  useEffect(() => {
    fetchAudits(currentPage, pageSize);
  }, [currentPage, pageSize, fetchAudits]);

  /* =======================================================
     RESET PAGE WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [search, statusFilter]);

  /* =======================================================
     STATS
     
     NOTE:
     These stats are calculated from the CURRENT PAGE because
     server-side pagination only sends current-page records.

     If you want true database-wide stats later, backend should
     expose a separate summary endpoint.
  ======================================================= */

  const completedAudits = audits.filter(
    (audit) => audit.status?.toLowerCase() === "completed",
  ).length;

  const inProgressAudits = audits.filter(
    (audit) => audit.status?.toLowerCase() === "in progress",
  ).length;

  const pendingAudits = audits.filter(
    (audit) => audit.status?.toLowerCase() === "pending",
  ).length;

  /* =======================================================
     CLIENT FILTER
     
     Search/status filtering is applied to the records returned
     by the current server page.
     
     For true server-side search/filtering, backend API needs
     search/status parameters.
  ======================================================= */

  const filteredAudits = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return audits.filter((audit) => {
      const matchesSearch =
        !normalizedSearch ||
        String(audit.id).includes(normalizedSearch) ||
        audit.title?.toLowerCase().includes(normalizedSearch) ||
        audit.description?.toLowerCase().includes(normalizedSearch) ||
        audit.auditor?.name?.toLowerCase().includes(normalizedSearch) ||
        audit.auditor?.email?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        audit.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [audits, search, statusFilter]);

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.id);

      await deleteAudit(deleteTarget.id);

      /*
       * If deleting the last item on the current page,
       * move one page back when possible.
       */
      const isLastItemOnPage = audits.length === 1;

      if (isLastItemOnPage && currentPage > 0) {
        setCurrentPage((page) => page - 1);
      } else {
        await fetchAudits(currentPage, pageSize, true);
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete audit:", err);

      setError("Failed to delete audit. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     PAGE CHANGE
  ======================================================= */

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  /* =======================================================
     PAGE RANGE
  ======================================================= */

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const firstRecord = totalElements === 0 ? 0 : currentPage * pageSize + 1;

  const lastRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  /* =======================================================
     STYLES
  ======================================================= */

  const pageBackground =
    isDark ? "bg-[#0b1220] text-slate-100" : "bg-[#f7f9fc] text-slate-900";

  const cardBackground =
    isDark ? "border-slate-700/70 bg-[#111a2e]" : "border-slate-200 bg-white";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className={`min-h-full ${pageBackground}`}>
      <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 lg:px-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isDark ?
                  "bg-blue-500/10 text-blue-300"
                : "bg-blue-50 text-blue-600"
              }`}
            >
              <ClipboardIcon />
            </div>

            <div>
              <h1
                className={`text-xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Audits
              </h1>

              <p
                className={`text-[11px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Manage and monitor audit activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchAudits(currentPage, pageSize, true)}
              disabled={refreshing || loading}
              title="Refresh audits"
              className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark ?
                  "border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <RefreshIcon spinning={refreshing} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Create */}
            <Link
              href="/dashboard/audits/create"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <PlusIcon size={16} />
              New Audit
            </Link>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className={`mb-4 flex items-start gap-3 rounded-xl border p-3 ${
              isDark ?
                "border-red-500/20 bg-red-500/5 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <AlertIcon size={17} />

            <div className="flex-1">
              <p className="text-xs font-semibold">{error}</p>

              <button
                type="button"
                onClick={() => fetchAudits(currentPage, pageSize)}
                className="mt-1 text-[11px] font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded p-1"
            >
              <XIcon size={15} />
            </button>
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <StatCard
            title="Total Audits"
            value={totalElements}
            isDark={isDark}
            icon={<ClipboardIcon size={18} />}
            iconClass={
              isDark ?
                "bg-blue-500/10 text-blue-300"
              : "bg-blue-50 text-blue-600"
            }
          />

          <StatCard
            title="Completed"
            value={completedAudits}
            isDark={isDark}
            icon={<CheckIcon size={18} />}
            iconClass={
              isDark ?
                "bg-emerald-500/10 text-emerald-300"
              : "bg-emerald-50 text-emerald-600"
            }
          />

          <StatCard
            title="In Progress"
            value={inProgressAudits}
            isDark={isDark}
            icon={<ClockIcon size={18} />}
            iconClass={
              isDark ?
                "bg-blue-500/10 text-blue-300"
              : "bg-blue-50 text-blue-600"
            }
          />

          <StatCard
            title="Pending"
            value={pendingAudits}
            isDark={isDark}
            icon={<ClockIcon size={18} />}
            iconClass={
              isDark ?
                "bg-amber-500/10 text-amber-300"
              : "bg-amber-50 text-amber-600"
            }
          />
        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className={`overflow-hidden rounded-xl border ${cardBackground}`}>
          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div
            className={`flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between ${
              isDark ? "border-slate-700/70" : "border-slate-200"
            }`}
          >
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <span
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <SearchIcon size={16} />
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search current page..."
                className={`h-9 w-full rounded-lg border pl-9 pr-9 text-xs outline-none transition ${
                  isDark ?
                    "border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500 focus:border-blue-500"
                  : "border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
                }`}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 ${
                    isDark ?
                      "text-slate-500 hover:text-slate-300"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`h-9 rounded-lg border px-3 text-xs font-medium outline-none transition ${
                  isDark ?
                    "border-slate-700 bg-slate-900/50 text-slate-200 focus:border-blue-500"
                  : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                }`}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Page Size */}
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(0);
                }}
                className={`h-9 rounded-lg border px-3 text-xs font-medium outline-none transition ${
                  isDark ?
                    "border-slate-700 bg-slate-900/50 text-slate-200 focus:border-blue-500"
                  : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                }`}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>

          {/* =================================================
              RESULT INFO
          ================================================= */}

          <div
            className={`flex flex-col gap-1 border-b px-3 py-2 sm:flex-row sm:items-center sm:justify-between ${
              isDark ? "border-slate-700/70" : "border-slate-100"
            }`}
          >
            <p
              className={`text-[11px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Showing{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {firstRecord}
              </span>
              {" – "}
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {lastRecord}
              </span>{" "}
              of{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {totalElements}
              </span>{" "}
              audits
            </p>

            <p
              className={`text-[10px] ${
                isDark ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
            </p>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ?
            <TableSkeleton isDark={isDark} />
          : filteredAudits.length === 0 ?
            /* =================================================
               EMPTY STATE
            ================================================= */
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isDark ?
                    "bg-slate-800 text-slate-500"
                  : "bg-slate-100 text-slate-400"
                }`}
              >
                <ClipboardIcon size={25} />
              </div>

              <h3
                className={`mt-4 text-sm font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {search || statusFilter !== "All" ?
                  "No matching audits"
                : "No audits found"}
              </h3>

              <p
                className={`mt-1 max-w-sm text-xs leading-5 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {search || statusFilter !== "All" ?
                  "Try changing your search or status filter."
                : "Create your first audit to start managing audit activities."}
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          : <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ?
                          "border-slate-700/70 bg-slate-900/20"
                        : "border-slate-100 bg-slate-50/70"
                      }`}
                    >
                      <th
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Audit
                      </th>

                      <th
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Timeline
                      </th>

                      <th
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Auditor
                      </th>

                      <th
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Status
                      </th>

                      <th
                        className={`px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAudits.map((audit) => (
                      <tr
                        key={audit.id}
                        className={`border-b transition ${
                          isDark ?
                            "border-slate-700/50 hover:bg-slate-800/30"
                          : "border-slate-100 hover:bg-slate-50/80"
                        }`}
                      >
                        {/* Audit */}
                        <td className="max-w-[360px] px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                                isDark ?
                                  "bg-blue-500/10 text-blue-300"
                                : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              #{audit.id}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`truncate text-sm font-semibold ${
                                  isDark ? "text-slate-100" : "text-slate-800"
                                }`}
                              >
                                {audit.title || "Untitled Audit"}
                              </p>

                              <p
                                className={`mt-0.5 line-clamp-1 text-[11px] ${
                                  isDark ? "text-slate-500" : "text-slate-400"
                                }`}
                              >
                                {audit.description ||
                                  "No description available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Timeline */}
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="space-y-1">
                            <div
                              className={`flex items-center gap-1.5 text-[11px] ${
                                isDark ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              <CalendarIcon size={13} />
                              {formatDate(audit.startDate)}
                            </div>

                            <div
                              className={`flex items-center gap-1.5 text-[10px] ${
                                isDark ? "text-slate-500" : "text-slate-400"
                              }`}
                            >
                              → {formatDate(audit.endDate)}
                            </div>
                          </div>
                        </td>

                        {/* Auditor */}
                        <td className="px-4 py-3">
                          {audit.auditor ?
                            <div className="flex max-w-[190px] items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isDark ?
                                    "bg-slate-800 text-slate-300"
                                  : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {getInitials(audit.auditor.name)}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={`truncate text-xs font-semibold ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                  }`}
                                >
                                  {audit.auditor.name}
                                </p>

                                <p
                                  className={`truncate text-[10px] ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                  }`}
                                >
                                  {audit.auditor.email}
                                </p>
                              </div>
                            </div>
                          : <span
                              className={`text-xs ${
                                isDark ? "text-slate-500" : "text-slate-400"
                              }`}
                            >
                              Unassigned
                            </span>
                          }
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={audit.status} isDark={isDark} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            {/* View */}
                            <button
                              type="button"
                              title="View audit"
                              onClick={() => setSelectedAudit(audit)}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isDark ?
                                  "border-slate-700 text-slate-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                                : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              <EyeIcon size={15} />
                            </button>

                            {/* Edit */}
                            <Link
                              href={`/dashboard/audits/${audit.id}/edit`}
                              title="Edit audit"
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isDark ?
                                  "border-slate-700 text-slate-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
                                : "border-slate-200 text-slate-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                              }`}
                            >
                              <EditIcon size={15} />
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              title="Delete audit"
                              onClick={() => setDeleteTarget(audit)}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isDark ?
                                  "border-slate-700 text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                                : "border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              }`}
                            >
                              <TrashIcon size={15} />
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

              <div className="space-y-2 p-3 md:hidden">
                {filteredAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className={`rounded-xl border p-3 ${
                      isDark ?
                        "border-slate-700/70 bg-slate-900/20"
                      : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                            isDark ?
                              "bg-blue-500/10 text-blue-300"
                            : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          #{audit.id}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className={`truncate text-sm font-semibold ${
                              isDark ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {audit.title || "Untitled Audit"}
                          </h3>

                          <p
                            className={`mt-0.5 line-clamp-1 text-[10px] ${
                              isDark ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {audit.description || "No description available"}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={audit.status} isDark={isDark} />
                    </div>

                    <div
                      className={`mt-3 grid grid-cols-2 gap-2 border-t pt-3 ${
                        isDark ? "border-slate-700/50" : "border-slate-100"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          Timeline
                        </p>

                        <p
                          className={`mt-1 text-[11px] ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {formatDate(audit.startDate)} →{" "}
                          {formatDate(audit.endDate)}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-[9px] font-semibold uppercase tracking-wide ${
                            isDark ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          Auditor
                        </p>

                        <p
                          className={`mt-1 truncate text-[11px] ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {audit.auditor?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedAudit(audit)}
                        className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold ${
                          isDark ?
                            "border-slate-700 text-slate-300 hover:bg-slate-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <EyeIcon size={14} />
                        View
                      </button>

                      <Link
                        href={`/dashboard/audits/${audit.id}/edit`}
                        className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold ${
                          isDark ?
                            "border-slate-700 text-slate-300 hover:bg-slate-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <EditIcon size={14} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(audit)}
                        className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold ${
                          isDark ?
                            "border-red-500/20 text-red-300 hover:bg-red-500/10"
                          : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <TrashIcon size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          }

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!loading && totalPages > 0 && (
            <div
              className={`flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between ${
                isDark ? "border-slate-700/70" : "border-slate-200"
              }`}
            >
              {/* Left */}
              <div>
                <p
                  className={`text-[11px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Page{" "}
                  <span
                    className={`font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {currentPage + 1}
                  </span>{" "}
                  of{" "}
                  <span
                    className={`font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {totalPages}
                  </span>
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-1">
                {/* Previous */}
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => goToPage(currentPage - 1)}
                  className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark ?
                      "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ChevronLeftIcon />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className={`flex h-8 w-8 items-center justify-center text-xs ${
                            isDark ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = page === currentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-semibold transition ${
                          isActive ? "bg-blue-600 text-white"
                          : isDark ?
                            "text-slate-400 hover:bg-slate-800 hover:text-white"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Next */}
                <button
                  type="button"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => goToPage(currentPage + 1)}
                  className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark ?
                      "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {selectedAudit && (
        <AuditViewModal
          audit={selectedAudit}
          isDark={isDark}
          onClose={() => setSelectedAudit(null)}
          onEdit={(audit) => {
            setSelectedAudit(null);

            window.location.href = `/dashboard/audits/${audit.id}/edit`;
          }}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteTarget && (
        <DeleteAuditModal
          audit={deleteTarget}
          deleting={deletingId === deleteTarget.id}
          isDark={isDark}
          onCancel={() => {
            if (!deletingId) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
