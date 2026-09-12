"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createFinding,
  type FindingRequest,
} from "@/app/lib/api/findingApi";

import {
  getAllAudits,
  type Audit,
} from "@/app/lib/api/auditApi";

export default function CreateFindingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [auditId, setAuditId] = useState("");

  const [audits, setAudits] = useState<Audit[]>([]);

  const [loadingAudits, setLoadingAudits] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoadingAudits(true);

        const data = await getAllAudits();
        setAudits(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load audits.");
      } finally {
        setLoadingAudits(false);
      }
    };

    fetchAudits();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

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

    if (!auditId) {
      setError("Please select an audit.");
      return;
    }

    try {
      setSubmitting(true);

      const findingData: FindingRequest = {
        title: title.trim(),
        description: description.trim(),
        severity,
        status,
        audit: {
          id: Number(auditId),
        },
      };

      await createFinding(findingData);

      router.push("/dashboard/finding");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Unable to create finding.";

      setError(String(message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Finding
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new audit finding.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Finding Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter finding title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the finding"
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Severity + Status */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Severity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Severity
              </label>

              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                <option value="">Select severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
              >
                <option value="">Select status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Audit */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Audit
            </label>

            <select
              value={auditId}
              onChange={(e) => setAuditId(e.target.value)}
              disabled={loadingAudits}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)] disabled:bg-gray-100"
            >
              <option value="">
                {loadingAudits
                  ? "Loading audits..."
                  : "Select audit"}
              </option>

              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  {audit.title} — AUD-{String(audit.id).padStart(3, "0")}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

            <button
              type="button"
              onClick={() => router.push("/dashboard/finding")}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Finding"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}