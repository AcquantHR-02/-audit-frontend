"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";

/* =========================================================
   NOTIFICATION DATA
========================================================= */

const notifications = [
  {
    id: "NOT-001",
    event: "Audit Completed",
    message: "HR Compliance Audit has been completed successfully.",
    sentTo: "Rahul Sharma",
    status: "Unread",
    createdDate: "10 Sep 2026",
  },
  {
    id: "NOT-002",
    event: "Finding Created",
    message:
      "A new high severity finding has been created for Finance Process Audit.",
    sentTo: "Priya Singh",
    status: "Unread",
    createdDate: "09 Sep 2026",
  },
  {
    id: "NOT-003",
    event: "Audit Due Soon",
    message: "IT Security Audit is approaching its due date.",
    sentTo: "Amit Kumar",
    status: "Read",
    createdDate: "08 Sep 2026",
  },
  {
    id: "NOT-004",
    event: "Finding Resolved",
    message:
      "Missing Vendor Documents finding has been marked as resolved.",
    sentTo: "Neha Verma",
    status: "Read",
    createdDate: "07 Sep 2026",
  },
  {
    id: "NOT-005",
    event: "Compliance Due",
    message: "A compliance requirement is due for completion.",
    sentTo: "Rahul Sharma",
    status: "Unread",
    createdDate: "06 Sep 2026",
  },
  {
    id: "NOT-006",
    event: "Audit Assigned",
    message: "You have been assigned to Workplace Safety Audit.",
    sentTo: "Priya Singh",
    status: "Read",
    createdDate: "05 Sep 2026",
  },
];

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusClass(status: string, theme: string) {
  const isDark = theme === "dark";

  if (status === "Unread") {
    return isDark
      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
      : "border-blue-200 bg-blue-50 text-blue-700";
  }

  return isDark
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";
}

/* =========================================================
   EVENT STYLE
========================================================= */

function getEventClass(event: string, theme: string) {
  const isDark = theme === "dark";

  if (event.includes("Finding")) {
    return isDark
      ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
      : "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (event.includes("Audit")) {
    return isDark
      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
      : "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (event.includes("Compliance")) {
    return isDark
      ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
      : "border-orange-200 bg-orange-50 text-orange-700";
  }

  return isDark
    ? "border-slate-600 bg-slate-700 text-slate-300"
    : "border-slate-200 bg-slate-50 text-slate-700";
}

/* =========================================================
   PAGE
========================================================= */

