"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createAudit,
  type AuditRequest,
} from "../../../lib/api/auditApi";

import {
  getAllUsers,
  type User,
} from "../../../lib/api/userApi";

import { useTheme } from "@/app/context/ThemeContext";

// ======================================================
// ICONS
// ======================================================

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0116 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 3l8 4v5c0 5.2-3.4 8.5-8 10-4.6-1.5-8-4.8-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M5 21V4" />
      <path d="M5 4c4-3 6 3 10 0 1.5-1.1 3-1.1 4 0v9c-4 3-6-3-10 0-1.5 1.1-3 1.1-4 0" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function LoaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />

      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function CreateAuditPage() {
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ======================================================
  // FORM STATE
  // ======================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    auditType: "",
    auditor: "",
    startDate: "",
    dueDate: "",
    priority: "",
    complianceArea: "",
    status: "Pending",
  });

  // ======================================================
  // AUDITOR STATE
  // ======================================================

  const [auditors, setAuditors] = useState<User[]>([]);

  const [loadingAuditors, setLoadingAuditors] =
    useState(true);

  // ======================================================
  // UI STATE
  // ======================================================

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // ======================================================
  // LOAD AUDITORS
  // ======================================================

  useEffect(() => {
    const fetchAuditors = async () => {
      try {
        setLoadingAuditors(true);
        setError("");

        const users = await getAllUsers();

        // Only users with AUDITOR role
        const auditorUsers = users.filter(
          (user) =>
            user.role?.name?.toUpperCase() === "AUDITOR",
        );

        setAuditors(auditorUsers);
      } catch (error) {
        console.error(
          "Failed to load auditors:",
          error,
        );

        setError(
          "Unable to load auditors. Please try again.",
        );
      } finally {
        setLoadingAuditors(false);
      }
    };

    fetchAuditors();
  }, []);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove old validation error when user starts editing
    if (error) {
      setError("");
    }
  };

  // ======================================================
  // HANDLE SUBMIT
  // ======================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    // ====================================================
    // VALIDATION
    // ====================================================

    if (!formData.title.trim()) {
      setError("Audit title is required.");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (
      new Date(formData.dueDate) <
      new Date(formData.startDate)
    ) {
      setError(
        "Due date cannot be before start date.",
      );
      return;
    }

    if (!formData.auditor) {
      setError("Please select an auditor.");
      return;
    }

    // ====================================================
    // CREATE AUDIT
    // ====================================================

    try {
      setLoading(true);

      const auditData: AuditRequest = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        startDate: formData.startDate,

        endDate: formData.dueDate,

        status: formData.status,

        auditor: {
          id: Number(formData.auditor),
        },
      };

      console.log(
        "Creating audit with data:",
        auditData,
      );

      await createAudit(auditData);

      // Redirect after successful creation
      router.push("/dashboard/audits");
    } catch (error: any) {
      console.error(
        "Failed to create audit:",
        error,
      );

      if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            "Invalid audit data. Please check your information.",
        );
      } else if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again.",
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to create an audit.",
        );
      } else {
        setError(
          "Failed to create audit. Please check your backend connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // COMMON STYLES
  // ======================================================

  const pageClass = isDark
    ? "bg-slate-900 text-slate-100"
    : "bg-slate-50 text-slate-900";

  const cardClass = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-slate-200 bg-white";

  const cardHeaderClass = isDark
    ? "border-slate-700"
    : "border-slate-100";

  const headingClass = isDark
    ? "text-slate-100"
    : "text-slate-900";

  const mutedClass = isDark
    ? "text-slate-400"
    : "text-slate-500";

  const labelClass = isDark
    ? "text-slate-300"
    : "text-slate-700";

  const inputClass = isDark
    ? "border-slate-600 bg-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 disabled:bg-slate-700/40"
    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-100 disabled:bg-slate-100";

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className={`min-h-screen p-5 md:p-8 ${pageClass}`}
    >
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/audits")
            }
            className={`inline-flex items-center gap-2 text-sm font-medium transition ${
              isDark
                ? "text-slate-400 hover:text-blue-400"
                : "text-slate-500 hover:text-blue-600"
            }`}
          >
            <ArrowLeftIcon />
            Back to Audits
          </button>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-3 py-1 text-xs font-bold tracking-wide ${
                    isDark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  NEW AUDIT
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    isDark
                      ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
                      : "border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  Audit Management
                </span>
              </div>

              <h1
                className={`mt-4 text-3xl font-bold tracking-tight ${headingClass}`}
              >
                Create Audit
              </h1>

              <p
                className={`mt-2 max-w-2xl text-sm ${mutedClass}`}
              >
                Create a new audit, define its schedule,
                and assign an auditor.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
              isDark
                ? "border-red-400/20 bg-red-400/10"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div
              className={
                isDark
                  ? "text-red-400"
                  : "text-red-600"
              }
            >
              <AlertCircleIcon />
            </div>

            <div>
              <p
                className={`text-sm font-semibold ${
                  isDark
                    ? "text-red-300"
                    : "text-red-700"
                }`}
              >
                Please check the form
              </p>

              <p
                className={`mt-1 text-sm ${
                  isDark
                    ? "text-red-300/80"
                    : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <section
            className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}
          >
            <div
              className={`border-b px-6 py-5 ${cardHeaderClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-blue-400/10 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <FileTextIcon />
                </div>

                <div>
                  <h2
                    className={`text-lg font-bold ${headingClass}`}
                  >
                    Basic Information
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    Enter the basic details of the
                    audit.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* TITLE */}

              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Audit Title
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g. HR Compliance Audit"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Describe the purpose and scope of this audit"
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />

                <p
                  className={`mt-2 text-xs ${mutedClass}`}
                >
                  Provide a clear description so the
                  audit scope is easy to understand.
                </p>
              </div>

              {/* AUDIT TYPE */}

              <div>
                <label
                  htmlFor="auditType"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Audit Type
                </label>

                <select
                  id="auditType"
                  name="auditType"
                  value={formData.auditType}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                >
                  <option value="">
                    Select audit type
                  </option>

                  <option value="Internal">
                    Internal
                  </option>

                  <option value="External">
                    External
                  </option>

                  <option value="Compliance">
                    Compliance
                  </option>

                  <option value="Financial">
                    Financial
                  </option>

                  <option value="IT">
                    IT
                  </option>
                </select>
              </div>

              {/* COMPLIANCE AREA */}

              <div>
                <label
                  htmlFor="complianceArea"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Compliance Area
                </label>

                <select
                  id="complianceArea"
                  name="complianceArea"
                  value={formData.complianceArea}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                >
                  <option value="">
                    Select compliance area
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="Finance">
                    Finance
                  </option>

                  <option value="IT Security">
                    IT Security
                  </option>

                  <option value="Operations">
                    Operations
                  </option>

                  <option value="Legal">
                    Legal
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* ==================================================
              ASSIGNMENT
          ================================================== */}

          <section
            className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}
          >
            <div
              className={`border-b px-6 py-5 ${cardHeaderClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <UserIcon />
                </div>

                <div>
                  <h2
                    className={`text-lg font-bold ${headingClass}`}
                  >
                    Auditor Assignment
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    Assign this audit to an available
                    auditor.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label
                htmlFor="auditor"
                className={`mb-2 block text-sm font-semibold ${labelClass}`}
              >
                Auditor
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="auditor"
                name="auditor"
                value={formData.auditor}
                onChange={handleChange}
                disabled={
                  loading ||
                  loadingAuditors
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed md:max-w-2xl ${inputClass}`}
              >
                <option value="">
                  {loadingAuditors
                    ? "Loading auditors..."
                    : "Select auditor"}
                </option>

                {auditors.map((auditor) => (
                  <option
                    key={auditor.id}
                    value={auditor.id}
                  >
                    {auditor.name} ({auditor.email})
                  </option>
                ))}
              </select>

              {/* No auditor message */}

              {!loadingAuditors &&
                auditors.length === 0 && (
                  <div
                    className={`mt-3 flex items-center gap-2 rounded-lg border p-3 text-xs ${
                      isDark
                        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    <AlertCircleIcon />

                    <span>
                      No users with the AUDITOR
                      role were found.
                    </span>
                  </div>
                )}

              {/* Selected auditor preview */}

              {formData.auditor && (
                <div
                  className={`mt-5 rounded-xl border p-4 ${
                    isDark
                      ? "border-slate-700 bg-slate-700/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {(() => {
                    const selectedAuditor =
                      auditors.find(
                        (auditor) =>
                          String(auditor.id) ===
                          formData.auditor,
                      );

                    if (!selectedAuditor) {
                      return null;
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold ${
                            isDark
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {selectedAuditor.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "A"}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`font-semibold ${headingClass}`}
                          >
                            {selectedAuditor.name}
                          </p>

                          <p
                            className={`mt-0.5 break-all text-xs ${mutedClass}`}
                          >
                            {selectedAuditor.email}
                          </p>
                        </div>

                        <div className="ml-auto text-emerald-500">
                          <CheckCircleIcon />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              SCHEDULE
          ================================================== */}

          <section
            className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}
          >
            <div
              className={`border-b px-6 py-5 ${cardHeaderClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-violet-400/10 text-violet-400"
                      : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <CalendarIcon />
                </div>

                <div>
                  <h2
                    className={`text-lg font-bold ${headingClass}`}
                  >
                    Audit Schedule
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    Set the start and due dates for
                    this audit.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* START DATE */}

              <div>
                <label
                  htmlFor="startDate"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Start Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />
              </div>

              {/* DUE DATE */}

              <div>
                <label
                  htmlFor="dueDate"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Due Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              PRIORITY & STATUS
          ================================================== */}

          <section
            className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}
          >
            <div
              className={`border-b px-6 py-5 ${cardHeaderClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDark
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <FlagIcon />
                </div>

                <div>
                  <h2
                    className={`text-lg font-bold ${headingClass}`}
                  >
                    Priority & Status
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    Set the priority and current status
                    of the audit.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* PRIORITY */}

              <div>
                <label
                  htmlFor="priority"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                >
                  <option value="">
                    Select priority
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label
                  htmlFor="status"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* ==================================================
              FORM ACTIONS
          ================================================== */}

          <div
            className={`sticky bottom-4 z-10 flex flex-col gap-4 rounded-2xl border p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between ${
              isDark
                ? "border-slate-700 bg-slate-800/95"
                : "border-slate-200 bg-white/95"
            }`}
          >
            <div
              className={`hidden items-center gap-2 text-xs sm:flex ${mutedClass}`}
            >
              <ShieldIcon />

              <span>
                Review the audit details before
                creating the record.
              </span>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/audits",
                  )
                }
                disabled={loading}
                className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Cancel
              </button>

              {/* CREATE */}

              <button
                type="submit"
                disabled={
                  loading ||
                  loadingAuditors
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderIcon />
                    Creating Audit...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Create Audit
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}