"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getFindingById,
  updateFinding,
  type Finding,
  type FindingRequest,
} from "@/app/lib/api/findingApi";

export default function EditFindingPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [finding, setFinding] = useState<Finding | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Fetch Finding
  // =========================

  useEffect(() => {
    const fetchFinding = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getFindingById(id);

        setFinding(data);

        setTitle(data.title || "");
        setDescription(data.description || "");
        setSeverity(data.severity || "");
        setStatus(data.status || "");
      } catch (err: any) {
        console.error("Error loading finding:", err);

        const message =
          err?.response?.data?.message ||
          err?.response?.data ||
          "Unable to load finding.";

        setError(String(message));
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(id)) {
      fetchFinding();
    }
  }, [id]);

  // =========================
  // Submit Update
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // =========================
    // Validation
    // =========================

    if (!title.trim()) {
      setError("Finding title is required.");
      return;
    }

    if (!severity) {
      setError("Please select severity.");
      return;
    }

    if (!status) {
      setError("Please select status.");
      return;
    }

    if (!finding) {
      setError("Finding data is missing.");
      return;
    }

    try {
      setSubmitting(true);

      // =========================
      // Update Data
      // =========================

      const findingData: FindingRequest = {
        title: title.trim(),
        description: description.trim(),
        severity,
        status,

        // Keep existing audit relationship
        audit: finding.audit
          ? {
              id: finding.audit.id,
            }
          : null,
      };

      console.log(
        "Updating finding:",
        id,
        findingData
      );

      await updateFinding(id, findingData);

      // =========================
      // Redirect
      // =========================

      router.push(`/dashboard/finding/${id}`);
      router.refresh();

    } catch (err: any) {
      console.error("Error updating finding:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Unable to update finding.";

      setError(String(message));
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading finding...
        </div>
      </div>
    );
  }

  // =========================
  // Finding Not Found
  // =========================

  if (!finding) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <h2 className="text-lg font-semibold text-red-700">
            Finding Not Found
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error ||
              "The requested finding does not exist."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/finding")
            }
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to Findings
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // Page
  // =========================

  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Finding
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update finding information.
        </p>
      </div>

      {/* Form Container */}

      <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Finding ID */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Finding ID
            </label>

            <input
              type="text"
              value={`FND-${String(finding.id).padStart(3, "0")}`}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
            />
          </div>

          {/* Title */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Finding Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter finding title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the finding"
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Severity + Status */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Severity */}

            <div>
              <label
                htmlFor="severity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Severity
              </label>

              <select
                id="severity"
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                <option value="">
                  Select severity
                </option>

                <option value="Critical">
                  Critical
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

            {/* Status */}

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                <option value="">
                  Select status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>
            </div>

          </div>

          {/* Audit - Read Only */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Audit
            </label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
              {finding.audit?.title ||
                (finding.audit
                  ? `AUD-${String(
                      finding.audit.id
                    ).padStart(3, "0")}`
                  : "No audit assigned")}
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Audit cannot be changed while editing a
              finding.
            </p>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/finding/${id}`
                )
              }
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Updating..."
                : "Update Finding"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}