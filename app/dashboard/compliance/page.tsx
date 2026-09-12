"use client";

import { useState } from "react";
import Link from "next/link";

const complianceRecords = [
  {
    id: "CMP-001",
    act: "Shops and Establishments Act",
    category: "Registration",
    state: "Karnataka",
    status: "Compliant",
    dueDate: "15 Sep 2026",
  },
  {
    id: "CMP-002",
    act: "Payment of Wages Act",
    category: "Returns",
    state: "Karnataka",
    status: "Due Soon",
    dueDate: "20 Sep 2026",
  },
  {
    id: "CMP-003",
    act: "Factories Act",
    category: "Registers",
    state: "Maharashtra",
    status: "Compliant",
    dueDate: "25 Sep 2026",
  },
  {
    id: "CMP-004",
    act: "Contract Labour Act",
    category: "Registration",
    state: "Delhi",
    status: "Overdue",
    dueDate: "05 Sep 2026",
  },
  {
    id: "CMP-005",
    act: "Minimum Wages Act",
    category: "Remittance",
    state: "Karnataka",
    status: "Compliant",
    dueDate: "30 Sep 2026",
  },
  {
    id: "CMP-006",
    act: "Employees' Provident Funds Act",
    category: "Returns",
    state: "Tamil Nadu",
    status: "Due Soon",
    dueDate: "02 Oct 2026",
  },
  {
    id: "CMP-007",
    act: "Payment of Bonus Act",
    category: "Returns",
    state: "Karnataka",
    status: "Compliant",
    dueDate: "05 Oct 2026",
  },
  {
    id: "CMP-008",
    act: "Payment of Gratuity Act",
    category: "Registers",
    state: "Maharashtra",
    status: "Overdue",
    dueDate: "08 Oct 2026",
  },
  {
    id: "CMP-009",
    act: "Maternity Benefit Act",
    category: "Registers",
    state: "Delhi",
    status: "Compliant",
    dueDate: "12 Oct 2026",
  },
  {
    id: "CMP-010",
    act: "Equal Remuneration Act",
    category: "Returns",
    state: "Tamil Nadu",
    status: "Due Soon",
    dueDate: "15 Oct 2026",
  },
];

function getStatusClass(status) {
  if (status === "Compliant") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Due Soon") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "Overdue") {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

function getStatusDot(status) {
  if (status === "Compliant") {
    return "bg-emerald-500";
  }

  if (status === "Due Soon") {
    return "bg-amber-500";
  }

  if (status === "Overdue") {
    return "bg-red-500";
  }

  return "bg-slate-400";
}

export default function CompliancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");

  const compliantCount = complianceRecords.filter(
    (record) => record.status === "Compliant"
  ).length;

  const dueSoonCount = complianceRecords.filter(
    (record) => record.status === "Due Soon"
  ).length;

  const overdueCount = complianceRecords.filter(
    (record) => record.status === "Overdue"
  ).length;

  const filteredRecords = complianceRecords.filter((record) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      record.id.toLowerCase().includes(searchValue) ||
      record.act.toLowerCase().includes(searchValue) ||
      record.category.toLowerCase().includes(searchValue) ||
      record.state.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      record.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      record.category === categoryFilter;

    const matchesState =
      stateFilter === "All" ||
      record.state === stateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesState
    );
  });

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setStateFilter("All");
  };

  const filtersActive =
    search ||
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    stateFilter !== "All";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">

      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link
              href="/dashboard"
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-slate-700">
              Compliance
            </span>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold text-slate-900">
            Compliance
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Monitor and manage statutory compliance requirements.
          </p>
        </div>

        <Link
          href="/dashboard/compliance/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-base">+</span>
          Add Compliance
        </Link>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">

        {/* TOTAL */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Total Compliance
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                24
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                All requirements
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-sm">
              📋
            </div>
          </div>
        </div>

        {/* COMPLIANT */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Compliant
              </p>

              <h2 className="mt-1 text-2xl font-bold text-emerald-600">
                16
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Requirements completed
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-sm">
              ✓
            </div>
          </div>
        </div>

        {/* DUE SOON */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Due Soon
              </p>

              <h2 className="mt-1 text-2xl font-bold text-amber-600">
                5
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Requiring attention
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-sm">
              ⏳
            </div>
          </div>
        </div>

        {/* OVERDUE */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Overdue
              </p>

              <h2 className="mt-1 text-2xl font-bold text-red-600">
                3
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Immediate action
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-sm">
              ⚠
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="mb-5 rounded-lg border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Search & Filters
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Search and filter statutory compliance records.
          </p>
        </div>

        <div className="p-4">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">

            {/* SEARCH */}
            <div className="xl:col-span-5">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                Search
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search ID, Act, Category or State..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">All Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">All Categories</option>
                <option value="Registration">
                  Registration
                </option>
                <option value="Returns">
                  Returns
                </option>
                <option value="Registers">
                  Registers
                </option>
                <option value="Remittance">
                  Remittance
                </option>
              </select>
            </div>

            {/* STATE */}
            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                State
              </label>

              <select
                value={stateFilter}
                onChange={(event) =>
                  setStateFilter(event.target.value)
                }
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">All States</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>

            {/* RESET */}
            <div className="flex items-end xl:col-span-1">
              <button
                onClick={resetFilters}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Reset
              </button>
            </div>
          </div>

          {/* RESULT INFO */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

            <p className="text-[11px] text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredRecords.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {complianceRecords.length}
              </span>{" "}
              records
            </p>

            {filtersActive && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                Filters Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* COMPLIANCE TABLE */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

        {/* TABLE HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Compliance Requirements
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Overview of statutory compliance requirements.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
            {filteredRecords.length} Records
          </span>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  ID
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Act
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  State
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Due Date
                </th>

                <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* ID */}
                   <td className="px-4 py-3">
  <Link
    href={`/dashboard/compliance/${record.id}`}
    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
  >
    {record.id}
  </Link>
</td>

                    {/* ACT */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600">
                          L
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {record.act}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Statutory Compliance
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                        {record.category}
                      </span>
                    </td>

                    {/* STATE */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">
                        {record.state}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                          record.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            record.status
                          )}`}
                        ></span>

                        {record.status}
                      </span>
                    </td>

                    {/* DUE DATE */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-600">
                        {record.dueDate}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/compliance/${record.id}`}
                        className="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-12 text-center"
                  >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg">
                      🔍
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                      No compliance records found
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or filters.
                    </p>

                    <button
                      onClick={resetFilters}
                      className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-100 px-4 py-2.5">
          <div className="flex items-center justify-between">

            <p className="text-[10px] text-slate-400">
              Statutory compliance monitoring
            </p>

            <span className="text-[10px] text-slate-400">
              {filteredRecords.length} of {complianceRecords.length}
            </span>

          </div>
        </div>
      </div>
    </div>
  );
}