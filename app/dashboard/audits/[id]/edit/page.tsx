"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleDot,
  Loader2,
  Save,
  UserRound,
  X,
} from "lucide-react";

import { useTheme } from "@/app/context/ThemeContext";

import {
  getAuditById,
  updateAudit,
  type Audit,
  type AuditRequest,
} from "@/app/lib/api/auditApi";

// ======================================================
// STATUS OPTIONS
// ======================================================

const STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Completed",
];

// ======================================================
// INPUT CLASS
// ======================================================

function inputClass(isDark: boolean) {
  return `
    h-9
    w-full
    rounded-lg
    border
    px-3
    text-sm
    outline-none
    transition
    ${
      isDark
        ? `
          border-slate-700
          bg-[#182337]
          text-slate-100
          placeholder:text-slate-500
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10
        `
        : `
          border-slate-200
          bg-white
          text-slate-800
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10
        `
    }
  `;
}

// ======================================================
// TEXTAREA CLASS
// ======================================================

function textareaClass(isDark: boolean) {
  return `
    h-12
    w-full
    resize-none
    rounded-lg
    border
    px-3
    py-2
    text-sm
    leading-5
    outline-none
    transition
    ${
      isDark
        ? `
          border-slate-700
          bg-[#182337]
          text-slate-100
          placeholder:text-slate-500
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10
        `
        : `
          border-slate-200
          bg-white
          text-slate-800
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10
        `
    }
  `;
}

// ======================================================
// DATE FORMATTER
// ======================================================

function formatDateForInput(date?: string) {
  if (!date) return "";

  // If already YYYY-MM-DD or ISO format
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.slice(0, 10);
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ======================================================
// PAGE
// ======================================================

export default function EditAuditPage() {
  const router = useRouter();
  const params = useParams();

  const { theme } = useTheme();

  const isDark = theme === "dark";

  // ====================================================
  // AUDIT ID
  // ====================================================

  const auditId = Number(params.id);

  // ====================================================
  // STATES
  // ====================================================

  const [audit, setAudit] = useState<Audit | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [status, setStatus] = useState("Pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // FETCH AUDIT
  // ====================================================

  useEffect(() => {
    if (!auditId || Number.isNaN(auditId)) {
      setError("Invalid audit ID.");
      setLoading(false);
      return;
    }

    const fetchAudit = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAuditById(auditId);

        setAudit(data);

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");

        setStartDate(formatDateForInput(data.startDate));
        setEndDate(formatDateForInput(data.endDate));

        setStatus(data.status ?? "Pending");
      } catch (err) {
        console.error("Failed to load audit:", err);

        setError(
          "Unable to load this audit. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [auditId]);

  // ====================================================
  // BODY SCROLL LOCK
  // ====================================================

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ====================================================
  // ESCAPE KEY
  // ====================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        router.push("/dashboard/audits");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, saving]);

  // ====================================================
  // CLOSE
  // ====================================================

  const handleClose = () => {
    if (saving) return;

    router.push("/dashboard/audits");
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!audit) return;

    setError("");

    // -----------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------

    if (!title.trim()) {
      setError("Audit title is required.");
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (!endDate) {
      setError("End date is required.");
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    // -----------------------------------------------
    // REQUEST
    // -----------------------------------------------

    const request: AuditRequest = {
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
      status,
      auditor: audit.auditor
        ? {
            id: audit.auditor.id,
          }
        : null,
    };

    try {
      setSaving(true);

      await updateAudit(audit.id, request);

      router.push("/dashboard/audits");
    } catch (err) {
      console.error("Failed to update audit:", err);

      setError(
        "Failed to update audit. Please try again."
      );

      setSaving(false);
    }
  };

  // ====================================================
  // DYNAMIC STATUS OPTIONS
  // ====================================================

  const statusOptions = STATUS_OPTIONS.includes(status)
    ? STATUS_OPTIONS
    : [status, ...STATUS_OPTIONS];

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        className={`
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          ${
            isDark
              ? "bg-slate-950/80"
              : "bg-slate-900/35"
          }
        `}
      >
        <div
          className={`
            flex
            items-center
            gap-3
            rounded-xl
            border
            px-5
            py-4
            shadow-xl
            ${
              isDark
                ? "border-slate-700 bg-[#111a2e] text-slate-100"
                : "border-slate-200 bg-white text-slate-700"
            }
          `}
        >
          <Loader2
            className="h-5 w-5 animate-spin text-blue-500"
          />

          <span className="text-sm font-medium">
            Loading audit...
          </span>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR / AUDIT NOT FOUND
  // ====================================================

  if (!audit) {
    return (
      <div
        className={`
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          px-4
          ${
            isDark
              ? "bg-slate-950/80"
              : "bg-slate-900/35"
          }
        `}
      >
        <div
          className={`
            w-full
            max-w-md
            rounded-2xl
            border
            p-6
            shadow-2xl
            ${
              isDark
                ? "border-slate-700 bg-[#111a2e]"
                : "border-slate-200 bg-white"
            }
          `}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2
              className={`
                text-lg
                font-semibold
                ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }
              `}
            >
              Edit Audit
            </h2>

            <button
              type="button"
              onClick={handleClose}
              className={`
                rounded-lg
                p-2
                transition
                ${
                  isDark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p
            className={`
              text-sm
              ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }
            `}
          >
            {error || "Audit could not be found."}
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="
              mt-5
              h-9
              rounded-lg
              bg-blue-600
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Back to Audits
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        px-3
        py-3
      "
    >
      {/* ==================================================
          BACKDROP
      ================================================== */}

      <div
        className={`
          absolute
          inset-0
          backdrop-blur-[3px]
          ${
            isDark
              ? "bg-slate-950/70"
              : "bg-slate-900/40"
          }
        `}
        onClick={handleClose}
      />

      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className={`
          relative
          z-10
          flex
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          shadow-2xl
          ${
            isDark
              ? "border-slate-700 bg-[#111a2e]"
              : "border-slate-200 bg-white"
          }
        `}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className={`
            flex
            shrink-0
            items-center
            justify-between
            border-b
            px-5
            py-3
            ${
              isDark
                ? "border-slate-700/80"
                : "border-slate-200"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}

            <div
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                ${
                  isDark
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }
              `}
            >
              <CircleDot className="h-4.5 w-4.5" />
            </div>

            {/* Title */}

            <div>
              <h1
                className={`
                  text-lg
                  font-semibold
                  leading-tight
                  ${
                    isDark
                      ? "text-white"
                      : "text-slate-900"
                  }
                `}
              >
                Edit Audit
              </h1>

              <p
                className={`
                  mt-0.5
                  text-xs
                  ${
                    isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }
                `}
              >
                Update audit information and details
              </p>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              transition
              ${
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }
              ${
                saving
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          {/* ==================================================
              BODY
          ================================================== */}

          <div className="px-5 py-3">
            {/* ==============================================
                ERROR
            ============================================== */}

            {error && (
              <div
                className={`
                  mb-2
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-xs
                  ${
                    isDark
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-red-200 bg-red-50 text-red-600"
                  }
                `}
              >
                {error}
              </div>
            )}

            {/* ==============================================
                TITLE
            ============================================== */}

            <div className="mb-2">
              <label
                htmlFor="title"
                className={`
                  mb-1
                  block
                  text-xs
                  font-medium
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }
                `}
              >
                Audit Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter audit title"
                className={inputClass(isDark)}
                disabled={saving}
              />
            </div>

            {/* ==============================================
                DESCRIPTION
            ============================================== */}

            <div className="mb-2">
              <label
                htmlFor="description"
                className={`
                  mb-1
                  block
                  text-xs
                  font-medium
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }
                `}
              >
                Description
              </label>

              <textarea
                id="description"
                rows={2}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter audit description"
                className={textareaClass(isDark)}
                disabled={saving}
              />
            </div>

            {/* ==============================================
                DATE ROW
            ============================================== */}

            <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* Start Date */}

              <div>
                <label
                  htmlFor="startDate"
                  className={`
                    mb-1
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-medium
                    ${
                      isDark
                        ? "text-slate-300"
                        : "text-slate-700"
                    }
                  `}
                >
                  <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                  Start Date
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  className={inputClass(isDark)}
                  disabled={saving}
                />
              </div>

              {/* End Date */}

              <div>
                <label
                  htmlFor="endDate"
                  className={`
                    mb-1
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-medium
                    ${
                      isDark
                        ? "text-slate-300"
                        : "text-slate-700"
                    }
                  `}
                >
                  <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                  End Date
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  className={inputClass(isDark)}
                  disabled={saving}
                />
              </div>
            </div>

            {/* ==============================================
                STATUS
            ============================================== */}

            <div className="mb-2">
              <label
                htmlFor="status"
                className={`
                  mb-1
                  block
                  text-xs
                  font-medium
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }
                `}
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className={inputClass(isDark)}
                disabled={saving}
              >
                {statusOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* ==============================================
                AUDITOR
            ============================================== */}

            <div>
              <label
                className={`
                  mb-1
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }
                `}
              >
                <UserRound className="h-3.5 w-3.5 text-blue-500" />
                Auditor
              </label>

              {audit.auditor ? (
                <div
                  className={`
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    border
                    px-3
                    py-1.5
                    ${
                      isDark
                        ? "border-slate-700 bg-[#182337]"
                        : "border-slate-200 bg-slate-50"
                    }
                  `}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {/* Avatar */}

                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          isDark
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-blue-100 text-blue-600"
                        }
                      `}
                    >
                      {audit.auditor.name
                        ?.charAt(0)
                        .toUpperCase() || "A"}
                    </div>

                    {/* Auditor Info */}

                    <div className="min-w-0">
                      <p
                        className={`
                          truncate
                          text-sm
                          font-medium
                          ${
                            isDark
                              ? "text-slate-100"
                              : "text-slate-800"
                          }
                        `}
                      >
                        {audit.auditor.name}
                      </p>

                      <p
                        className={`
                          truncate
                          text-xs
                          ${
                            isDark
                              ? "text-slate-500"
                              : "text-slate-500"
                          }
                        `}
                      >
                        {audit.auditor.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}

                  {audit.auditor.role?.name && (
                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2
                        py-0.5
                        text-[11px]
                        font-medium
                        ${
                          isDark
                            ? "bg-slate-700 text-slate-300"
                            : "bg-white text-slate-600 shadow-sm"
                        }
                      `}
                    >
                      {audit.auditor.role.name}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className={`
                    rounded-lg
                    border
                    border-dashed
                    px-3
                    py-2
                    text-xs
                    ${
                      isDark
                        ? "border-slate-700 bg-[#182337] text-slate-500"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }
                  `}
                >
                  No auditor assigned
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className={`
              flex
              shrink-0
              items-center
              justify-end
              gap-2
              border-t
              px-5
              py-2.5
              ${
                isDark
                  ? "border-slate-700/80 bg-[#0f182b]/50"
                  : "border-slate-200 bg-slate-50/70"
              }
            `}
          >
            {/* Cancel */}

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className={`
                flex
                h-9
                items-center
                justify-center
                rounded-lg
                border
                px-4
                text-xs
                font-medium
                transition
                ${
                  isDark
                    ? "border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }
                ${
                  saving
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              `}
            >
              Cancel
            </button>

            {/* Save */}

            <button
              type="submit"
              disabled={saving}
              className="
                flex
                h-9
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}