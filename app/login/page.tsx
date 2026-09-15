"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { loginUser } from "../lib/api/authapi";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      console.log("Login response:", response);

      localStorage.setItem("token", response.token);
      localStorage.setItem("name", response.name);
      localStorage.setItem("email", response.email);
      localStorage.setItem("role", response.role);
      localStorage.setItem("isLoggedIn", "true");

      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-6">
      {/* Background Effects */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="hidden flex-col justify-center bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 p-8 lg:flex">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg">
              A
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">Audit Management</h1>
              <p className="text-xs text-slate-400">Enterprise System</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold leading-tight text-white">
            Manage your audits
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              smarter & faster.
            </span>
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Plan audits, track compliance, manage findings and monitor
            performance from one centralized platform.
          </p>

          {/* Small Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-bold text-white">24</p>
              <p className="text-[11px] text-slate-400">Audits</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-bold text-white">16</p>
              <p className="text-[11px] text-slate-400">Completed</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-bold text-white">5</p>
              <p className="text-[11px] text-slate-400">Findings</p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="bg-slate-900/90 p-6 sm:p-8">
          {/* Mobile Logo */}
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
              A
            </div>

            <div>
              <h1 className="font-bold text-white">Audit Management</h1>
              <p className="text-xs text-slate-400">Enterprise System</p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>

            <p className="mt-1 text-sm text-slate-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitHandle} className="mt-5 space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5"
                />
                Keep me signed in
              </label>

              <button
                type="button"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ?
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in...
                </span>
              : "Sign in"}
            </button>

            {/* Register */}
            <p className="pt-1 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Create account
              </Link>
            </p>
          </form>

          {/* Security */}
          <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-[11px] text-slate-500">
            <span>🔐</span>
            Secure authentication powered by JWT
          </div>

          {/* Home */}
          <div className="mt-3 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 transition hover:text-slate-300"
            >
              ← Back to homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
