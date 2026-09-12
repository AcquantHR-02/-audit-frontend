"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";

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
          d="M10.3 3.8L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z"
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");

    if (storedName) {
      setName(storedName);
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  function getInitials(userName: string) {
    if (!userName) {
      return "U";
    }

    const words = userName.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  const overviewItems = menuItems.filter(
    (item) => item.section === "Overview"
  );

  const managementItems = menuItems.filter(
    (item) => item.section === "Management"
  );

  const communicationItems = menuItems.filter(
    (item) => item.section === "Communication"
  );

  function renderMenu(items: typeof menuItems) {
    return items.map((item) => {
      const isActive =
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`group relative flex min-h-[42px] items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition-all duration-200 ${
            isActive
              ? "bg-blue-600 text-white shadow-sm shadow-blue-950/20"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          {/* Active Indicator */}

          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />
          )}

          {/* Icon */}

          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${
              isActive
                ? "bg-white/10 text-white"
                : "text-slate-500 group-hover:bg-slate-700 group-hover:text-blue-400"
            }`}
          >
            {item.icon}
          </span>

          {/* Name */}

          <span className="min-w-0 flex-1 truncate">
            {item.name}
          </span>

          {/* Badge */}

          {item.badge && (
            <span
              className={`flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                isActive
                  ? "bg-white text-blue-600"
                  : "bg-blue-600 text-white"
              }`}
            >
              {item.badge}
            </span>
          )}

          {/* Active Arrow */}

          {isActive && !item.badge && (
            <svg
              className="h-3.5 w-3.5 shrink-0 text-white/70"
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <Navbar />

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[235px] flex-col overflow-hidden border-r border-slate-800 bg-slate-950 text-white">

        {/* ================================================= */}
        {/* SIDEBAR BRAND */}
        {/* ================================================= */}

        <div className="border-b border-slate-800 px-4">

        

        </div>


        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">

          {/* Overview */}

          <div className="mb-5">

            <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Overview
            </p>

            <div className="space-y-1">
              {renderMenu(overviewItems)}
            </div>

          </div>

          {/* Management */}

          <div className="mb-5">

            <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Management
            </p>

            <div className="space-y-1">
              {renderMenu(managementItems)}
            </div>

          </div>

          {/* Communication */}

          <div>

            <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Communication
            </p>

            <div className="space-y-1">
              {renderMenu(communicationItems)}
            </div>

          </div>

        </nav>

        {/* ================================================= */}
        {/* SIDEBAR FOOTER / USER */}
        {/* ================================================= */}

        

      

      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="ml-[235px] min-h-screen overflow-x-hidden pt-16">
        {children}
      </main>

    </div>
  );
}

