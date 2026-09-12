"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { getAuditById, type Audit } from "@/app/lib/api/auditApi";

// ========================================
// STATUS STYLE
// ========================================

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };

    case "In Progress":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };

    case "Pending":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };

    default:
      return {
        badge: "bg-slate-50 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
      };
  }
}

// ========================================
// FORMAT DATE
// ========================================

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

// ========================================
// PAGE
// ========================================

export default function AuditDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH AUDIT
  // ========================================

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
        console.error("Error fetching audit:", error);

        if (error.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (error.response?.status === 403) {
          setError("You do not have permission to view this audit.");
        } else if (error.response?.status === 404) {
          setError("Audit not found. It may have been deleted.");
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError(
            "Unable to load audit. Please check your backend connection.",
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

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-5 h-10 w-80 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-80 rounded-2xl bg-white shadow-sm" />
              <div className="h-64 rounded-2xl bg-white shadow-sm" />
            </div>

            <div className="h-80 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <span className="text-2xl font-bold text-red-600">!</span>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Unable to Load Audit
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/dashboard/audits")}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Back to Audits
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // AUDIT NOT FOUND
  // ========================================

  if (!audit) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-2xl text-slate-500">?</span>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Audit Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              No audit information was found for this ID.
            </p>

            <Link
              href="/dashboard/audits"
              className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Audits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STATUS
  // ========================================

  const statusStyle = getStatusStyle(audit.status || "");

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ========================================
            BREADCRUMB
        ======================================== */}

        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/dashboard/audits"
            className="font-medium text-slate-500 transition hover:text-slate-900"
          >
            Audits
          </Link>

          <span className="text-slate-300">/</span>

          <span className="font-medium text-slate-900">Audit Details</span>
        </div>

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold tracking-wide text-slate-600">
                  AUD-
                  {String(audit.id).padStart(3, "0")}
                </span>

                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />

                  {audit.status || "Unknown"}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {audit.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Complete information and details for this compliance audit.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/audits"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ← All Audits
              </Link>

              <Link
                href={`/dashboard/audits/${audit.id}/edit`}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Edit Audit
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================
            MAIN GRID
        ======================================== */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ========================================
              LEFT CONTENT
          ======================================== */}

          <div className="space-y-6 lg:col-span-2">
            {/* ========================================
                AUDIT OVERVIEW
            ======================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Audit Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information about the audit.
                </p>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                {/* AUDIT ID */}

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Audit ID
                  </p>

                  <p className="mt-2 text-base font-bold text-slate-900">
                    AUD-
                    {String(audit.id).padStart(3, "0")}
                  </p>
                </div>

                {/* STATUS */}

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyle.badge}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                    />

                    {audit.status || "-"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100">
                {/* TITLE */}

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Audit Title
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {audit.title || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================
                DESCRIPTION
            ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Audit Description
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Description and scope of the audit.
                </p>
              </div>

              <div className="p-6">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {audit.description || "No description has been provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================
                AUDIT TIMELINE
            ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Audit Timeline
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Scheduled audit period.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                {/* START DATE */}

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <span className="text-sm font-bold text-blue-600">S</span>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Start Date
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatDate(audit.startDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* END DATE */}

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                      <span className="text-sm font-bold text-emerald-600">
                        E
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        End Date
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatDate(audit.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              RIGHT SIDEBAR
          ======================================== */}

          <div className="space-y-6">
            {/* ========================================
                AUDITOR
            ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">Auditor</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Assigned auditor information.
                </p>
              </div>

              <div className="p-6">
                {audit.auditor ?
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                        {audit.auditor.name?.charAt(0).toUpperCase() || "A"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {audit.auditor.name}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {audit.auditor.email || "-"}
                        </p>
                      </div>
                    </div>

                    {audit.auditor.role?.name && (
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Role
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {audit.auditor.role.name}
                        </p>
                      </div>
                    )}
                  </>
                : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                      <span className="font-bold text-slate-500">?</span>
                    </div>

                    <p className="mt-4 font-semibold text-slate-700">
                      No Auditor Assigned
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      This audit currently has no assigned auditor.
                    </p>
                  </div>
                }
              </div>
            </div>

            {/* ========================================
                QUICK SUMMARY
            ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Key audit information.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {/* STATUS */}

                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-slate-500">Status</span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle.badge}`}
                  >
                    {audit.status || "-"}
                  </span>
                </div>

                {/* AUDIT ID */}

                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-slate-500">Audit ID</span>

                  <span className="text-sm font-semibold text-slate-900">
                    #{audit.id}
                  </span>
                </div>

                {/* START */}

                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-slate-500">Start Date</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {formatDate(audit.startDate)}
                  </span>
                </div>

                {/* END */}

                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-slate-500">End Date</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {formatDate(audit.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================
                ACTIONS
            ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-900">Audit Actions</p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Manage this audit from the available actions.
              </p>

              <Link
                href={`/dashboard/audits/${audit.id}/edit`}
                className="mt-5 flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Edit This Audit
              </Link>

              <Link
                href="/dashboard/audits"
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Audit List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
