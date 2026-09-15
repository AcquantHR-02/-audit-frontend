"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // USER DATA
  // =========================

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");

    if (storedName) {
      setName(storedName);
    }

    if (storedRole) {
      setRole(storedRole);
    }

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // =========================
  // USER INITIALS
  // =========================

  function getInitials(userName: string) {
    if (!userName) {
      return "U";
    }

    const words = userName.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
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
      className={`fixed left-0 right-0 top-0 z-50 h-16 border-b backdrop-blur transition-colors duration-300 ${
        theme === "dark" ?
          "border-slate-800 bg-slate-950/95"
        : "border-slate-200 bg-white/95"
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* ================================================= */}
        {/* LOGO / BRAND */}
        {/* ================================================= */}

        <Link href="/dashboard" className="group flex items-center gap-2.5">
          {/* Logo */}

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm transition ${
              theme === "dark" ?
                "bg-blue-600 group-hover:bg-indigo-500"
              : "bg-slate-900 group-hover:bg-blue-600"
            }`}
          >
            A
          </div>

          {/* Brand */}

          <div className="hidden sm:block">
            <h1
              className={`text-[13px] font-bold leading-tight tracking-tight ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Audit Management
            </h1>

            <p
              className={`mt-0.5 text-[10px] font-medium ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              System
            </p>
          </div>
        </Link>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div className="flex items-center gap-2 md:gap-3">
          {/* ================================================= */}
          {/* DARK MODE TOGGLE */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
              theme === "dark" ?
                "border-slate-700 bg-slate-900 text-yellow-400 hover:bg-slate-800"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* ================================================= */}
          {/* NOTIFICATION */}
          {/* ================================================= */}

          <Link
            href="/dashboard/notification"
            title="Notifications"
            aria-label="Notifications"
            className={`group relative flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              theme === "dark" ?
                "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-blue-400"
              : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            {/* Bell Icon */}

            <svg
              className="h-[18px] w-[18px] transition-transform group-hover:scale-105"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15 17h5l-1.5-1.5A2.12 2.12 0 0118 14V11a6 6 0 00-12 0v3c0 .56-.22 1.1-.62 1.5L4 17h5m6 0a3 3 0 01-6 0m6 0H9"
              />
            </svg>

            {/* Unread Badge */}

            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />

              <span
                className={`relative inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ${
                  theme === "dark" ? "ring-slate-950" : "ring-white"
                }`}
              />
            </span>
          </Link>

          {/* ================================================= */}
          {/* DIVIDER */}
          {/* ================================================= */}

          <div
            className={`hidden h-7 w-px sm:block ${
              theme === "dark" ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          {/* ================================================= */}
          {/* USER PROFILE */}
          {/* ================================================= */}

          <div className="flex items-center gap-2.5">
            {/* Avatar */}

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ${
                theme === "dark" ?
                  "bg-blue-600 ring-blue-900/40"
                : "bg-blue-600 ring-blue-50"
              }`}
            >
              {getInitials(name)}
            </div>

            {/* User Details */}

            <div className="hidden min-w-0 md:block">
              <p
                className={`max-w-[140px] truncate text-xs font-semibold ${
                  theme === "dark" ? "text-slate-200" : "text-slate-800"
                }`}
                title={name}
              >
                {name || "Loading..."}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`text-[9px] font-medium uppercase tracking-wide ${
                    theme === "dark" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {role || "User"}
                </span>

                {email && (
                  <span
                    className={`hidden max-w-[130px] truncate text-[9px] lg:block ${
                      theme === "dark" ? "text-slate-600" : "text-slate-300"
                    }`}
                    title={email}
                  >
                    • {email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* LOGOUT */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`group flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition md:px-3 ${
              theme === "dark" ?
                "border-slate-700 bg-slate-900 text-slate-400 hover:border-red-900/60 hover:bg-red-950/30 hover:text-red-400"
              : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            {/* Logout Icon */}

            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M10 17l5-5-5-5M15 12H3m9-7h6a2 2 0 012 2v10a2 2 0 01-2 2h-6"
              />
            </svg>

            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
