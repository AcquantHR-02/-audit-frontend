"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import { useTheme } from "../context/ThemeContext";

// =========================================================
// MENU ITEMS
// =========================================================

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    section: "Overview",

    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z"
        />
      </svg>
    ),
  },

  {
    name: "Audits",
    href: "/dashboard/audits",
    section: "Management",

    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M9 5h6M9 3h6a2 2 0 012 2v1h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1V5a2 2 0 012-2z"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M8 12h8M8 16h5"
        />
      </svg>
    ),
  },

  {
    name: "Compliance",
    href: "/dashboard/compliance",
    section: "Management",

    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M9 12l2 2 4-4"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M20 12c0 5-3.5 8-8 10-4.5-2-8-5-8-10V5l8-3 8 3v7z"
        />
      </svg>
    ),
  },

  {
    name: "Findings",
    href: "/dashboard/finding",
    section: "Management",

    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M12 9v4"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M12 17h.01"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M10.3 3.8L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7 3L13.7 3.8a2 2 0 00-3.4 0z"
        />
      </svg>
    ),
  },

  {
    name: "Notifications",
    href: "/dashboard/notification",
    section: "Communication",
    badge: "3",

    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M10 21h4"
        />
      </svg>
    ),
  },

  {
    name: "Reports",
    href: "/dashboard/reports",
    section: "Communication",

    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          d="M8 17v-5M12 17V8M16 17v-3"
        />
      </svg>
    ),
  },
];

