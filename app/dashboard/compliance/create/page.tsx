"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createCompliance,
  type ComplianceRequest,
} from "@/app/lib/api/complianceApi";

import {
  getAllAudits,
  type Audit,
} from "@/app/lib/api/auditApi";

export default function CreateCompliancePage() {
  const router = useRouter();

  // ========================================
  // FORM STATE
  // ========================================

  const [requirement, setRequirement] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [auditId, setAuditId] = useState("");

  // ========================================
  // AUDITS
  // ========================================

  const [audits, setAudits] = useState<Audit[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(true);

  // ========================================
  // UI STATE
  // ========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // FETCH AUDITS
  // ========================================

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoadingAudits(true);

        const data = await getAllAudits();

        setAudits(data);
      } catch (error) {
        console.error("Failed to fetch audits:", error);

        setError(
          "Unable to load audits. Please check whether the backend is running."
        );
      } finally {
        setLoadingAudits(false);
      }
    };

    fetchAudits();
  }, []);

  // ========================================
  // FORM SUBMIT
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
      setLoading(true);

      // ========================================
      // REQUEST BODY
      // ========================================

      const complianceData: ComplianceRequest = {
        requirement: requirement.trim(),
        description: description.trim(),
        status: status,
        audit: {
          id: Number(auditId),
        },
      };

      console.log(
        "Creating compliance:",
        complianceData
      );

      // ========================================
      // API CALL
      // ========================================

      await createCompliance(complianceData);

      // ========================================
      // SUCCESS
      // ========================================

      router.push("/dashboard/compliance");
      router.refresh();

    } catch (error) {
      console.error(
        "Failed to create compliance:",
        error
      );

      setError(
        "Failed to create compliance record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CANCEL
  // ========================================

  const handleCancel = () => {
    router.push("/dashboard/compliance");
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Compliance
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create Compliance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new compliance requirement to an audit.
          </p>
        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ========================================
            FORM CARD
        ======================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <form onSubmit={handleSubmit}>

            {/* ========================================
                FORM HEADER
            ======================================== */}

            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Compliance Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the details for the compliance requirement.
              </p>
            </div>

            {/* ========================================
                FORM BODY
            ======================================== */}

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
                    setRequirement(event.target.value)
                  }
                  placeholder="Enter compliance requirement"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1.5 text-xs text-gray-500">
                  Example: Employee Background Verification
                </p>
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
                    setDescription(event.target.value)
                  }
                  placeholder="Enter compliance requirement description"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1.5 text-xs text-gray-500">
                  Provide a clear description of the compliance requirement.
                </p>
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
                      setStatus(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                      setAuditId(event.target.value)
                    }
                    disabled={loadingAudits}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingAudits
                        ? "Loading audits..."
                        : "Select audit"}
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

                  {!loadingAudits &&
                    audits.length === 0 && (
                      <p className="mt-1.5 text-xs text-red-500">
                        No audits available. Create an audit first.
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* ========================================
                FORM FOOTER
            ======================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">

              {/* Cancel */}

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Create */}

              <button
                type="submit"
                disabled={loading || loadingAudits}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Compliance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}