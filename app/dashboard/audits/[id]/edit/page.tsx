"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getAuditById,
  updateAudit,
  type Audit,
  type AuditRequest,
} from "@/app/lib/api/auditApi";

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

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4L16.5 3.5z" />
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

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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
// STATUS CONFIG
// ======================================================

function getStatusConfig(status: string, isDark: boolean) {
  switch (status) {
    case "Completed":
      return {
        icon: <CheckCircleIcon />,
        dot: "bg-emerald-500",
        badge: isDark
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      };

    case "In Progress":
      return {
        icon: <ClockIcon />,
        dot: "bg-blue-500",
        badge: isDark
          ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
      };

    case "Pending":
    default:
      return {
        icon: <AlertCircleIcon />,
        dot: "bg-amber-500",
        badge: isDark
          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
          : "border-amber-200 bg-amber-50 text-amber-700",
      };
  }
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function EditAuditPage() {
  const params = useParams();
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ======================================================
  // AUDIT STATE
  // ======================================================

  const [audit, setAudit] = useState<Audit | null>(null);

  // ======================================================
  // FORM STATE
  // ======================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  // ======================================================
  // UI STATES
  // ======================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // GET AUDIT
  // ======================================================

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(params.id);

        console.log("Edit page audit ID:", id);

        if (Number.isNaN(id)) {
          setError("Invalid audit ID.");
          return;
        }

        const data = await getAuditById(id);

        console.log("Audit received:", data);

        setAudit(data);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          status: data.status || "Pending",
        });
      } catch (error: any) {
        console.error("Error fetching audit:", error);

        if (error.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (error.response?.status === 403) {
          setError(
            "You do not have permission to view this audit.",
          );
        } else if (error.response?.status === 404) {
          setError("Audit not found.");
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError(
            "Unable to load audit. Please check your backend connection.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAudit();
    }
  }, [params.id]);

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
  };

  // ======================================================
  // HANDLE UPDATE
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
      setError("Please enter audit title.");
      return;
    }

    if (!formData.startDate) {
      setError("Please select start date.");
      return;
    }

    if (!formData.endDate) {
      setError("Please select end date.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    if (!formData.status) {
      setError("Please select status.");
      return;
    }

    // ====================================================
    // UPDATE API
    // ====================================================

    try {
      setSaving(true);

      const id = Number(params.id);

      const auditData: AuditRequest = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        startDate: formData.startDate,

        endDate: formData.endDate,

        status: formData.status,

        // Existing auditor maintain rahega
        auditor: audit?.auditor
          ? {
              id: audit.auditor.id,
            }
          : null,
      };

      console.log("Updating audit:", id, auditData);

      const updatedAudit = await updateAudit(id, auditData);

      console.log(
        "Audit updated successfully:",
        updatedAudit,
      );

      alert("Audit updated successfully!");

      router.push(`/dashboard/audits/${id}`);
    } catch (error: any) {
      console.error("Update audit error:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to update this audit.",
        );
      } else if (error.response?.status === 404) {
        setError("Audit not found.");
      } else if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            "Invalid audit data.",
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to update audit. Please check your backend connection.",
        );
      }
    } finally {
      setSaving(false);
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
  // LOADING UI
  // ======================================================

  if (loading) {
    return (
      <div className={`min-h-screen p-5 md:p-8 ${pageClass}`}>
        <div className="mx-auto max-w-5xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <div
              className={`h-4 w-32 animate-pulse rounded ${
                isDark ? "bg-slate-700" : "bg-slate-200"
              }`}
            />

            <div
              className={`mt-5 h-9 w-64 animate-pulse rounded ${
                isDark ? "bg-slate-700" : "bg-slate-200"
              }`}
            />

            <div
              className={`mt-3 h-4 w-96 max-w-full animate-pulse rounded ${
                isDark ? "bg-slate-700" : "bg-slate-200"
              }`}
            />
          </div>

          {/* Card skeletons */}
          <div className="space-y-6">
            <div
              className={`h-80 animate-pulse rounded-2xl ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            />

            <div
              className={`h-64 animate-pulse rounded-2xl ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR UI
  // ======================================================

  if (error && !audit) {
    return (
      <div className={`min-h-screen p-5 md:p-8 ${pageClass}`}>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div
            className={`w-full rounded-2xl border p-8 text-center shadow-sm ${
              isDark
                ? "border-red-400/20 bg-slate-800"
                : "border-red-200 bg-white"
            }`}
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                isDark
                  ? "bg-red-400/10 text-red-400"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <AlertCircleIcon />
            </div>

            <h1
              className={`mt-5 text-2xl font-bold ${headingClass}`}
            >
              Unable to Load Audit
            </h1>

            <p className={`mt-3 text-sm ${mutedClass}`}>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/audits")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeftIcon />
              Back to Audits
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className={`min-h-screen p-5 md:p-8 ${pageClass}`}>
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/audits/${params.id}`,
              )
            }
            className={`inline-flex items-center gap-2 text-sm font-medium transition ${
              isDark
                ? "text-slate-400 hover:text-blue-400"
                : "text-slate-500 hover:text-blue-600"
            }`}
          >
            <ArrowLeftIcon />
            Back to Audit
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
                  AUD-
                  {String(params.id).padStart(3, "0")}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    isDark
                      ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
                      : "border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  <EditIcon />
                  Editing Audit
                </span>
              </div>

              <h1
                className={`mt-4 text-3xl font-bold tracking-tight ${headingClass}`}
              >
                Edit Audit
              </h1>

              <p
                className={`mt-2 max-w-2xl text-sm ${mutedClass}`}
              >
                Update the audit information, schedule,
                and status. Your changes will be saved to
                the audit record.
              </p>
            </div>

            {/* Current status */}
            {audit?.status && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                  getStatusConfig(
                    audit.status,
                    isDark,
                  ).badge
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    getStatusConfig(
                      audit.status,
                      isDark,
                    ).dot
                  }`}
                />
                Current: {audit.status}
              </div>
            )}
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
                isDark ? "text-red-400" : "text-red-600"
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
                Unable to save changes
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
              AUDIT INFORMATION
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
                    Audit Information
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    Update the basic information of
                    this audit.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">

              {/* TITLE */}

              <div>
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
                  disabled={saving}
                  placeholder="Enter audit title"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="description"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter a clear description of the audit"
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />

                <p
                  className={`mt-2 text-xs ${mutedClass}`}
                >
                  Provide enough information to explain
                  the purpose and scope of this audit.
                </p>
              </div>
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
                    Define when the audit starts and
                    when it should be completed.
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
                  disabled={saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />
              </div>

              {/* END DATE */}

              <div>
                <label
                  htmlFor="endDate"
                  className={`mb-2 block text-sm font-semibold ${labelClass}`}
                >
                  End Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed ${inputClass}`}
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              STATUS
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
                  <ClockIcon />
                </div>

                <div>
                  <h2
                    className={`text-lg font-bold ${headingClass}`}
                  >
                    Audit Status
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    Change the current status of the
                    audit.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label
                htmlFor="status"
                className={`mb-2 block text-sm font-semibold ${labelClass}`}
              >
                Status
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed md:max-w-md ${inputClass}`}
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

              <div className="mt-4">
                {(() => {
                  const statusConfig =
                    getStatusConfig(
                      formData.status,
                      isDark,
                    );

                  return (
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig.badge}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusConfig.dot}`}
                      />

                      {formData.status}
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* ==================================================
              AUDITOR INFORMATION
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
                    Assigned Auditor
                  </h2>

                  <p
                    className={`mt-1 text-sm ${mutedClass}`}
                  >
                    The existing auditor assignment
                    will be preserved.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {audit?.auditor ? (
                <div
                  className={`flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center ${
                    isDark
                      ? "border-slate-700 bg-slate-700/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {/* Avatar */}

                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                      isDark
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {audit.auditor.name
                      ?.charAt(0)
                      .toUpperCase() || "A"}
                  </div>

                  {/* User information */}

                  <div className="min-w-0">
                    <p
                      className={`font-bold ${headingClass}`}
                    >
                      {audit.auditor.name}
                    </p>

                    <p
                      className={`mt-1 break-all text-sm ${mutedClass}`}
                    >
                      {audit.auditor.email || "-"}
                    </p>

                    {audit.auditor.role?.name && (
                      <span
                        className={`mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                          isDark
                            ? "bg-slate-600 text-slate-300"
                            : "bg-white text-slate-600"
                        }`}
                      >
                        {audit.auditor.role.name}
                      </span>
                    )}
                  </div>

                  {/* Preserved badge */}

                  <div className="sm:ml-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        isDark
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <CheckCircleIcon />
                      Preserved
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-xl border p-5 ${
                    isDark
                      ? "border-slate-700 bg-slate-700/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${mutedClass}`}
                  >
                    <UserIcon />

                    <p className="text-sm">
                      No auditor is currently assigned
                      to this audit.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              ACTION BAR
          ================================================== */}

          <div
            className={`sticky bottom-4 z-10 flex flex-col-reverse gap-3 rounded-2xl border p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between ${
              isDark
                ? "border-slate-700 bg-slate-800/95 backdrop-blur"
                : "border-slate-200 bg-white/95 backdrop-blur"
            }`}
          >
            <p
              className={`hidden text-xs sm:block ${mutedClass}`}
            >
              Make sure all audit information is correct
              before saving.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/dashboard/audits/${params.id}`,
                  )
                }
                disabled={saving}
                className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Cancel
              </button>

              {/* SAVE */}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderIcon />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Save Changes
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