// =========================================================
// COMPONENT
// =========================================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { theme } = useTheme();

  // =======================================================
  // USER STATE
  // =======================================================

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // =======================================================
  // SIDEBAR STATE
  // =======================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =======================================================
  // AUTH STATE
  // =======================================================

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // =======================================================
  // AUTH CHECK
  // =======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);

      router.replace("/login");

      return;
    }

    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  // =======================================================
  // LOAD USER DATA
  // =======================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");

    if (storedName) {
      setName(storedName);
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, [isAuthenticated]);

  // =======================================================
  // USER INITIALS
  // =======================================================

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

  // =======================================================
  // MENU GROUPS
  // =======================================================

  const overviewItems = menuItems.filter((item) => item.section === "Overview");

  const managementItems = menuItems.filter(
    (item) => item.section === "Management",
  );

  const communicationItems = menuItems.filter(
    (item) => item.section === "Communication",
  );

  // =======================================================
  // MENU RENDER FUNCTION
  // =======================================================

  function renderMenu(items: typeof menuItems) {
    return items.map((item) => {
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);

      return (
        <Link
          key={item.href}
          href={item.href}
          title={!sidebarOpen ? item.name : undefined}
          onClick={() => {
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }}
          className={`group relative flex h-11 items-center rounded-xl transition-all duration-200 ${
            sidebarOpen ? "gap-3 px-3" : "justify-center px-0"
          } ${
            isActive ?
              theme === "dark" ?
                "bg-blue-500/10 text-blue-400"
              : "bg-white/90 text-blue-700 shadow-sm"
            : theme === "dark" ?
              "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
            : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
          }`}
        >
          {/* ACTIVE INDICATOR */}

          {isActive && (
            <span
              className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full ${
                theme === "dark" ? "bg-blue-500" : "bg-blue-600"
              }`}
            />
          )}

          {/* ICON */}

          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
              isActive ?
                theme === "dark" ?
                  "bg-blue-500/10 text-blue-400"
                : "bg-white text-blue-700 shadow-sm"
              : theme === "dark" ?
                "text-slate-500 group-hover:bg-slate-700 group-hover:text-blue-400"
              : "text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm"
            }`}
          >
            {item.icon}
          </span>

          {/* MENU LABEL */}

          <span
            className={`min-w-0 flex-1 truncate whitespace-nowrap text-[12px] font-medium transition-all duration-200 ${
              sidebarOpen ?
                "translate-x-0 opacity-100"
              : "pointer-events-none absolute left-14 -translate-x-2 opacity-0"
            }`}
          >
            {item.name}
          </span>

          {/* NOTIFICATION BADGE */}

          {item.badge && (
            <span
              className={`flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white transition-all duration-200 ${
                sidebarOpen ?
                  "min-w-[20px] px-1.5 py-0.5"
                : "absolute right-1 top-1 min-w-[15px] px-1 py-0.5"
              }`}
            >
              {item.badge}
            </span>
          )}

          {/* ACTIVE ARROW */}

          {isActive && sidebarOpen && !item.badge && (
            <svg
              className="h-3.5 w-3.5 shrink-0 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </Link>
      );
    });
  }

  // =======================================================
  // AUTH LOADING
  // =======================================================

  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  // =======================================================
  // LAYOUT
  // =======================================================

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900" : "bg-[#f4f7fb]"
      }`}
    >
      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar />

      {/* ===================================================
          MOBILE BACKDROP
      =================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-slate-950/30 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r transition-all duration-300 ease-out ${
          sidebarOpen ? "w-[235px]" : "w-[64px]"
        } ${
          theme === "dark" ?
            "border-slate-800 bg-[#172033]"
          : "border-[#d8e3f2] bg-gradient-to-b from-[#eaf2ff] via-[#f0f5fc] to-[#f6f8fc]"
        }`}
      >
        {/* SIDEBAR HEADER */}

        <div
          className={`flex h-16 shrink-0 items-center border-b transition-all duration-300 ${
            sidebarOpen ? "justify-start px-3" : "justify-center px-0"
          } ${theme === "dark" ? "border-slate-800" : "border-[#d8e3f2]"}`}
        >
          {/* HAMBURGER */}

          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
              theme === "dark" ?
                "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-500 hover:bg-white/80 hover:text-blue-700"
            }`}
          >
            {sidebarOpen ?
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            : <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            }
          </button>

          {/* BRAND */}

          <div
            className={`ml-2 min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <p
              className={`text-[12px] font-bold ${
                theme === "dark" ? "text-slate-100" : "text-slate-800"
              }`}
            >
              Audit Management
            </p>

            <p
              className={`text-[9px] ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Control Center
            </p>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
          {/* OVERVIEW */}

          <div className="mb-5">
            <p
              className={`mb-2 overflow-hidden px-2 text-[9px] font-bold uppercase tracking-[0.16em] transition-all duration-200 ${
                sidebarOpen ? "h-3 opacity-100" : "h-0 opacity-0"
              } ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}
            >
              Overview
            </p>

            <div className="space-y-1">{renderMenu(overviewItems)}</div>
          </div>

          {/* MANAGEMENT */}

          <div className="mb-5">
            <p
              className={`mb-2 overflow-hidden px-2 text-[9px] font-bold uppercase tracking-[0.16em] transition-all duration-200 ${
                sidebarOpen ? "h-3 opacity-100" : "h-0 opacity-0"
              } ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}
            >
              Management
            </p>

            <div className="space-y-1">{renderMenu(managementItems)}</div>
          </div>

          {/* COMMUNICATION */}

          <div>
            <p
              className={`mb-2 overflow-hidden px-2 text-[9px] font-bold uppercase tracking-[0.16em] transition-all duration-200 ${
                sidebarOpen ? "h-3 opacity-100" : "h-0 opacity-0"
              } ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}
            >
              Communication
            </p>

            <div className="space-y-1">{renderMenu(communicationItems)}</div>
          </div>
        </nav>

        <div className="shrink-0 p-2">
          <div
            className={`flex items-center rounded-xl transition-all ${
              sidebarOpen ? "gap-3 px-2 py-2" : "justify-center px-0 py-2"
            } ${theme === "dark" ? "bg-slate-800/70" : "bg-white/60"}`}
          >
            {/* AVATAR */}

            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                theme === "dark" ?
                  "bg-blue-500/15 text-blue-400"
                : "bg-blue-50 text-blue-700"
              }`}
            >
              {getInitials(name)}
            </div>

            {/* USER INFO */}

            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[11px] font-semibold ${
                    theme === "dark" ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {name || "User"}
                </p>

                <p
                  className={`truncate text-[9px] ${
                    theme === "dark" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {role || "User"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main
        className={`min-h-screen overflow-x-hidden pt-16 pb-[58px] transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[235px]" : "lg:ml-[64px]"
        } ${theme === "dark" ? "bg-slate-900" : "bg-[#f4f7fb]"}`}
      >
        {children}
      </main>

      {/* ===================================================
          FIXED FOOTER
      =================================================== */}

      <footer
        className={`fixed bottom-0 left-0 right-0 z-50 h-[45px] border-t transition-all duration-300 ${
          theme === "dark" ?
            "border-slate-800 bg-[#172033]"
          : "border-[#d8e3f2] bg-gradient-to-b from-[#eaf2ff] via-[#f0f5fc] to-[#f6f8fc]"
        }`}
      >
        <div
          className={`flex h-full items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-5 ${
            sidebarOpen ? "lg:pl-[255px]" : "lg:pl-[84px]"
          } lg:pr-6`}
        >
          {/* =================================================
        LEFT — COPYRIGHT
    ================================================= */}

          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-[10px] font-medium sm:text-[11px] ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              © {new Date().getFullYear()} Audit Management System
            </p>
          </div>

          {/* =================================================
        CENTER — SYSTEM INFO
    ================================================= */}

          <div
            className={`hidden items-center gap-2 md:flex ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <span className="text-[10px]">Secure Audit Management</span>

            <span
              className={`h-1 w-1 rounded-full ${
                theme === "dark" ? "bg-slate-600" : "bg-slate-300"
              }`}
            />

            <span className="text-[10px]">All rights reserved</span>
          </div>

          {/* =================================================
        RIGHT — VERSION + STATUS
    ================================================= */}

          <div className="flex shrink-0 items-center gap-2">
            {/* SYSTEM STATUS */}

            <div
              className={`hidden items-center gap-1.5 sm:flex ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  theme === "dark" ? "bg-emerald-400" : "bg-emerald-500"
                }`}
              />

              <span className="text-[10px]">System Online</span>
            </div>

            {/* VERSION */}

            <span
              className={`rounded-md border px-2 py-1 text-[9px] font-semibold ${
                theme === "dark" ?
                  "border-slate-700 bg-slate-800/80 text-slate-400"
                : "border-slate-200 bg-white/60 text-slate-500"
              }`}
            >
              v1.0.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
