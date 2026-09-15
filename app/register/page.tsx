"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "../lib/api/authapi";

export default function RegisterPage() {
  const router = useRouter();

  // ==============================
  // FORM DATA
  // ==============================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // ==============================
  // STATE
  // ==============================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ==============================
  // HANDLE REGISTER
  // ==============================

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // ==============================
    // VALIDATION
    // ==============================

    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    // ==============================
    // API CALL
    // ==============================

    try {
      setLoading(true);

      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      console.log("Registration response:", response);

      alert("Registration successful!");

      router.replace("/login");
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response?.status === 409) {
        setError("Email already exists");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Registration failed. Please try again."
        );
      } else {
        setError(
          "Unable to register. Please check your backend connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-5">
      {/* Background Effects */}

      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Main Container */}

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">

        {/* ===================================== */}
        {/* LEFT BRANDING SECTION */}
        {/* ===================================== */}

        <section className="hidden flex-col justify-center bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 p-8 lg:flex">

          {/* Logo */}

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg">
              A
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                Audit Management
              </h1>

              <p className="text-xs text-slate-400">
                Enterprise System
              </p>
            </div>
          </div>

          {/* Heading */}

          <h2 className="text-3xl font-bold leading-tight text-white">
            Build your audit
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              management workspace.
            </span>
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Create your account and start managing audits,
            compliance requirements and findings from one
            centralized platform.
          </p>

          {/* Benefits */}

          <div className="mt-6 space-y-3">

            <RegisterFeature
              icon="✓"
              title="Centralized Audit Management"
              description="Manage your audits from one place."
            />

            <RegisterFeature
              icon="✓"
              title="Compliance Tracking"
              description="Monitor compliance requirements easily."
            />

            <RegisterFeature
              icon="✓"
              title="Finding Management"
              description="Track and resolve audit findings."
            />

          </div>

          {/* Bottom Text */}

          <div className="mt-7 border-t border-white/10 pt-4">
            <p className="text-xs text-slate-500">
              Secure enterprise-ready audit management
            </p>
          </div>
        </section>

        {/* ===================================== */}
        {/* REGISTER FORM */}
        {/* ===================================== */}

        <section className="bg-slate-900/95 p-6 sm:p-7">

          {/* Mobile Logo */}

          <div className="mb-5 flex items-center gap-3 lg:hidden">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
              A
            </div>

            <div>
              <h1 className="font-bold text-white">
                Audit Management
              </h1>

              <p className="text-xs text-slate-400">
                Enterprise System
              </p>
            </div>

          </div>

          {/* Heading */}

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">
              Create your account
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Register to access the audit management system
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5">
              <p className="text-sm font-medium text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* ===================================== */}
          {/* FORM */}
          {/* ===================================== */}

          <form
            onSubmit={handleRegister}
            className="space-y-3.5"
          >

            {/* Full Name */}

            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Full Name
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  👤
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Email Address
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password + Confirm Password */}

            <div className="grid gap-3 sm:grid-cols-2">

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-1 text-[10px] text-slate-600">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 hover:text-white"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

            </div>

            {/* Role */}

            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Role
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ◈
                </span>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-8 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option
                    value=""
                    className="bg-slate-900"
                  >
                    Select your role
                  </option>


                  <option
                    value="AUDITOR"
                    className="bg-slate-900"
                  >
                    Auditor
                  </option>

                  <option
                    value="COMPLIANCE_OFFICER"
                    className="bg-slate-900"
                  >
                    Compliance Officer
                  </option>
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  ▼
                </span>

              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                <p className="text-xs font-medium text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login */}

            <p className="pt-1 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>

          </form>

          {/* Security */}

          <div className="mt-4 flex items-center justify-center gap-2 border-t border-white/10 pt-3 text-[10px] text-slate-600">
            <span>🔐</span>
            Secure registration powered by Audit Management System
          </div>

          {/* Home */}

          <div className="mt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-600 transition hover:text-slate-400"
            >
              ← Back to homepage
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
}

// =====================================
// SMALL FEATURE COMPONENT
// =====================================

function RegisterFeature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-200">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}