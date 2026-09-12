"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getAuditById,
  updateAudit,
  type Audit,
  type AuditRequest,
} from "@/app/lib/api/auditApi";

export default function EditAuditPage() {
  const params = useParams();
  const router = useRouter();

  // ========================================
  // AUDIT STATE
  // ========================================

  const [audit, setAudit] =
    useState<Audit | null>(null);

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  // ========================================
  // UI STATES
  // ========================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // ========================================
  // GET AUDIT
  // ========================================

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(params.id);

        console.log(
          "Edit page audit ID:",
          id,
        );

        if (Number.isNaN(id)) {
          setError("Invalid audit ID.");
          return;
        }

        const data =
          await getAuditById(id);

        console.log(
          "Audit received:",
          data,
        );

        setAudit(data);

        // ====================================
        // PUT EXISTING DATA INTO FORM
        // ====================================

        setFormData({
          title: data.title || "",
          description:
            data.description || "",
          startDate:
            data.startDate || "",
          endDate:
            data.endDate || "",
          status:
            data.status || "Pending",
        });
      } catch (error: any) {
        console.error(
          "Error fetching audit:",
          error,
        );

        if (
          error.response?.status === 401
        ) {
          setError(
            "Unauthorized. Please login again.",
          );
        } else if (
          error.response?.status === 403
        ) {
          setError(
            "You do not have permission to view this audit.",
          );
        } else if (
          error.response?.status === 404
        ) {
          setError(
            "Audit not found.",
          );
        } else if (
          error.response?.data?.message
        ) {
          setError(
            error.response.data.message,
          );
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

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >,
  ) => {
    const { name, value } =
      e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE UPDATE
  // ========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.title.trim()) {
      setError(
        "Please enter audit title.",
      );
      return;
    }

    if (!formData.startDate) {
      setError(
        "Please select start date.",
      );
      return;
    }

    if (!formData.endDate) {
      setError(
        "Please select end date.",
      );
      return;
    }

    if (
      formData.endDate <
      formData.startDate
    ) {
      setError(
        "End date cannot be before start date.",
      );
      return;
    }

    if (!formData.status) {
      setError(
        "Please select status.",
      );
      return;
    }

    // ========================================
    // UPDATE API
    // ========================================

    try {
      setSaving(true);

      const id = Number(params.id);

      // Backend payload
      const auditData: AuditRequest = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        status:
          formData.status,

        // Existing auditor maintain kar rahe hain
        auditor: audit?.auditor
          ? {
              id: audit.auditor.id,
            }
          : null,
      };

      console.log(
        "Updating audit:",
        id,
        auditData,
      );

      const updatedAudit =
        await updateAudit(
          id,
          auditData,
        );

      console.log(
        "Audit updated successfully:",
        updatedAudit,
      );

      alert(
        "Audit updated successfully!",
      );

      // View page par redirect
      router.push(
        `/dashboard/audits/${id}`,
      );
    } catch (error: any) {
      console.error(
        "Update audit error:",
        error,
      );

      if (
        error.response?.status === 401
      ) {
        setError(
          "Unauthorized. Please login again.",
        );
      } else if (
        error.response?.status === 403
      ) {
        setError(
          "You do not have permission to update this audit.",
        );
      } else if (
        error.response?.status === 404
      ) {
        setError(
          "Audit not found.",
        );
      } else if (
        error.response?.status === 400
      ) {
        setError(
          error.response?.data?.message ||
            "Invalid audit data.",
        );
      } else if (
        error.response?.data?.message
      ) {
        setError(
          error.response.data.message,
        );
      } else {
        setError(
          "Unable to update audit. Please check your backend connection.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING UI
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">

        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mt-5 h-9 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-6">

            <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />

            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />

          </div>

        </div>
      </div>
    );
  }

  // ========================================
  // ERROR UI
  // ========================================

  if (error && !audit) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">

        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">

          <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Unable to Load Audit
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/audits",
                )
              }
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ← Back to Audits
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      <div className="mx-auto max-w-4xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/audits/${params.id}`,
              )
            }
            className="text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            ← Back to Audit
          </button>

          <div className="mt-5">

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-bold tracking-wide text-gray-600">
                AUD-
                {String(params.id).padStart(
                  3,
                  "0",
                )}
              </span>

              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Editing Audit
              </span>

            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Edit Audit
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Update the audit information and save
              your changes.
            </p>

          </div>
        </div>

        {/* ========================================
            ERROR MESSAGE
        ======================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ========================================
            FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ========================================
              BASIC INFORMATION
          ======================================== */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-lg font-bold text-gray-900">
                Audit Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the basic information of this audit.
              </p>

            </div>

            <div className="space-y-6 p-6">

              {/* TITLE */}

              <div>

                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter audit description"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

            </div>
          </div>

          {/* ========================================
              SCHEDULE
          ======================================== */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-lg font-bold text-gray-900">
                Audit Schedule
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the audit start and end dates.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* START DATE */}

              <div>

                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  value={
                    formData.startDate
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

              {/* END DATE */}

              <div>

                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  value={
                    formData.endDate
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

            </div>
          </div>

          {/* ========================================
              STATUS
          ======================================== */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-lg font-bold text-gray-900">
                Audit Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Change the current status of the audit.
              </p>

            </div>

            <div className="p-6">

              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-gray-700"
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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-md"
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

          {/* ========================================
              AUDITOR INFORMATION
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-900">
              Assigned Auditor
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Existing auditor assignment will be preserved.
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-5">

              {audit?.auditor ? (

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                    {audit.auditor.name
                      ?.charAt(0)
                      .toUpperCase() || "A"}
                  </div>

                  <div>

                    <p className="font-bold text-gray-900">
                      {audit.auditor.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {audit.auditor.email ||
                        "-"}
                    </p>

                  </div>

                </div>

              ) : (

                <p className="text-sm text-gray-500">
                  No auditor assigned.
                </p>

              )}

            </div>
          </div>

          {/* ========================================
              ACTIONS
          ======================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/audits/${params.id}`,
                )
              }
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
