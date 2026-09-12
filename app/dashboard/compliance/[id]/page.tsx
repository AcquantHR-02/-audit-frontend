"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getComplianceById,
  type Compliance,
} from "@/app/lib/api/complianceApi";

export default function ComplianceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [compliance, setCompliance] =
    useState<Compliance | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // GET ID FROM URL
  // ========================================

  const id = Number(params.id);

  // ========================================
  // FETCH COMPLIANCE
  // ========================================

  useEffect(() => {
    const fetchCompliance = async () => {
      if (!id || Number.isNaN(id)) {
        setError("Invalid compliance ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getComplianceById(id);

        setCompliance(data);
      } catch (error) {
        console.error(
          "Failed to fetch compliance:",
          error
        );

        setError(
          "Compliance record not found or could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [id]);

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "compliant":
        return "bg-green-100 text-green-700 border-green-200";

      case "due soon":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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

  if (error || !compliance) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
              !
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Compliance Not Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "The requested compliance record does not exist."}
            </p>

            <Link
              href="/dashboard/compliance"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Compliance
            </Link>
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
      <div className="mx-auto max-w-4xl space-y-6">

        {/* ========================================
            HEADER
        ======================================== */}

        <div>
          <Link
            href="/dashboard/compliance"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Compliance
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Compliance Details
                </h1>

                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  CMP-{String(compliance.id).padStart(3, "0")}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                View compliance requirement details
              </p>
            </div>

            <Link
              href={`/dashboard/compliance/${compliance.id}/edit`}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Edit Compliance
            </Link>
          </div>
        </div>

        {/* ========================================
            DETAILS CARD
        ======================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Requirement */}

          <div className="border-b border-gray-200 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Requirement
            </p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              {compliance.requirement || "-"}
            </h2>
          </div>

          {/* Details */}

          <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">

            {/* ID */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Compliance ID
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                CMP-{String(compliance.id).padStart(3, "0")}
              </p>
            </div>

            {/* Status */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </p>

              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    compliance.status
                  )}`}
                >
                  {compliance.status || "Unknown"}
                </span>
              </div>
            </div>

            {/* Audit */}

            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Audit
              </p>

              {compliance.audit ? (
                <Link
                  href={`/dashboard/audits/${compliance.audit.id}`}
                  className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {compliance.audit.title ||
                    `Audit #${compliance.audit.id}`}
                </Link>
              ) : (
                <p className="mt-2 text-sm text-gray-400">
                  No audit assigned
                </p>
              )}
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Description
              </p>

              <div className="mt-2 rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {compliance.description || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}