"use client";

import { useMemo, useState } from "react";

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

function getStatusClass(status: string) {
  if (status === "Unread") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  return "bg-green-50 text-green-700 border-green-200";
}

function getEventClass(event: string) {
  if (event.includes("Finding")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  if (event.includes("Audit")) {
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  }

  if (event.includes("Compliance")) {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function NotificationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [event, setEvent] = useState("All");

  // Unique events
  const eventOptions = [...new Set(notifications.map((item) => item.event))];

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
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

  const totalNotifications = notifications.length;

  const unreadCount = notifications.filter(
    (notification) => notification.status === "Unread"
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.status === "Read"
  ).length;

  const filtersActive =
    search !== "" || status !== "All" || event !== "All";

  function resetFilters() {
    setSearch("");
    setStatus("All");
    setEvent("All");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 p-4 md:p-5">
      {/* ================= HEADER ================= */}
      <div className="mb-5">
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span className="font-medium text-slate-700">
            Notifications
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage system notifications.
            </p>
          </div>

          {/* Unread indicator */}
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />

            <span className="text-xs font-semibold text-blue-700">
              {unreadCount} unread notifications
            </span>
          </div>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Notifications
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalNotifications}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
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

        {/* Unread */}
        <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Unread
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <span className="h-3 w-3 rounded-full bg-blue-600" />
            </div>
          </div>
        </div>

        {/* Read */}
        <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Read
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {readCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <svg
                className="h-5 w-5 text-green-600"
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

      {/* ================= MAIN CARD ================= */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-slate-200 px-4 py-4 md:px-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Notification List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Search and filter system notifications.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredNotifications.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {totalNotifications}
              </span>
            </div>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Search
              </label>

              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
              </select>
            </div>

            {/* Event */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Event
              </label>

              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

          {/* Filter bottom */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-500">
              {filtersActive
                ? "Filters are currently active."
                : "No filters applied."}
            </div>

            {filtersActive && (
              <button
                onClick={resetFilters}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden lg:block">
          <table className="w-full table-fixed">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left">
                <th className="w-[11%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  ID
                </th>

                <th className="w-[14%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Event
                </th>

                <th className="w-[31%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Message
                </th>

                <th className="w-[14%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Sent To
                </th>

                <th className="w-[12%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="w-[18%] px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Created Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* ID */}
                    <td className="px-3 py-3 align-top">
                      <span className="text-xs font-bold text-blue-600">
                        {notification.id}
                      </span>
                    </td>

                    {/* EVENT */}
                    <td className="px-3 py-3 align-top">
                      <span
                        className={`inline-flex max-w-full rounded-md border px-2 py-1 text-[10px] font-semibold leading-4 ${getEventClass(
                          notification.event
                        )}`}
                      >
                        {notification.event}
                      </span>
                    </td>

                    {/* MESSAGE */}
                    <td className="px-3 py-3 align-top">
                      <p
                        title={notification.message}
                        className="break-words text-xs leading-5 text-slate-600"
                      >
                        {notification.message}
                      </p>
                    </td>

                    {/* SENT TO */}
                    <td className="px-3 py-3 align-top">
                      <p className="break-words text-xs font-medium text-slate-700">
                        {notification.sentTo}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                          notification.status
                        )}`}
                      >
                        {notification.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-3 py-3 align-top text-xs text-slate-500">
                      {notification.createdDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg
                          className="h-5 w-5 text-slate-400"
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

                      <p className="text-sm font-semibold text-slate-700">
                        No notifications found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE / TABLET CARDS ================= */}
        <div className="divide-y divide-slate-200 lg:hidden">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 transition hover:bg-slate-50"
              >
                {/* Top */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-blue-600">
                      {notification.id}
                    </p>

                    <h3 className="mt-1 break-words text-sm font-semibold text-slate-900">
                      {notification.event}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                      notification.status
                    )}`}
                  >
                    {notification.status}
                  </span>
                </div>

                {/* Message */}
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p className="break-words text-xs leading-5 text-slate-600">
                    {notification.message}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Sent To
                    </p>

                    <p className="mt-1 break-words text-xs font-medium text-slate-700">
                      {notification.sentTo}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Created Date
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {notification.createdDate}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-5 w-5 text-slate-400"
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

              <p className="text-sm font-semibold text-slate-700">
                No notifications found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 md:px-5">
          <div className="flex flex-col gap-1 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Audit Management System • Notifications</span>

            <span>
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? "s" : ""} displayed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}