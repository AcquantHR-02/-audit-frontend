"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getFindingById,
  Finding,
} from "../../../lib/api/findingApi";

function getSeverityClass(severity: string) {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200";

    case "High":
      return "bg-orange-100 text-orange-700 border-orange-200";

    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "Low":
      return "bg-green-100 text-green-700 border-green-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-700 border-red-200";

    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "Resolved":
      return "bg-green-100 text-green-700 border-green-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function FindingDetails() {
  const params = useParams();

  const id = Number(params.id);

  const [finding, setFinding] = useState<Finding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinding = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id || Number.isNaN(id)) {
          setError("Invalid finding ID.");
          return;
        }

        const data = await getFindingById(id);

        setFinding(data);
      } catch (err: any) {
        console.error("Error fetching finding:", err);

        const message =
          err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to load finding details.";

        setError(String(message));
      } finally {
        setLoading(false);
      }
    };

    fetchFinding();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading finding details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-bold text-red-700">
            Unable to load finding
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <Link
            href="/dashboard/finding"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            ← Back to Findings
          </Link>
        </div>
      </div>
    );
  }

  if (!finding) {
    return (
      <div className="min-h-screen bg-slate-50 p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-bold text-slate-800">
            Finding not found
          </h2>

          <Link
            href="/dashboard/finding"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            ← Back to Findings
          </Link>
        </div>
      </div>
    );
  }

  const findingDisplayId = `FND-${String(finding.id).padStart(
    3,
    "0"
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">

      {/* Breadcrumb */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-slate-500 transition hover:text-blue-600"
        >
          Dashboard
        </Link>

        <span className="text-slate-400">/</span>

        <Link
          href="/dashboard/finding"
          className="text-slate-500 transition hover:text-blue-600"
        >
          Findings
        </Link>

        <span className="text-slate-400">/</span>

        <span className="font-medium text-slate-700">
          {findingDisplayId}
        </span>
      </div>

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">

          <div className="mb-2 flex flex-wrap items-center gap-2">

            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              {findingDisplayId}
            </span>

            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${getSeverityClass(
                finding.severity
              )}`}
            >
              {finding.severity}
            </span>

            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                finding.status
              )}`}
            >
              {finding.status}
            </span>

          </div>

          <h1 className="break-words text-xl font-bold text-slate-900 md:text-2xl">
            {finding.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Finding details and audit information
          </p>

        </div>

        <div className="flex shrink-0 gap-2">

          <Link
            href={`/dashboard/finding/${finding.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Edit Finding
          </Link>

          <Link
            href="/dashboard/finding"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back
          </Link>

        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Left */}
        <div className="space-y-5 lg:col-span-2">

          {/* Finding Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Finding Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Finding ID
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {findingDisplayId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Finding Title
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {finding.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Severity
                </p>

                <span
                  className={`mt-1 inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${getSeverityClass(
                    finding.severity
                  )}`}
                >
                  {finding.severity}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                    finding.status
                  )}`}
                >
                  {finding.status}
                </span>
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Description
              </h2>
            </div>

            <div className="p-5">

              {finding.description ? (
                <p className="break-words text-sm leading-6 text-slate-600">
                  {finding.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">
                  No description provided.
                </p>
              )}

            </div>
          </div>

        </div>

        {/* Right */}
        <div className="space-y-5">

          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Finding Status
              </h2>
            </div>

            <div className="space-y-4 p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-md border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                    finding.status
                  )}`}
                >
                  {finding.status}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Severity
                </p>

                <span
                  className={`mt-2 inline-flex rounded-md border px-3 py-1.5 text-xs font-semibold ${getSeverityClass(
                    finding.severity
                  )}`}
                >
                  {finding.severity}
                </span>
              </div>

            </div>
          </div>

          {/* Audit Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Audit Information
              </h2>
            </div>

            <div className="space-y-4 p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Audit Name
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {finding.audit?.title ||
                    `Audit #${finding.audit?.id ?? "N/A"}`}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Audit ID
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {finding.audit?.id ?? "N/A"}
                </p>
              </div>

              {finding.audit?.id && (
                <Link
                  href={`/dashboard/audits/${finding.audit.id}`}
                  className="block rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Audit
                </Link>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Audit Management System • Finding Details
      </div>

    </div>
  );
}