"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createAudit,
  type AuditRequest,
} from "@/app/lib/api/auditApi";

export default function CreateAuditPage() {
  const router = useRouter();

  // ========================================
  // FORM STATE
  // ========================================

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

  // ========================================
  // UI STATES
  // ========================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE FORM SUBMIT
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
      setError("Please enter audit title.");
      return;
    }

    if (!formData.auditType) {
      setError("Please select audit type.");
      return;
    }

    if (!formData.auditor) {
      setError("Please select auditor.");
      return;
    }

    if (!formData.startDate) {
      setError("Please select start date.");
      return;
    }

    if (!formData.dueDate) {
      setError("Please select due date.");
      return;
    }

    if (formData.dueDate < formData.startDate) {
      setError("Due date cannot be before start date.");
      return;
    }

    if (!formData.priority) {
      setError("Please select priority.");
      return;
    }

    if (!formData.complianceArea) {
      setError("Please select compliance area.");
      return;
    }

    if (!formData.status) {
      setError("Please select status.");
      return;
    }

    // ========================================
    // API CALL
    // ========================================

    try {
      setLoading(true);

      // Backend-supported payload
      const auditData: AuditRequest = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        startDate: formData.startDate,

        endDate: formData.dueDate,

        status: formData.status,

        // Currently no auditor ID mapping
        // so sending null
        auditor: null,
      };

      console.log("Creating audit:", auditData);

      const response = await createAudit(auditData);

      console.log(
        "Audit created successfully:",
        response,
      );

      alert("Audit created successfully!");

      router.push("/dashboard/audits");

    } catch (error: any) {
      console.error("Create audit error:", error);

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again.",
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to create an audit.",
        );
      } else if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            "Invalid audit data.",
        );
      } else if (error.response?.data?.message) {
        setError(
          error.response.data.message,
        );
      } else {
        setError(
          "Unable to create audit. Please check your backend connection.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RESET FORM
  // ========================================

  const handleReset = () => {
    setFormData({
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

    setError("");
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      <div className="mx-auto max-w-5xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/audits")
            }
            className="mb-4 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            ← Back to Audits
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Audit
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new compliance audit by providing
            the required information below.
          </p>

        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex gap-3">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                !
              </div>

              <div>
                <p className="font-semibold text-red-700">
                  Unable to create audit
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

            </div>

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

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-lg font-bold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the basic details of the audit.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* TITLE */}

              <div className="md:col-span-2">

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
                  placeholder="Enter audit title"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the purpose and scope of this audit..."
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

              {/* AUDIT TYPE */}

              <div>

                <label
                  htmlFor="auditType"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Audit Type
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="auditType"
                  name="auditType"
                  value={formData.auditType}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">
                    Select audit type
                  </option>

                  <option value="Internal">
                    Internal Audit
                  </option>

                  <option value="External">
                    External Audit
                  </option>

                  <option value="Compliance">
                    Compliance Audit
                  </option>

                  <option value="Financial">
                    Financial Audit
                  </option>

                </select>

              </div>

              {/* AUDITOR */}

              <div>

                <label
                  htmlFor="auditor"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Auditor
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="auditor"
                  name="auditor"
                  value={formData.auditor}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">
                    Select auditor
                  </option>

                  <option value="1">
                    Rahul Sharma
                  </option>

                  <option value="2">
                    Amit Kumar
                  </option>

                  <option value="3">
                    Priya Singh
                  </option>

                </select>

              </div>

            </div>
          </div>

          {/* ========================================
              SCHEDULE
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-lg font-bold text-gray-900">
                Audit Schedule
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Define the audit start and end dates.
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
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

              {/* DUE DATE */}

              <div>

                <label
                  htmlFor="dueDate"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Due Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

            </div>
          </div>

          {/* ========================================
              AUDIT SETTINGS
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-lg font-bold text-gray-900">
                Audit Settings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure priority, compliance area and
                current status.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

              {/* PRIORITY */}

              <div>

                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Priority
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
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

              {/* COMPLIANCE AREA */}

              <div>

                <label
                  htmlFor="complianceArea"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Compliance Area
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="complianceArea"
                  name="complianceArea"
                  value={formData.complianceArea}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">
                    Select compliance area
                  </option>

                  <option value="HR">
                    Human Resources
                  </option>

                  <option value="Labour">
                    Labour Compliance
                  </option>

                  <option value="Finance">
                    Finance
                  </option>

                  <option value="Safety">
                    Safety
                  </option>

                </select>

              </div>

              {/* STATUS */}

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
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
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

          {/* ========================================
              ACTION BUTTONS
          ======================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/audits")
              }
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Audit..."
                : "Create Audit"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

