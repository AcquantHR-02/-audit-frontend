"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useTheme } from "@/app/context/ThemeContext";

import { getAllAudits, type Audit } from "@/app/lib/api/auditApi";

import { getAllFindings, type Finding } from "@/app/lib/api/findingApi";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [audits, setAudits] = useState<Audit[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // VIEW MODAL STATE
  // ======================================================

  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);

  // ======================================================
  // OPEN VIEW MODAL
  // ======================================================

  const handleViewAudit = (audit: Audit) => {
    setSelectedAudit(audit);
    setViewModalOpen(true);
  };

  // ======================================================
  // CLOSE VIEW MODAL
  // ======================================================

  const handleCloseViewModal = () => {
    setViewModalOpen(false);

    // Small delay keeps close animation smooth
    setTimeout(() => {
      setSelectedAudit(null);
    }, 200);
  };

  // ======================================================
  // FETCH DASHBOARD DATA
  // ======================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [auditData, findingData] = await Promise.all([
          getAllAudits(0, 1000),
          getAllFindings(0, 1000),
        ]);

        setAudits(auditData?.content ?? []);
        setFindings(findingData?.content ?? []);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);

        if (err?.response?.status === 401) {
          setError("Your session has expired. Please login again.");
        } else if (err?.response?.status === 403) {
          setError("You do not have permission to view dashboard data.");
        } else if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(
            "Unable to load dashboard data. Please check whether the backend is running.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ======================================================
  // AUDIT SUMMARY
  // ======================================================

  const totalAudits = audits.length;

  const pendingAudits = audits.filter(
    (audit) => audit.status?.toLowerCase() === "pending",
  ).length;

  const completedAudits = audits.filter(
    (audit) => audit.status?.toLowerCase() === "completed",
  ).length;

  const inProgressAudits = audits.filter(
    (audit) => audit.status?.toLowerCase() === "in progress",
  ).length;

  // ======================================================
  // FINDING SUMMARY
  // ======================================================

  const totalFindings = findings.length;

  const openFindings = findings.filter(
    (finding) => finding.status?.toLowerCase() === "open",
  ).length;

  const inProgressFindings = findings.filter(
    (finding) => finding.status?.toLowerCase() === "in progress",
  ).length;

  const resolvedFindings = findings.filter(
    (finding) => finding.status?.toLowerCase() === "resolved",
  ).length;

  const criticalFindings = findings.filter(
    (finding) => finding.severity?.toLowerCase() === "critical",
  ).length;

  const highFindings = findings.filter(
    (finding) => finding.severity?.toLowerCase() === "high",
  ).length;

  const mediumFindings = findings.filter(
    (finding) => finding.severity?.toLowerCase() === "medium",
  ).length;

  const lowFindings = findings.filter(
    (finding) => finding.severity?.toLowerCase() === "low",
  ).length;

  // ======================================================
  // PROGRESS
  // ======================================================

  const progressPercentage =
    totalAudits > 0 ? Math.round((completedAudits / totalAudits) * 100) : 0;

  // ======================================================
  // RECENT AUDITS
  // ======================================================

  const recentAudits = useMemo(() => {
    return [...audits]
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      .slice(0, 5);
  }, [audits]);

  // ======================================================
  // AUDIT ACTIVITY
  // ======================================================

  const auditActivity = useMemo(() => {
    const validDates = audits
      .map((audit) => new Date(audit.startDate))
      .filter((date) => !Number.isNaN(date.getTime()));

    if (validDates.length === 0) {
      return [
        { label: "Jan", value: 0 },
        { label: "Feb", value: 0 },
        { label: "Mar", value: 0 },
        { label: "Apr", value: 0 },
        { label: "May", value: 0 },
        { label: "Jun", value: 0 },
      ];
    }

    const latestDate = new Date(
      Math.max(...validDates.map((date) => date.getTime())),
    );

    const months: {
      label: string;
      year: number;
      month: number;
    }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        latestDate.getFullYear(),
        latestDate.getMonth() - i,
        1,
      );

      months.push({
        label: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }

    return months.map((monthInfo) => {
      const count = validDates.filter(
        (date) =>
          date.getFullYear() === monthInfo.year &&
          date.getMonth() === monthInfo.month,
      ).length;

      return {
        label: monthInfo.label,
        value: count,
      };
    });
  }, [audits]);

  const chartMax = Math.max(...auditActivity.map((item) => item.value), 1);

  // ======================================================
  // STATUS CHART
  // ======================================================

  const statusChart = [
    {
      label: "Completed",
      value: completedAudits,
      percentage:
        totalAudits > 0 ? Math.round((completedAudits / totalAudits) * 100) : 0,
      bar: "bg-emerald-500",
    },
    {
      label: "In Progress",
      value: inProgressAudits,
      percentage:
        totalAudits > 0 ?
          Math.round((inProgressAudits / totalAudits) * 100)
        : 0,
      bar: "bg-blue-500",
    },
    {
      label: "Pending",
      value: pendingAudits,
      percentage:
        totalAudits > 0 ? Math.round((pendingAudits / totalAudits) * 100) : 0,
      bar: "bg-amber-500",
    },
  ];

  // ======================================================
  // FINDING SEVERITY
  // ======================================================

  const severityData = [
    {
      label: "Critical",
      value: criticalFindings,
      bg: "bg-red-500",
    },
    {
      label: "High",
      value: highFindings,
      bg: "bg-orange-500",
    },
    {
      label: "Medium",
      value: mediumFindings,
      bg: "bg-amber-500",
    },
    {
      label: "Low",
      value: lowFindings,
      bg: "bg-slate-400",
    },
  ];

  const severityMax = Math.max(...severityData.map((item) => item.value), 1);

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status: string) => {
    const normalized = status?.toLowerCase();

    if (normalized === "completed") {
      return isDark ?
          "bg-emerald-950 text-emerald-400"
        : "bg-emerald-50 text-emerald-700";
    }

    if (normalized === "in progress") {
      return isDark ? "bg-blue-950 text-blue-400" : "bg-blue-50 text-blue-700";
    }

    if (normalized === "pending") {
      return isDark ?
          "bg-amber-950 text-amber-400"
        : "bg-amber-50 text-amber-700";
    }

    return isDark ?
        "bg-slate-700 text-slate-300"
      : "bg-slate-100 text-slate-700";
  };

  // ======================================================
  // STATUS DOT
  // ======================================================

  const getStatusDot = (status: string) => {
    const normalized = status?.toLowerCase();

    if (normalized === "completed") {
      return "bg-emerald-500";
    }

    if (normalized === "in progress") {
      return "bg-blue-500";
    }

    if (normalized === "pending") {
      return "bg-amber-500";
    }

    return "bg-slate-400";
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date: string) => {
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
  };

  // ======================================================
  // GET AUDITOR NAME
  // ======================================================

  const getAuditorName = (audit: Audit) => {
    if (!audit.auditor) {
      return "Not Assigned";
    }

    return audit.auditor.name || "Unknown Auditor";
  };

  // ======================================================
  // GET INITIALS
  // ======================================================

  const getInitials = (name: string) => {
    if (!name || name === "Not Assigned") {
      return "NA";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div
              className={`mx-auto h-9 w-9 animate-spin rounded-full border-4 ${
                isDark ?
                  "border-slate-700 border-t-blue-500"
                : "border-slate-200 border-t-blue-600"
              }`}
            />

            <p
              className={`mt-3 text-sm font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Loading dashboard...
            </p>
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
        className={`min-h-screen p-4 ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <div
          className={`mx-auto mt-10 max-w-xl rounded-xl border p-6 text-center ${
            isDark ? "border-red-900 bg-slate-800" : "border-red-200 bg-white"
          }`}
        >
          <div
            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${
              isDark ? "bg-red-950 text-red-400" : "bg-red-50 text-red-600"
            }`}
          >
            !
          </div>

          <h1
            className={`mt-3 text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Unable to Load Dashboard
          </h1>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN DASHBOARD
  // ======================================================

  return (
    <>
      <div
        className={`min-h-screen overflow-x-hidden p-3 transition-colors duration-300 md:p-4 ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDark ? "bg-emerald-400" : "bg-emerald-500"
                }`}
              />

              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Overview
              </span>
            </div>

            <h1
              className={`text-xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Audit Dashboard
            </h1>

            <p
              className={`mt-0.5 text-[11px] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Monitor audits, findings and compliance activity from one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/finding"
              className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition ${
                isDark ?
                  "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              View Findings
            </Link>

            <Link
              href="/dashboard/audits/create"
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-sm leading-none">+</span>
              Create Audit
            </Link>
          </div>
        </div>

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {/* TOTAL */}

          <Link
            href="/dashboard/audits"
            className={`group rounded-xl border p-2.5 transition duration-200 hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-slate-600"
              : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[9px] font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Total Audits
                </p>

                <h2
                  className={`mt-0.5 text-xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {totalAudits}
                </h2>
              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDark ?
                    "bg-blue-950 text-blue-400"
                  : "bg-blue-50 text-blue-600"
                }`}
              >
                📋
              </div>
            </div>

            <p
              className={`mt-1.5 text-[8px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              All audits in system
            </p>
          </Link>

          {/* IN PROGRESS */}

          <Link
            href="/dashboard/audits"
            className={`group rounded-xl border p-2.5 transition duration-200 hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-slate-600"
              : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[9px] font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  In Progress
                </p>

                <h2 className="mt-0.5 text-xl font-bold text-blue-600">
                  {inProgressAudits}
                </h2>
              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDark ?
                    "bg-blue-950 text-blue-400"
                  : "bg-blue-50 text-blue-600"
                }`}
              >
                ⏳
              </div>
            </div>

            <p className="mt-1.5 text-[8px] text-blue-600">
              Currently active audits
            </p>
          </Link>

          {/* COMPLETED */}

          <Link
            href="/dashboard/audits"
            className={`group rounded-xl border p-2.5 transition duration-200 hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-slate-600"
              : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[9px] font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Completed
                </p>

                <h2 className="mt-0.5 text-xl font-bold text-emerald-600">
                  {completedAudits}
                </h2>
              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDark ?
                    "bg-emerald-950 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
                }`}
              >
                ✓
              </div>
            </div>

            <p className="mt-1.5 text-[8px] text-emerald-600">
              Successfully completed
            </p>
          </Link>

          {/* OPEN FINDINGS */}

          <Link
            href="/dashboard/finding"
            className={`group rounded-xl border p-2.5 transition duration-200 hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-slate-600"
              : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[9px] font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Open Findings
                </p>

                <h2 className="mt-0.5 text-xl font-bold text-red-600">
                  {openFindings}
                </h2>
              </div>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDark ? "bg-red-950 text-red-400" : "bg-red-50 text-red-600"
                }`}
              >
                !
              </div>
            </div>

            <p
              className={`mt-1.5 text-[8px] ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {totalFindings} total findings
            </p>
          </Link>
        </div>

        {/* ==================================================
            AUDIT ACTIVITY + AUDIT STATUS
        ================================================== */}

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* AUDIT ACTIVITY */}

          <div
            className={`rounded-xl border p-3 lg:col-span-2 ${
              isDark ?
                "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <h2
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Audit Activity
                </h2>

                <p
                  className={`mt-0.5 text-[9px] ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Audit creation activity over the latest six months.
                </p>
              </div>

              <span
                className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                  isDark ?
                    "bg-blue-950 text-blue-400"
                  : "bg-blue-50 text-blue-600"
                }`}
              >
                {totalAudits} Total
              </span>
            </div>

            <div className="h-[155px] w-full">
              <svg
                viewBox="0 0 700 230"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                {[0, 1, 2, 3, 4].map((line) => {
                  const y = 25 + line * 38;

                  return (
                    <line
                      key={line}
                      x1="45"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke={isDark ? "#334155" : "#e2e8f0"}
                      strokeWidth="1"
                    />
                  );
                })}

                {[0, 1, 2, 3, 4].map((line) => {
                  const value = Math.round(chartMax - (chartMax / 4) * line);

                  const y = 29 + line * 38;

                  return (
                    <text
                      key={line}
                      x="4"
                      y={y}
                      fontSize="9"
                      fill={isDark ? "#94a3b8" : "#64748b"}
                    >
                      {value}
                    </text>
                  );
                })}

                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={auditActivity
                    .map((item, index) => {
                      const x =
                        55 +
                        index * (620 / Math.max(auditActivity.length - 1, 1));

                      const y = 185 - (item.value / chartMax) * 140;

                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                <polygon
                  fill="rgba(37, 99, 235, 0.08)"
                  points={[
                    ...auditActivity.map((item, index) => {
                      const x =
                        55 +
                        index * (620 / Math.max(auditActivity.length - 1, 1));

                      const y = 185 - (item.value / chartMax) * 140;

                      return `${x},${y}`;
                    }),
                    "675,185",
                    "55,185",
                  ].join(" ")}
                />

                {auditActivity.map((item, index) => {
                  const x =
                    55 + index * (620 / Math.max(auditActivity.length - 1, 1));

                  const y = 185 - (item.value / chartMax) * 140;

                  return (
                    <g key={`${item.label}-${index}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4.5"
                        fill={isDark ? "#1e293b" : "#ffffff"}
                        stroke="#2563eb"
                        strokeWidth="2.5"
                      />

                      <text
                        x={x}
                        y="210"
                        textAnchor="middle"
                        fontSize="9"
                        fill={isDark ? "#94a3b8" : "#64748b"}
                      >
                        {item.label}
                      </text>

                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        fill={isDark ? "#cbd5e1" : "#475569"}
                      >
                        {item.value}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* AUDIT STATUS */}

          <div
            className={`rounded-xl border p-3 ${
              isDark ?
                "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <h2
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Audit Status
                </h2>

                <p
                  className={`mt-0.5 text-[9px] ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Current audit distribution.
                </p>
              </div>

              <div
                className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                  isDark ?
                    "bg-slate-700 text-slate-300"
                  : "bg-slate-100 text-slate-600"
                }`}
              >
                {totalAudits}
              </div>
            </div>

            <div className="space-y-2.5">
              {statusChart.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${item.bar}`}
                      />

                      <span
                        className={`text-[10px] font-medium ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-semibold ${
                          isDark ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {item.value}
                      </span>

                      <span
                        className={`text-[9px] ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div
                    className={`h-1.5 overflow-hidden rounded-full ${
                      isDark ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`mt-3 flex items-center justify-between border-t pt-2.5 ${
                isDark ? "border-slate-700" : "border-slate-100"
              }`}
            >
              <span
                className={`text-[9px] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Completion Rate
              </span>

              <span
                className={`text-[10px] font-semibold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {progressPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            FINDINGS + AUDIT PROGRESS
        ================================================== */}

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
          {/* FINDING SEVERITY */}

          <div
            className={`rounded-xl border p-3.5 lg:col-span-3 ${
              isDark ?
                "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h2
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Finding Severity
                </h2>

                <p
                  className={`mt-0.5 text-[10px] ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Findings grouped by severity level.
                </p>
              </div>

              <Link
                href="/dashboard/finding"
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
              >
                View Findings →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {severityData.map((item) => {
                const percentage =
                  totalFindings > 0 ?
                    Math.round((item.value / totalFindings) * 100)
                  : 0;

                return (
                  <div
                    key={item.label}
                    className={`rounded-lg p-2.5 ${
                      isDark ? "bg-slate-900" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`h-2 w-2 rounded-full ${item.bg}`} />

                      <span
                        className={`text-[9px] ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>

                    <p
                      className={`mt-2 text-[10px] font-medium ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p
                      className={`mt-0.5 text-xl font-bold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </p>

                    <div
                      className={`mt-2 h-1 overflow-hidden rounded-full ${
                        isDark ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${item.bg}`}
                        style={{
                          width: `${(item.value / severityMax) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={`mt-3 grid grid-cols-3 gap-2 border-t pt-3 ${
                isDark ? "border-slate-700" : "border-slate-100"
              }`}
            >
              <div>
                <p
                  className={`text-[9px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Open
                </p>

                <p className="mt-0.5 text-base font-bold text-red-600">
                  {openFindings}
                </p>
              </div>

              <div>
                <p
                  className={`text-[9px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  In Progress
                </p>

                <p className="mt-0.5 text-base font-bold text-blue-600">
                  {inProgressFindings}
                </p>
              </div>

              <div>
                <p
                  className={`text-[9px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Resolved
                </p>

                <p className="mt-0.5 text-base font-bold text-emerald-600">
                  {resolvedFindings}
                </p>
              </div>
            </div>
          </div>

          {/* AUDIT PROGRESS */}

          <div
            className={`rounded-xl border p-3.5 lg:col-span-2 ${
              isDark ?
                "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-2">
              <h2
                className={`text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Audit Progress
              </h2>

              <p
                className={`mt-0.5 text-[10px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Overall audit completion.
              </p>
            </div>

            <div className="flex items-center justify-center gap-5">
              <div className="relative h-32 w-32 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke={isDark ? "#334155" : "#e2e8f0"}
                    strokeWidth="10"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercentage * 3.01} 301`}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {progressPercentage}%
                  </p>

                  <p
                    className={`text-[9px] ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Completed
                  </p>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Completed
                  </span>

                  <span className="text-[10px] font-semibold text-emerald-600">
                    {completedAudits}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    In Progress
                  </span>

                  <span className="text-[10px] font-semibold text-blue-600">
                    {inProgressAudits}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Pending
                  </span>

                  <span className="text-[10px] font-semibold text-amber-600">
                    {pendingAudits}
                  </span>
                </div>

                <div
                  className={`border-t pt-2 ${
                    isDark ? "border-slate-700" : "border-slate-100"
                  }`}
                >
                  <p
                    className={`text-[9px] ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Completion Rate
                  </p>

                  <p
                    className={`mt-0.5 text-[10px] font-medium ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {completedAudits} of {totalAudits} audits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Link
            href="/dashboard/audits/create"
            className={`group rounded-xl border p-3 transition hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-blue-700"
              : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                  isDark ?
                    "bg-blue-950 text-blue-400"
                  : "bg-blue-50 text-blue-600"
                }`}
              >
                +
              </div>

              <div>
                <p
                  className={`text-[11px] font-semibold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Create Audit
                </p>

                <p
                  className={`mt-0.5 text-[9px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Start a new audit
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/finding/create"
            className={`group rounded-xl border p-3 transition hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-red-700"
              : "border-slate-200 bg-white hover:border-red-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                  isDark ? "bg-red-950 text-red-400" : "bg-red-50 text-red-600"
                }`}
              >
                !
              </div>

              <div>
                <p
                  className={`text-[11px] font-semibold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Add Finding
                </p>

                <p
                  className={`mt-0.5 text-[9px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Record a new finding
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className={`group rounded-xl border p-3 transition hover:-translate-y-0.5 ${
              isDark ?
                "border-slate-700 bg-slate-800 hover:border-emerald-700"
              : "border-slate-200 bg-white hover:border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                  isDark ?
                    "bg-emerald-950 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
                }`}
              >
                ↗
              </div>

              <div>
                <p
                  className={`text-[11px] font-semibold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Reports
                </p>

                <p
                  className={`mt-0.5 text-[9px] ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Review audit reports
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* ==================================================
            RECENT AUDITS
        ================================================== */}

        <div
          className={`overflow-hidden rounded-xl border ${
            isDark ?
              "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`flex items-center justify-between border-b px-3.5 py-2.5 ${
              isDark ? "border-slate-700" : "border-slate-100"
            }`}
          >
            <div>
              <h2
                className={`text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Recent Audits
              </h2>

              <p
                className={`mt-0.5 text-[10px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Latest audit activities from the system.
              </p>
            </div>

            <Link
              href="/dashboard/audits"
              className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className={isDark ? "bg-slate-900" : "bg-slate-50"}>
                <tr>
                  <th
                    className={`px-3.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Audit ID
                  </th>

                  <th
                    className={`px-3.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Audit
                  </th>

                  <th
                    className={`px-3.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Auditor
                  </th>

                  <th
                    className={`px-3.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Status
                  </th>

                  <th
                    className={`px-3.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    End Date
                  </th>

                  <th
                    className={`px-3.5 py-2 text-right text-[9px] font-semibold uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody
                className={`divide-y ${
                  isDark ? "divide-slate-700" : "divide-slate-100"
                }`}
              >
                {recentAudits.length === 0 ?
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        No audits found
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Create your first audit to see it here.
                      </p>
                    </td>
                  </tr>
                : recentAudits.map((audit) => {
                    const auditorName = getAuditorName(audit);

                    return (
                      <tr
                        key={audit.id}
                        className={`transition ${
                          isDark ? "hover:bg-slate-700/40" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* AUDIT ID */}

                        <td className="px-3.5 py-2.5">
                          <button
                            type="button"
                            onClick={() => handleViewAudit(audit)}
                            className="text-[10px] font-semibold text-blue-600 hover:underline"
                          >
                            AUD-
                            {String(audit.id).padStart(3, "0")}
                          </button>
                        </td>

                        {/* AUDIT */}

                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                                isDark ?
                                  "bg-blue-950 text-blue-400"
                                : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              A
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`truncate text-[10px] font-semibold ${
                                  isDark ? "text-slate-100" : "text-slate-800"
                                }`}
                              >
                                {audit.title}
                              </p>

                              <p
                                className={`mt-0.5 max-w-[260px] truncate text-[9px] ${
                                  isDark ? "text-slate-500" : "text-slate-400"
                                }`}
                              >
                                {audit.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* AUDITOR */}

                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${
                                isDark ?
                                  "bg-slate-700 text-slate-300"
                                : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {getInitials(auditorName)}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`truncate text-[10px] ${
                                  isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                              >
                                {auditorName}
                              </p>

                              {audit.auditor?.email && (
                                <p className="max-w-[150px] truncate text-[8px] text-slate-400">
                                  {audit.auditor.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-3.5 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${getStatusClass(
                              audit.status,
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                audit.status,
                              )}`}
                            />

                            {audit.status}
                          </span>
                        </td>

                        {/* END DATE */}

                        <td className="px-3.5 py-2.5">
                          <span
                            className={`text-[10px] ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {formatDate(audit.endDate)}
                          </span>
                        </td>

                        {/* VIEW BUTTON */}

                        <td className="px-3.5 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewAudit(audit)}
                            className={`inline-flex items-center rounded-md border px-2.5 py-1.5 text-[9px] font-semibold transition ${
                              isDark ?
                                "border-slate-600 bg-slate-800 text-slate-300 hover:border-blue-500 hover:bg-blue-950 hover:text-blue-400"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}

          <div
            className={`border-t px-3.5 py-2 ${
              isDark ? "border-slate-700" : "border-slate-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <p
                className={`text-[9px] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Showing {recentAudits.length} recent audits
              </p>

              <Link
                href="/dashboard/audits"
                className="text-[9px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage Audits →
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="py-3 text-center">
          <p
            className={`text-[9px] ${
              isDark ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Audit Management System • Dashboard
          </p>
        </div>
      </div>

      {/* ==================================================
          AUDIT VIEW MODAL
      ================================================== */}
    </>
  );
}
