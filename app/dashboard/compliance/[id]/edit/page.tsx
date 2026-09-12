"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getComplianceById,
  updateCompliance,
  type Compliance,
  type ComplianceRequest,
} from "@/app/lib/api/complianceApi";

import {
  getAllAudits,
  type Audit,
} from "@/app/lib/api/auditApi";

export default function EditCompliancePage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  // ========================================
  // FORM STATE
  // ========================================

  const [requirement, setRequirement] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [auditId, setAuditId] = useState("");

  // ========================================
  // DATA STATE
  // ========================================

  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ========================================
  // FETCH DATA
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      if (!id || Number.isNaN(id)) {
        setError("Invalid compliance ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [complianceData, auditsData] =
          await Promise.all([
            getComplianceById(id),
            getAllAudits(),
          ]);

        setRequirement(
          complianceData.requirement || ""
        );

        setDescription(
          complianceData.description || ""
        );

        setStatus(complianceData.status || "");

        setAuditId(
          complianceData.audit?.id
            ? String(complianceData.audit.id)
            : ""
        );

        setAudits(auditsData);
      } catch (error) {
        console.error(
          "Failed to load compliance:",
          error
        );

        setError(
          "Unable to load compliance details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ========================================
  // SUBMIT UPDATE
  // ========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // ========================================
    // VALIDATION
    // ========================================

    if (!requirement.trim()) {
      setError("Requirement is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!status) {
      setError("Please select a status.");
      return;
    }

    if (!auditId) {
      setError("Please select an audit.");
      return;
    }

    try {
      setSaving(true);

      const complianceData: ComplianceRequest = {
        requirement: requirement.trim(),
        description: description.trim(),
        status,
        audit: {
          id: Number(auditId),
        },
      };

      await updateCompliance(
        id,
        complianceData
      );

      // Go back to compliance list

      router.push("/dashboard/compliance");
      router.refresh();

    } catch (error) {
      console.error(
        "Failed to update compliance:",
        error
      );

      setError(
        "Failed to update compliance record. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // CANCEL
  // ========================================

  const handleCancel = () => {
    router.push(
      `/dashboard/compliance/${id}`
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="text-sm text-gray-500">
                Loading compliance...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error && !requirement) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Unable to Load Compliance
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={handleCancel}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Compliance
          </button>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Compliance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update compliance requirement details.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <form onSubmit={handleSubmit}>

            {/* Form Header */}

            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Compliance Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compliance ID: CMP-
                {String(id).padStart(3, "0")}
              </p>
            </div>

            {/* Form Body */}

            <div className="space-y-6 px-6 py-6">

              {/* Requirement */}

              <div>
                <label
                  htmlFor="requirement"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Requirement
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="requirement"
                  type="text"
                  value={requirement}
                  onChange={(event) =>
                    setRequirement(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status + Audit */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Status */}

                <div>
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
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select status
                    </option>

                    <option value="Compliant">
                      Compliant
                    </option>

                    <option value="Due Soon">
                      Due Soon
                    </option>

                    <option value="Overdue">
                      Overdue
                    </option>
                  </select>
                </div>

                {/* Audit */}

                <div>
                  <label
                    htmlFor="audit"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Audit
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="audit"
                    value={auditId}
                    onChange={(event) =>
                      setAuditId(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select audit
                    </option>

                    {audits.map((audit) => (
                      <option
                        key={audit.id}
                        value={audit.id}
                      >
                        {audit.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}