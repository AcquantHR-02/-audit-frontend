"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Audits",
    href: "/dashboard/audits",
  },
  {
    name: "Compliance",
    href: "/dashboard/compliance",
  },
  {
    name: "Findings",
    href: "/dashboard/finding",
  },
  {
    name: "Notifications",
    href: "/dashboard/notification",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-gray-900 text-white">

        {/* Sidebar Header */}
        <div className="p-6">
          <h1 className="text-xl font-bold">
            Audit Management
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Management System
          </p>
        </div>

        {/* Menu */}
        <nav className="px-4">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen pt-16">
        {children}
      </main>

    </div>
  );
}