export default function NotificationsPage() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  /* =======================================================
     FILTER STATES
  ======================================================= */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [event, setEvent] = useState("All");

  /* =======================================================
     UNIQUE EVENTS
  ======================================================= */

  const eventOptions = useMemo(() => {
    return [...new Set(notifications.map((item) => item.event))];
  }, []);

  /* =======================================================
     FILTER NOTIFICATIONS
  ======================================================= */

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        notification.id.toLowerCase().includes(searchText) ||
        notification.event.toLowerCase().includes(searchText) ||
        notification.message.toLowerCase().includes(searchText) ||
        notification.sentTo.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || notification.status === status;

      const matchesEvent =
        event === "All" || notification.event === event;

      return matchesSearch && matchesStatus && matchesEvent;
    });
  }, [search, status, event]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalNotifications = notifications.length;

  const unreadCount = notifications.filter(
    (notification) => notification.status === "Unread",
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.status === "Read",
  ).length;

  /* =======================================================
     FILTER STATUS
  ======================================================= */

  const filtersActive =
    search.trim() !== "" ||
    status !== "All" ||
    event !== "All";

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  function resetFilters() {
    setSearch("");
    setStatus("All");
    setEvent("All");
  }

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden px-3 py-4 transition-colors duration-300 sm:px-4 md:px-5 lg:px-6 ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5">
          {/* Breadcrumb */}

          <div
            className={`mb-2 flex items-center gap-2 text-[11px] ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <span>Dashboard</span>

            <span>/</span>

            <span
              className={`font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Notifications
            </span>
          </div>

          {/* Title */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1
                className={`text-xl font-bold tracking-tight sm:text-2xl ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Notifications
              </h1>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                View and manage system notifications.
              </p>
            </div>

            {/* Unread Indicator */}

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 ${
                isDark
                  ? "border-blue-500/30 bg-blue-500/10"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500" />

              <span
                className={`text-xs font-semibold ${
                  isDark ? "text-blue-400" : "text-blue-700"
                }`}
              >
                {unreadCount} unread notifications
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* TOTAL */}

          <div
            className={`rounded-xl border p-4 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Total Notifications
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {totalNotifications}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isDark
                    ? "bg-slate-800 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* UNREAD */}

          <div
            className={`rounded-xl border p-4 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Unread
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {unreadCount}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isDark ? "bg-blue-500/10" : "bg-blue-50"
                }`}
              >
                <span className="h-3 w-3 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>

          {/* READ */}

          <div
            className={`rounded-xl border p-4 shadow-sm transition ${
              isDark
                ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                : "border-slate-200 bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Read
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  {readCount}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isDark
                    ? "bg-emerald-500/10"
                    : "bg-emerald-50"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    isDark
                      ? "text-emerald-400"
                      : "text-emerald-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className={`w-full overflow-hidden rounded-xl border shadow-sm ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Card Header */}

          <div
            className={`border-b px-4 py-3.5 md:px-5 ${
              isDark
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Notification List
                </h2>

                <p
                  className={`mt-0.5 text-[10px] ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-500"
                  }`}
                >
                  Search and filter system notifications.
                </p>
              </div>

              <div
                className={`text-[10px] ${
                  isDark
                    ? "text-slate-500"
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
                  {filteredNotifications.length}
                </span>{" "}
                of{" "}
                <span
                  className={`font-semibold ${
                    isDark
                      ? "text-slate-200"
                      : "text-slate-800"
                  }`}
                >
                  {totalNotifications}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div
            className={`border-b p-3 md:p-4 ${
              isDark
                ? "border-slate-800 bg-slate-800/40"
                : "border-slate-200 bg-slate-50/60"
            }`}
          >
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4">
              {/* SEARCH */}

              <div className="lg:col-span-2">
                <label
                  className={`mb-1.5 block text-[10px] font-semibold ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Search
                </label>

                <div className="relative">
                  <svg
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                      isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ID, event, message or person..."
                    className={`h-9 w-full rounded-lg border pl-9 pr-3 text-xs outline-none transition-all ${
                      isDark
                        ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                        : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* STATUS */}

              <div>
                <label
                  className={`mb-1.5 block text-[10px] font-semibold ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`h-9 w-full rounded-lg border px-3 text-xs outline-none transition-all ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500"
                      : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                  }`}
                >
                  <option value="All">All Status</option>
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                </select>
              </div>

              {/* EVENT */}

              <div>
                <label
                  className={`mb-1.5 block text-[10px] font-semibold ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Event
                </label>

                <select
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className={`h-9 w-full rounded-lg border px-3 text-xs outline-none transition-all ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-500"
                      : "border-slate-200 bg-white text-slate-600 focus:border-blue-500"
                  }`}
                >
                  <option value="All">All Events</option>

                  {eventOptions.map((eventName) => (
                    <option key={eventName} value={eventName}>
                      {eventName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILTER BOTTOM */}

            <div className="mt-2 flex items-center justify-between">
              <div className="text-[10px]">
                {filtersActive ? (
                  <span
                    className={`font-semibold ${
                      isDark
                        ? "text-blue-400"
                        : "text-blue-600"
                    }`}
                  >
                    ● Filters Active
                  </span>
                ) : (
                  <span
                    className={
                      isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                    }
                  >
                    No filters applied
                  </span>
                )}
              </div>

              {filtersActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className={`rounded-md border px-3 py-1.5 text-[10px] font-semibold transition ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden w-full overflow-x-auto lg:block">
            <table className="w-full min-w-[900px] table-fixed">
              <colgroup>
                <col className="w-[11%]" />
                <col className="w-[15%]" />
                <col className="w-[31%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[17%]" />
              </colgroup>

              {/* TABLE HEADER */}

              <thead>
                <tr
                  className={`border-b text-left ${
                    isDark
                      ? "border-slate-800 bg-slate-800/70"
                      : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <th
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wide ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    ID
                  </th>

                  <th
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wide ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Event
                  </th>

                  <th
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wide ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Message
                  </th>

                  <th
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wide ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Sent To
                  </th>

                  <th
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wide ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Status
                  </th>

                  <th
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wide ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-400"
                    }`}
                  >
                    Created Date
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody
                className={`divide-y ${
                  isDark
                    ? "divide-slate-800"
                    : "divide-slate-100"
                }`}
              >
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <tr
                      key={notification.id}
                      className={`transition-colors ${
                        isDark
                          ? "hover:bg-slate-800/60"
                          : "hover:bg-blue-50/30"
                      }`}
                    >
                      {/* ID */}

                      <td className="px-3 py-3 align-top">
                        <span
                          className={`text-xs font-semibold ${
                            isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        >
                          {notification.id}
                        </span>
                      </td>

                      {/* EVENT */}

                      <td className="px-3 py-3 align-top">
                        <span
                          className={`inline-flex max-w-full rounded-md border px-2 py-1 text-[10px] font-semibold leading-4 ${getEventClass(
                            notification.event,
                            theme,
                          )}`}
                        >
                          {notification.event}
                        </span>
                      </td>

                      {/* MESSAGE */}

                      <td className="px-3 py-3 align-top">
                        <p
                          title={notification.message}
                          className={`break-words text-xs leading-5 ${
                            isDark
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                      </td>

                      {/* SENT TO */}

                      <td className="px-3 py-3 align-top">
                        <p
                          className={`break-words text-xs font-medium ${
                            isDark
                              ? "text-slate-300"
                              : "text-slate-700"
                          }`}
                        >
                          {notification.sentTo}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-3 py-3 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                            notification.status,
                            theme,
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              notification.status === "Unread"
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                            }`}
                          />

                          {notification.status}
                        </span>
                      </td>

                      {/* DATE */}

                      <td
                        className={`px-3 py-3 align-top text-xs ${
                          isDark
                            ? "text-slate-500"
                            : "text-slate-500"
                        }`}
                      >
                        {notification.createdDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <EmptyState
                        isDark={isDark}
                        resetFilters={resetFilters}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE / TABLET CARDS
          ================================================= */}

          <div
            className={`divide-y ${
              isDark
                ? "divide-slate-800"
                : "divide-slate-200"
            } lg:hidden`}
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    isDark
                      ? "hover:bg-slate-800/60"
                      : "hover:bg-blue-50/30"
                  }`}
                >
                  {/* Top */}

                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold ${
                          isDark
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        {notification.id}
                      </p>

                      <h3
                        className={`mt-1 break-words text-sm font-semibold ${
                          isDark
                            ? "text-slate-100"
                            : "text-slate-900"
                        }`}
                      >
                        {notification.event}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                        notification.status,
                        theme,
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          notification.status === "Unread"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                        }`}
                      />

                      {notification.status}
                    </span>
                  </div>

                  {/* Message */}

                  <div
                    className={`mt-3 rounded-lg p-3 ${
                      isDark
                        ? "bg-slate-800"
                        : "bg-slate-50"
                    }`}
                  >
                    <p
                      className={`break-words text-xs leading-5 ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {/* Details */}

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p
                        className={`text-[9px] font-semibold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        Sent To
                      </p>

                      <p
                        className={`mt-1 break-words text-xs font-medium ${
                          isDark
                            ? "text-slate-300"
                            : "text-slate-700"
                        }`}
                      >
                        {notification.sentTo}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-[9px] font-semibold uppercase tracking-wide ${
                          isDark
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        Created Date
                      </p>

                      <p
                        className={`mt-1 text-xs font-medium ${
                          isDark
                            ? "text-slate-300"
                            : "text-slate-700"
                        }`}
                      >
                        {notification.createdDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center">
                <EmptyState
                  isDark={isDark}
                  resetFilters={resetFilters}
                />
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className={`flex flex-col gap-1.5 border-t px-4 py-3 md:px-5 sm:flex-row sm:items-center sm:justify-between ${
              isDark
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          >
            <p
              className={`text-[10px] ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Audit Management System • Notifications
            </p>

            <p
              className={`text-[10px] ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? "s" : ""}{" "}
              displayed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  isDark,
  resetFilters,
}: {
  isDark: boolean;
  resetFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
          isDark ? "bg-slate-800" : "bg-slate-100"
        }`}
      >
        <svg
          className={`h-5 w-5 ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <p
        className={`text-sm font-semibold ${
          isDark ? "text-slate-100" : "text-slate-700"
        }`}
      >
        No notifications found
      </p>

      <p
        className={`mt-1 text-xs ${
          isDark ? "text-slate-500" : "text-slate-400"
        }`}
      >
        Try changing your search or filters.
      </p>

      <button
        type="button"
        onClick={resetFilters}
        className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-blue-700"
      >
        Clear Filters
      </button>
    </div>
  );
}