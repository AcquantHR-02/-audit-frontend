
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getAllAudits,
  type Audit,
} from "@/app/lib/api/auditApi";

import {
  getAllFindings,
  type Finding,
} from "@/app/lib/api/findingApi";

export default function DashboardPage() {
  // =========================
  // STATE
  // =========================

  const [audits, setAudits] = useState<Audit[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch audits and findings together
        const [auditData, findingData] = await Promise.all([
          getAllAudits(),
          getAllFindings(),
        ]);

        setAudits(auditData || []);
        setFindings(findingData || []);
      } catch (err: any) {
        console.error(
          "Failed to fetch dashboard data:",
          err
        );

        if (err?.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (err?.response?.status === 403) {
          setError(
            "You do not have permission to view dashboard data."
          );
        } else if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(
            "Unable to load dashboard data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================
  // AUDIT SUMMARY
  // =========================

  const totalAudits = audits.length;

  const pendingAudits = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() === "pending"
  ).length;

  const completedAudits = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() === "completed"
  ).length;

  const inProgressAudits = audits.filter(
    (audit) =>
      audit.status?.toLowerCase() === "in progress"
  ).length;

  // =========================
  // FINDING SUMMARY
  // =========================

  const totalFindings = findings.length;

  const openFindings = findings.filter(
    (finding) =>
      finding.status?.toLowerCase() === "open"
  ).length;

  const inProgressFindings = findings.filter(
    (finding) =>
      finding.status?.toLowerCase() === "in progress"
  ).length;

  const resolvedFindings = findings.filter(
    (finding) =>
      finding.status?.toLowerCase() === "resolved"
  ).length;

  const criticalFindings = findings.filter(
    (finding) =>
      finding.severity?.toLowerCase() === "critical"
  ).length;

  // =========================
  // AUDIT PROGRESS
  // =========================

  const progressPercentage =
    totalAudits > 0
      ? Math.round(
          (completedAudits / totalAudits) * 100
        )
      : 0;

  // =========================
  // RECENT AUDITS
  // =========================

  const recentAudits = [...audits]
    .sort((a, b) => {
      return (
        new Date(b.startDate).getTime() -
        new Date(a.startDate).getTime()
      );
    })
    .slice(0, 5);

  // =========================
  // STATUS COLORS
  // =========================

  const getStatusClass = (status: string) => {
    if (
      status?.toLowerCase() === "completed"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      status?.toLowerCase() === "in progress"
    ) {
      return "bg-blue-50 text-blue-700";
    }

    if (
      status?.toLowerCase() === "pending"
    ) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getStatusDot = (status: string) => {
    if (
      status?.toLowerCase() === "completed"
    ) {
      return "bg-emerald-500";
    }

    if (
      status?.toLowerCase() === "in progress"
    ) {
      return "bg-blue-500";
    }

    if (
      status?.toLowerCase() === "pending"
    ) {
      return "bg-amber-500";
    }

    return "bg-slate-400";
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // AUDITOR NAME
  // =========================

  const getAuditorName = (audit: Audit) => {
    if (!audit.auditor) {
      return "Not Assigned";
    }

    return (
      audit.auditor.name ||
      "Unknown Auditor"
    );
  };

  // =========================
  // AUDITOR INITIALS
  // =========================

  const getInitials = (name: string) => {
    if (
      !name ||
      name === "Not Assigned"
    ) {
      return "NA";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================
  // LOADING UI
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading dashboard...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fetching latest audit and finding data
            </p>

          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR UI
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
            ⚠
          </div>

          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Unable to Load Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-medium text-slate-500">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Overview of your audit activities and findings.
          </p>
        </div>

        <Link
          href="/dashboard/audits/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-base">+</span>
          Create Audit
        </Link>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">

        {/* TOTAL AUDITS */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Total Audits
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {totalAudits}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                All audits
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-sm">
              📋
            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Pending Audits
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {pendingAudits}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Audits awaiting action
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-sm">
              ⏳
            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Completed
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {completedAudits}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Successfully completed
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-sm">
              ✓
            </div>

          </div>

        </div>

        {/* OPEN FINDINGS */}

        <Link
          href="/dashboard/finding"
          className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Open Findings
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {openFindings}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {totalFindings} total findings
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-sm">
              ⚠
            </div>

          </div>

        </Link>

      </div>

      {/* =========================
          FINDING OVERVIEW
      ========================= */}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* TOTAL FINDINGS */}

        <Link
          href="/dashboard/finding"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Total Findings
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                All recorded findings
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-sm">
              🔎
            </div>

          </div>

          <div className="mt-4 flex items-end gap-2">

            <span className="text-2xl font-bold text-slate-900">
              {totalFindings}
            </span>

            <span className="mb-1 text-[10px] text-slate-400">
              findings
            </span>

          </div>

        </Link>

        {/* IN PROGRESS FINDINGS */}

        <Link
          href="/dashboard/finding"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Findings In Progress
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Currently being addressed
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-sm">
              ◐
            </div>

          </div>

          <div className="mt-4 flex items-end gap-2">

            <span className="text-2xl font-bold text-blue-600">
              {inProgressFindings}
            </span>

            <span className="mb-1 text-[10px] text-slate-400">
              findings
            </span>

          </div>

        </Link>

        {/* CRITICAL FINDINGS */}

        <Link
          href="/dashboard/finding"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Critical Findings
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Findings requiring attention
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-sm">
              ⚠
            </div>

          </div>

          <div className="mt-4 flex items-end gap-2">

            <span className="text-2xl font-bold text-red-600">
              {criticalFindings}
            </span>

            <span className="mb-1 text-[10px] text-slate-400">
              critical
            </span>

          </div>

        </Link>

      </div>

      {/* =========================
          AUDIT QUICK OVERVIEW
      ========================= */}

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* AUDIT PROGRESS */}

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Audit Progress
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Overall completion
              </p>
            </div>

            <span className="text-lg font-bold text-blue-600">
              {progressPercentage}%
            </span>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>

          </div>

          <div className="mt-3 flex justify-between text-[10px] text-slate-500">

            <span>
              {completedAudits} Completed
            </span>

            <span>
              {totalAudits} Total
            </span>

          </div>

        </div>

        {/* PENDING */}

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Pending Audits
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Audits awaiting action
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-sm">
              ⏳
            </div>

          </div>

          <div className="mt-4 flex items-end gap-2">

            <span className="text-2xl font-bold text-slate-900">
              {pendingAudits}
            </span>

            <span className="mb-1 text-[10px] text-slate-400">
              audits
            </span>

          </div>

          <div className="mt-2 text-[10px] font-medium text-amber-600">
            Requires attention
          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                In Progress
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Currently active audits
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-sm">
              ◐
            </div>

          </div>

          <div className="mt-4 flex items-end gap-2">

            <span className="text-2xl font-bold text-blue-600">
              {inProgressAudits}
            </span>

            <span className="mb-1 text-[10px] text-slate-400">
              audits
            </span>

          </div>

          <div className="mt-2 text-[10px] font-medium text-blue-600">
            Currently active
          </div>

        </div>

      </div>

      {/* =========================
          RECENT AUDITS
      ========================= */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Audits
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Latest audits from the system.
            </p>
          </div>

          <Link
            href="/dashboard/audits"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>

        </div>

        {/* TABLE */}

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Audit ID
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Audit
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

            <tbody className="divide-y divide-slate-100">

              {recentAudits.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center"
                  >
                    <p className="text-sm font-medium text-slate-600">
                      No audits found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Create your first audit to see it here.
                    </p>
                  </td>
                </tr>

              ) : (

                recentAudits.map((audit) => {

                  const auditorName =
                    getAuditorName(audit);

                  return (
                    <tr
                      key={audit.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* AUDIT ID */}

                      <td className="px-4 py-3">

                        <Link
                          href={`/dashboard/audits/${audit.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          AUD-
                          {String(audit.id).padStart(
                            3,
                            "0"
                          )}
                        </Link>

                      </td>

                      {/* AUDIT */}

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-2.5">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600">
                            A
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-xs font-semibold text-slate-800">
                              {audit.title}
                            </p>

                            <p className="mt-0.5 max-w-[280px] truncate text-[10px] text-slate-400">
                              {audit.description ||
                                "No description"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* AUDITOR */}

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-600">
                            {getInitials(
                              auditorName
                            )}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-xs text-slate-700">
                              {auditorName}
                            </p>

                            {audit.auditor?.email && (
                              <p className="max-w-[160px] truncate text-[9px] text-slate-400">
                                {audit.auditor.email}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                            audit.status
                          )}`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              audit.status
                            )}`}
                          ></span>

                          {audit.status}

                        </span>

                      </td>

                      {/* END DATE */}

                      <td className="px-4 py-3">

                        <span className="text-xs text-slate-600">
                          {formatDate(
                            audit.endDate
                          )}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-4 py-3 text-right">

                        <Link
                          href={`/dashboard/audits/${audit.id}`}
                          className="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          View →
                        </Link>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="border-t border-slate-100 px-4 py-2.5">

          <div className="flex items-center justify-between">

            <p className="text-[10px] text-slate-400">
              Showing {recentAudits.length} recent audits
            </p>

            <Link
              href="/dashboard/audits"
              className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage Audits →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

