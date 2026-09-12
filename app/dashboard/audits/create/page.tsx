"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createAudit,
  AuditRequest,
} from "../../../lib/api/auditApi";

import {
  getAllUsers,
  User,
} from "../../../lib/api/userApi";

export default function CreateAuditPage() {
  const router = useRouter();

  // =========================
  // Form State
  // =========================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    auditType: "",
    auditor: "",
    startDate: "",
    dueDate: "",
    priority: "",
    complianceArea: "",
    status: "Pending",
  });

  // =========================
  // Auditor State
  // =========================

  const [auditors, setAuditors] = useState<User[]>([]);

  const [loadingAuditors, setLoadingAuditors] = useState(true);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // Load Auditors From DB
  // =========================

  useEffect(() => {
    const fetchAuditors = async () => {
      try {
        setLoadingAuditors(true);
        setError("");

        const users = await getAllUsers();

        // Only AUDITOR users
        const auditorUsers = users.filter(
          (user) =>
            user.role?.name?.toUpperCase() === "AUDITOR"
        );

        setAuditors(auditorUsers);
      } catch (error) {
        console.error("Failed to load auditors:", error);

        setError(
          "Unable to load auditors. Please try again."
        );
      } finally {
        setLoadingAuditors(false);
      }
    };

    fetchAuditors();
  }, []);

  // =========================
  // Handle Input Change
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // Submit Form
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // =========================
    // Validation
    // =========================

    if (!formData.title.trim()) {
      setError("Audit title is required.");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (
      new Date(formData.dueDate) <
      new Date(formData.startDate)
    ) {
      setError(
        "Due date cannot be before start date."
      );
      return;
    }

    if (!formData.auditor) {
      setError("Please select an auditor.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // Backend Audit Request
      // =========================

      const auditData: AuditRequest = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        startDate: formData.startDate,

        endDate: formData.dueDate,

        status: formData.status,

        // IMPORTANT:
        // Actual auditor ID from database
        auditor: {
          id: Number(formData.auditor),
        },
      };

      console.log(
        "Creating audit with data:",
        auditData
      );

      await createAudit(auditData);

      // =========================
      // Redirect
      // =========================

      router.push("/dashboard/audits");
    } catch (error) {
      console.error(
        "Failed to create audit:",
        error
      );

      setError(
        "Failed to create audit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Audit
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new audit and assign an auditor.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >

        {/* =========================
            Basic Information
        ========================= */}

        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the basic details of the audit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Title */}

          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Audit Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter audit title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter audit description"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Audit Type */}

          <div>
            <label
              htmlFor="auditType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Audit Type
            </label>

            <select
              id="auditType"
              name="auditType"
              value={formData.auditType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            >
              <option value="">
                Select audit type
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

              <option value="IT">
                IT
              </option>
            </select>
          </div>

          {/* =========================
              DYNAMIC AUDITOR
          ========================= */}

          <div>
            <label
              htmlFor="auditor"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Auditor
            </label>

            <select
              id="auditor"
              name="auditor"
              value={formData.auditor}
              onChange={handleChange}
              disabled={loadingAuditors}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)] disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {loadingAuditors
                  ? "Loading auditors..."
                  : "Select auditor"}
              </option>

              {auditors.map((auditor) => (
                <option
                  key={auditor.id}
                  value={auditor.id}
                >
                  {auditor.name} ({auditor.email})
                </option>
              ))}
            </select>

            {!loadingAuditors &&
              auditors.length === 0 && (
                <p className="mt-1 text-xs text-red-500">
                  No AUDITOR users found.
                </p>
              )}
          </div>

          {/* Start Date */}

          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Due Date */}

          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            />
          </div>

          {/* Priority */}

          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            >
              <option value="">
                Select priority
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

          {/* Compliance Area */}

          <div>
            <label
              htmlFor="complianceArea"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Compliance Area
            </label>

            <select
              id="complianceArea"
              name="complianceArea"
              value={formData.complianceArea}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
            >
              <option value="">
                Select compliance area
              </option>

              <option value="HR">
                HR
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="IT Security">
                IT Security
              </option>

              <option value="Operations">
                Operations
              </option>

              <option value="Legal">
                Legal
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
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.08)]"
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

        {/* =========================
            Buttons
        ========================= */}

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/audits")
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || loadingAuditors}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : "Create Audit"}
          </button>

        </div>

      </form>
    </div>
  );
}