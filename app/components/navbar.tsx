"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // LOAD USER DATA
  // =========================
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");

    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // =========================
  // INITIALS
  // =========================
  function getInitials(userName: string) {
    if (!userName) return "U";

    const words = userName.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  // =========================
  // LOGOUT
  // =========================
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    window.location.replace("/login");
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 h-[64px] border-b backdrop-blur-2xl transition-all duration-300 ${
        theme === "dark"
          ? "border-slate-800/80 bg-[#111a2b]/90"
          : "border-slate-200/80 bg-[#f8fbff]/90"
      }`}
    >
      {/* =========================================
          TOP ACCENT LINE
      ========================================= */}
      <div
        className={`absolute left-0 right-0 top-0 h-[2px] ${
          theme === "dark"
            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"
            : "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"
        }`}
      />

      <div className="flex h-full items-center justify-between px-3 sm:px-5 lg:px-6">
        {/* =========================================
            LEFT — BRAND
        ========================================= */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5"
          >
            {/* Creative Logo */}
            <div
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] shadow-lg transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 shadow-blue-950/40"
                  : "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-blue-200"
              }`}
            >
              {/* Decorative circles */}
              <span className="absolute -right-3 -top-3 h-7 w-7 rounded-full bg-white/20 blur-sm" />

              <span className="absolute -bottom-4 -left-2 h-7 w-7 rounded-full bg-cyan-300/20 blur-md" />

              {/* A */}
              <span className="relative z-10 text-[17px] font-black tracking-tight text-white">
                A
              </span>

              {/* Check mark */}
              <span className="absolute bottom-[6px] right-[6px] flex h-[9px] w-[9px] items-center justify-center rounded-full bg-white">
                <svg
                  className="h-[6px] w-[6px] text-indigo-600"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2.5 6.2L5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            {/* Brand Text */}
            <div className="hidden min-w-0 sm:block">
              <div
                className={`text-[13px] font-bold tracking-tight ${
                  theme === "dark"
                    ? "text-slate-100"
                    : "text-slate-800"
                }`}
              >
                Audit Management
              </div>

              <div className="mt-[2px] flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    theme === "dark"
                      ? "bg-cyan-400"
                      : "bg-blue-500"
                  }`}
                />

                <span
                  className={`text-[9px] font-medium uppercase tracking-[0.13em] ${
                    theme === "dark"
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Control Center
                </span>
              </div>
            </div>
          </Link>

          {/* =========================================
              PAGE CONTEXT
          ========================================= */}
          <div
            className={`ml-2 hidden items-center gap-2 border-l pl-4 lg:flex ${
              theme === "dark"
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          >
            <span
              className={`text-[10px] font-medium ${
                theme === "dark"
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              WORKSPACE
            </span>

            <span
              className={`h-1 w-1 rounded-full ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-slate-300"
              }`}
            />

            <span
              className={`text-[11px] font-semibold ${
                theme === "dark"
                  ? "text-slate-300"
                  : "text-slate-600"
              }`}
            >
              Audit Operations
            </span>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE
        ========================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* =========================================
              SYSTEM STATUS
          ========================================= */}
          <div
            className={`hidden items-center gap-2 rounded-xl border px-2.5 py-1.5 md:flex ${
              theme === "dark"
                ? "border-emerald-900/40 bg-emerald-500/[0.06]"
                : "border-emerald-200 bg-emerald-50/70"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                  theme === "dark"
                    ? "bg-emerald-400"
                    : "bg-emerald-500"
                }`}
              />

              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  theme === "dark"
                    ? "bg-emerald-400"
                    : "bg-emerald-500"
                }`}
              />
            </span>

            <span
              className={`text-[9px] font-bold uppercase tracking-[0.08em] ${
                theme === "dark"
                  ? "text-emerald-400"
                  : "text-emerald-700"
              }`}
            >
              Operational
            </span>
          </div>

          {/* =========================================
              THEME SWITCH
          ========================================= */}
          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
              theme === "dark"
                ? "border-slate-700/80 bg-slate-800/60 text-slate-300 hover:border-indigo-600/60 hover:bg-slate-800 hover:text-indigo-400"
                : "border-slate-200 bg-white/80 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {theme === "dark" ? (
              <svg
                className="h-[16px] w-[16px] transition-transform duration-500 group-hover:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  strokeWidth="1.8"
                />

                <path
                  d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="h-[16px] w-[16px] transition-transform duration-300 group-hover:-rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20.5 14.5A8.5 8.5 0 119.5 3.5a7 7 0 0011 11z"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* =========================================
              NOTIFICATIONS
          ========================================= */}
          <Link
            href="/dashboard/notification"
            title="Notifications"
            aria-label="Notifications"
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
              theme === "dark"
                ? "border-slate-700/80 bg-slate-800/60 text-slate-400 hover:border-indigo-700/60 hover:bg-slate-800 hover:text-indigo-400"
                : "border-slate-200 bg-white/80 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <svg
              className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M10 21h4"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            {/* Notification badge */}
            <span className="absolute right-[5px] top-[4px] flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-50" />

              <span
                className={`relative h-2 w-2 rounded-full bg-rose-500 ring-2 ${
                  theme === "dark"
                    ? "ring-[#111a2b]"
                    : "ring-[#f8fbff]"
                }`}
              />
            </span>
          </Link>

          {/* Divider */}
          <div
            className={`mx-1 hidden h-7 w-px sm:block ${
              theme === "dark"
                ? "bg-slate-800"
                : "bg-slate-200"
            }`}
          />

          {/* =========================================
              USER PROFILE
          ========================================= */}
          <div
            className={`group flex items-center gap-2 rounded-xl border py-1 pl-1 pr-1.5 transition-all duration-200 sm:pr-2 ${
              theme === "dark"
                ? "border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/60"
                : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
            }`}
          >
            {/* Avatar */}
            <div
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] text-[10px] font-black text-white ${
                theme === "dark"
                  ? "bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500"
                  : "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600"
              }`}
            >
              {/* Avatar shine */}
              <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/20 blur-sm" />

              <span className="relative z-10">
                {getInitials(name)}
              </span>
            </div>

            {/* User information */}
            <div className="hidden min-w-0 sm:block">
              <div
                className={`max-w-[120px] truncate text-[11px] font-bold ${
                  theme === "dark"
                    ? "text-slate-200"
                    : "text-slate-800"
                }`}
                title={name}
              >
                {name || "User"}
              </div>

              <div className="mt-[2px] flex items-center gap-1.5">
                <span
                  className={`max-w-[75px] truncate text-[8px] font-bold uppercase tracking-[0.08em] ${
                    theme === "dark"
                      ? "text-indigo-400"
                      : "text-indigo-600"
                  }`}
                >
                  {role || "USER"}
                </span>

                <span
                  className={`hidden lg:inline-block max-w-[110px] truncate text-[8px] ${
                    theme === "dark"
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                  title={email}
                >
                  {email}
                </span>
              </div>
            </div>

            {/* Chevron */}
            <svg
              className={`hidden h-3 w-3 transition-transform duration-200 group-hover:translate-y-0.5 sm:block ${
                theme === "dark"
                  ? "text-slate-600"
                  : "text-slate-400"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* =========================================
              LOGOUT
          ========================================= */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className={`group flex h-9 items-center justify-center gap-1.5 rounded-xl border px-2.5 transition-all duration-200 sm:px-3 ${
              theme === "dark"
                ? "border-slate-700/80 bg-slate-800/40 text-slate-400 hover:border-rose-900/70 hover:bg-rose-950/30 hover:text-rose-400"
                : "border-slate-200 bg-white/80 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            <svg
              className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M10 17l5-5-5-5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M15 12H3"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M13 5h5a2 2 0 012 2v10a2 2 0 01-2 2h-5"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <span className="hidden text-[10px] font-bold sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}