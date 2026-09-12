"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // =========================
    // GET LOGGED-IN USER DATA
    // =========================

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
      return words[0]
        .charAt(0)
        .toUpperCase();
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

    router.replace("/login");
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white">

      <div className="flex h-full items-center justify-between px-6">

        {/* ========================= */}
        {/* LOGO / BRAND */}
        {/* ========================= */}

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >

          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-lg font-bold text-white">
            A
          </div>

          {/* Brand */}
          <div>
            <h1 className="text-sm font-bold text-gray-900">
              Audit Management
            </h1>

            <p className="text-xs text-gray-500">
              System
            </p>
          </div>

        </Link>

        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}

        <div className="flex items-center gap-5">

          {/* ========================= */}
          {/* NOTIFICATION */}
          {/* ========================= */}

          <button
            type="button"
            className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            title="Notifications"
          >
            <span className="text-lg">
              🔔
            </span>

            {/* Notification Badge */}
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* ========================= */}
          {/* USER */}
          {/* ========================= */}

          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
              {getInitials(name)}
            </div>

            {/* User Details */}
            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-gray-900">
                {name || "Loading..."}
              </p>

              <p className="text-xs text-gray-500">
                {role || "User"}
              </p>

            </div>

          </div>

          {/* ========================= */}
          {/* LOGOUT */}
          {/* ========================= */}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}