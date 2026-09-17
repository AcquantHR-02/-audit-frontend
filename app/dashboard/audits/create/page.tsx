"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CalendarDays,
  UserRound,
  ClipboardCheck,
} from "lucide-react";

import { useTheme } from "@/app/context/ThemeContext";

import {
  createAudit,
  type AuditRequest,
} from "@/app/lib/api/auditApi";

import {
  getAllUsers,
  type User,
} from "@/app/lib/api/userApi";

// ======================================================
// CREATE AUDIT PAGE
// ======================================================

export default function CreateAuditPage() {
  const router = useRouter();
  const { theme } = useTheme();

  // ======================================================
  // STATES
  // ======================================================

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    auditType: "",
    complianceArea: "",
    priority: "Medium",
    status: "Pending",
    startDate: "",
    endDate: "",
    auditorId: "",
  });

  // ======================================================
  // LOAD USERS
  // ======================================================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const data = await getAllUsers();

        setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);

        setError("Unable to load auditors.");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // ======================================================
  // FILTER AUDITORS
  // ======================================================

  const auditors = users.filter((user) => {
    const roleName = user.role?.name?.toLowerCase();

    return (
      roleName === "auditor" ||
      roleName === "audit"
    );
  });

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const handleClose = () => {
    if (!submitting) {
      router.push("/dashboard/audits");
    }
  };

  // ======================================================
  // SUBMIT FORM
  // ======================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // ----------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------

    if (!formData.title.trim()) {
      setError("Audit title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Audit description is required.");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }

    if (!formData.endDate) {
      setError("End date is required.");
      return;
    }

    if (
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      setError(
        "End date cannot be before start date."
      );
      return;
    }

    if (!formData.auditorId) {
      setError("Please select an auditor.");
      return;
    }

    // ----------------------------------------------------
    // API REQUEST
    // ----------------------------------------------------

    const requestData: AuditRequest = {
      title: formData.title.trim(),

      description:
        formData.description.trim(),

      startDate: formData.startDate,

      endDate: formData.endDate,

      status: formData.status,

      auditor: {
        id: Number(formData.auditorId),
      },
    };

    try {
      setSubmitting(true);

      await createAudit(requestData);

      router.push("/dashboard/audits");

      router.refresh();
    } catch (err) {
      console.error(
        "Create audit error:",
        err
      );

      setError(
        "Failed to create audit. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // THEME
  // ======================================================

  const isDark = theme === "dark";

  // ------------------------------------------------------
  // OVERLAY
  // ------------------------------------------------------

  const overlayClass = isDark
    ? "bg-slate-950/60"
    : "bg-slate-900/30";

  // ------------------------------------------------------
  // MODAL
  // ------------------------------------------------------

  const modalClass = isDark
    ? "border-slate-700 bg-[#111a2e] text-slate-100"
    : "border-slate-200 bg-white text-slate-800";

  // ------------------------------------------------------
  // LABEL
  // ------------------------------------------------------

  const labelClass = isDark
    ? "text-slate-300"
    : "text-slate-600";

  // ------------------------------------------------------
  // INPUT
  // ------------------------------------------------------

  const inputClass = isDark
    ? `
      border-slate-700
      bg-[#18243a]
      text-slate-100
      placeholder:text-slate-500
    `
    : `
      border-slate-200
      bg-slate-50
      text-slate-800
      placeholder:text-slate-400
    `;

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className={`
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-3
        sm:p-5
        backdrop-blur-md
        ${overlayClass}
      `}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className={`
          w-[80vw]
          max-w-3xl
          rounded-2xl
          border
          shadow-2xl
          ${modalClass}
        `}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className={`
            flex
            items-center
            justify-between
            border-b
            px-4
            py-3
            ${
              isDark
                ? "border-slate-700"
                : "border-slate-200"
            }
          `}
        >
          {/* LEFT */}

          <div className="flex items-center gap-2.5">
            {/* ICON */}

            <div
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                ${
                  isDark
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }
              `}
            >
              <ClipboardCheck size={17} />
            </div>

            {/* TITLE */}

            <div>
              <h1 className="text-base font-semibold">
                Create New Audit
              </h1>

              <p
                className={`
                  text-[11px]
                  ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }
                `}
              >
                Add audit details and assign an auditor
              </p>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              transition
              ${
                isDark
                  ? `
                    text-slate-400
                    hover:bg-slate-800
                    hover:text-white
                  `
                  : `
                    text-slate-500
                    hover:bg-slate-100
                    hover:text-slate-800
                  `
              }
            `}
          >
            <X size={17} />
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form onSubmit={handleSubmit}>
          {/* ==================================================
              FORM CONTENT
          ================================================== */}

          <div className="px-4 py-3">

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className={`
                  mb-3
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-xs
                  ${
                    isDark
                      ? `
                        border-red-900/50
                        bg-red-950/30
                        text-red-300
                      `
                      : `
                        border-red-200
                        bg-red-50
                        text-red-600
                      `
                  }
                `}
              >
                {error}
              </div>
            )}

            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <div className="mb-3">
              <h2
                className={`
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }
                `}
              >
                Basic Information
              </h2>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-2.5
                  sm:grid-cols-2
                "
              >
                {/* ==================================================
                    TITLE
                ================================================== */}

                <div className="sm:col-span-2">
                  <label
                    className={`
                      mb-1
                      block
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    Audit Title{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter audit title"
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  />
                </div>

                {/* ==================================================
                    AUDIT TYPE
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      block
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    Audit Type
                  </label>

                  <select
                    name="auditType"
                    value={formData.auditType}
                    onChange={handleChange}
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  >
                    <option value="">
                      Select type
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

                    <option value="Operational">
                      Operational
                    </option>
                  </select>
                </div>

                {/* ==================================================
                    COMPLIANCE AREA
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      block
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    Compliance Area
                  </label>

                  <input
                    type="text"
                    name="complianceArea"
                    value={
                      formData.complianceArea
                    }
                    onChange={handleChange}
                    placeholder="e.g. ISO 27001"
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  />
                </div>

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="sm:col-span-2">
                  <label
                    className={`
                      mb-1
                      block
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    Description{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    placeholder="Enter a short description of the audit"
                    rows={2}
                    className={`
                      w-full
                      resize-none
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                ASSIGNMENT & SCHEDULE
            ================================================== */}

            <div className="mb-3">
              <h2
                className={`
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }
                `}
              >
                Assignment & Schedule
              </h2>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-2.5
                  sm:grid-cols-3
                "
              >
                {/* ==================================================
                    AUDITOR
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      flex
                      items-center
                      gap-1
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    <UserRound size={12} />

                    Auditor{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="auditorId"
                    value={
                      formData.auditorId
                    }
                    onChange={handleChange}
                    disabled={loadingUsers}
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-2.5
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      ${inputClass}
                    `}
                  >
                    <option value="">
                      {loadingUsers
                        ? "Loading..."
                        : auditors.length === 0
                        ? "No auditors found"
                        : "Select auditor"}
                    </option>

                    {auditors.map(
                      (auditor) => (
                        <option
                          key={auditor.id}
                          value={auditor.id}
                        >
                          {auditor.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* ==================================================
                    START DATE
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      flex
                      items-center
                      gap-1
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    <CalendarDays size={12} />

                    Start Date{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      formData.startDate
                    }
                    onChange={handleChange}
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-2.5
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  />
                </div>

                {/* ==================================================
                    END DATE
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      flex
                      items-center
                      gap-1
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    <CalendarDays size={12} />

                    End Date{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={
                      formData.endDate
                    }
                    onChange={handleChange}
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-2.5
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                STATUS & PRIORITY
            ================================================== */}

            <div>
              <h2
                className={`
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-500"
                  }
                `}
              >
                Audit Status
              </h2>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-2.5
                  sm:grid-cols-2
                "
              >
                {/* ==================================================
                    PRIORITY
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      block
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      formData.priority
                    }
                    onChange={handleChange}
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>
                  </select>
                </div>

                {/* ==================================================
                    STATUS
                ================================================== */}

                <div>
                  <label
                    className={`
                      mb-1
                      block
                      text-[11px]
                      font-medium
                      ${labelClass}
                    `}
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={handleChange}
                    className={`
                      h-9
                      w-full
                      rounded-lg
                      border
                      px-3
                      text-xs
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-1
                      focus:ring-blue-500/30
                      ${inputClass}
                    `}
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
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className={`
              flex
              items-center
              justify-end
              gap-2
              border-t
              px-4
              py-3
              ${
                isDark
                  ? "border-slate-700"
                  : "border-slate-200"
              }
            `}
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className={`
                h-8
                rounded-lg
                border
                px-4
                text-xs
                font-medium
                transition
                ${
                  isDark
                    ? `
                      border-slate-700
                      text-slate-300
                      hover:bg-slate-800
                    `
                    : `
                      border-slate-200
                      text-slate-600
                      hover:bg-slate-50
                    `
                }
              `}
            >
              Cancel
            </button>

            {/* CREATE */}

            <button
              type="submit"
              disabled={submitting}
              className="
                h-8
                rounded-lg
                bg-blue-600
                px-5
                text-xs
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {submitting
                ? "Creating..."
                : "Create Audit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}