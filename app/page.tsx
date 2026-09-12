
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-black shadow-lg shadow-blue-500/30 transition duration-300 group-hover:scale-105">
              A
            </div>

            <div>
              <h1 className="text-base font-bold tracking-wide">
                Audit Management
              </h1>

              <p className="text-xs text-slate-400">
                Enterprise System
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Workflow
            </a>

            <a
              href="#security"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Security
            </a>

            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Login */}
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold md:hidden"
          >
            Login
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative isolate overflow-hidden">
        
        {/* Animated background blobs */}
        <div className="absolute left-[-150px] top-20 -z-10 h-[400px] w-[400px] animate-pulse rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute right-[-150px] top-40 -z-10 h-[450px] w-[450px] animate-pulse rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
          
          {/* Hero Content */}
          <div className="animate-[fadeIn_0.8s_ease-out]">
            
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              Smart Audit & Compliance Platform
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Simplify Audits.
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Strengthen Compliance.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 md:text-lg">
              Manage your complete audit lifecycle from planning and
              compliance tracking to findings, corrective actions and
              reporting — all from one powerful platform.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              
              <Link
                href="/login"
                className="group rounded-xl bg-blue-600 px-7 py-3.5 text-center text-sm font-bold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                Get Started

                <span className="ml-2 transition group-hover:ml-3">
                  →
                </span>
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-center text-sm font-bold text-slate-200 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Explore Platform
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>✓ Centralized Audits</span>
              <span>✓ Compliance Tracking</span>
              <span>✓ Risk Monitoring</span>
            </div>
          </div>

          {/* Hero Image / Dashboard */}
          <div className="relative">
            
            {/* Floating card */}
            <div className="absolute -left-5 top-12 z-20 hidden animate-bounce rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  ✓
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Compliance
                  </p>

                  <p className="text-sm font-bold text-white">
                    94% Healthy
                  </p>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-blue-900/30 backdrop-blur-xl transition duration-500 hover:scale-[1.02]">
              
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
                  alt="Professional team working on audit management"
                  width={1200}
                  height={800}
                  className="h-[420px] w-full object-cover opacity-80"
                  priority
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/20 to-blue-600/20" />

                {/* Dashboard floating panel */}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl">
                  
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">
                        Overall Performance
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        Audit Overview
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-500/10 px-3 py-2 text-xs font-bold text-green-400">
                      +12.5%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xs text-slate-400">
                        Audits
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        24
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xs text-slate-400">
                        Completed
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-400">
                        16
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xs text-slate-400">
                        Findings
                      </p>

                      <p className="mt-1 text-xl font-bold text-red-400">
                        05
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-400">
                        Audit Progress
                      </span>

                      <span className="font-semibold text-blue-400">
                        78%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[78%] animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -bottom-8 -right-8 -z-10 h-32 w-32 animate-spin rounded-full border border-blue-500/20 [animation-duration:15s]" />
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          
          <div className="px-6 py-10 text-center transition hover:bg-white/[0.03]">
            <p className="text-3xl font-black text-white">
              24+
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Audits Managed
            </p>
          </div>

          <div className="px-6 py-10 text-center transition hover:bg-white/[0.03]">
            <p className="text-3xl font-black text-blue-400">
              16+
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Completed Audits
            </p>
          </div>

          <div className="px-6 py-10 text-center transition hover:bg-white/[0.03]">
            <p className="text-3xl font-black text-green-400">
              94%
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Compliance Health
            </p>
          </div>

          <div className="px-6 py-10 text-center transition hover:bg-white/[0.03]">
            <p className="text-3xl font-black text-purple-400">
              24/7
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Platform Access
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section id="features" className="bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Platform Features
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Everything you need to control your audit lifecycle
            </h2>

            <p className="mt-5 text-slate-400">
              One centralized system for audits, compliance, findings,
              notifications and reports.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Audit */}
            <FeatureCard
              icon="📋"
              title="Audit Management"
              description="Plan, schedule, assign and monitor audits with complete visibility."
              gradient="from-blue-500/20"
            />

            {/* Compliance */}
            <FeatureCard
              icon="✓"
              title="Compliance"
              description="Track requirements, compliance status and upcoming deadlines."
              gradient="from-green-500/20"
            />

            {/* Findings */}
            <FeatureCard
              icon="⚠"
              title="Finding Management"
              description="Track findings, severity, corrective actions and resolution."
              gradient="from-red-500/20"
            />

            {/* Reports */}
            <FeatureCard
              icon="📊"
              title="Reports & Analytics"
              description="Turn audit data into meaningful reports and actionable insights."
              gradient="from-purple-500/20"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
      ===================================================== */}
      <section
        id="workflow"
        className="relative overflow-hidden border-y border-white/10 bg-slate-900 py-24"
      >
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Simple Workflow
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              From planning to reporting
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            
            <WorkflowStep
              number="01"
              title="Plan"
              description="Create audits and define scope, dates and responsibilities."
            />

            <WorkflowStep
              number="02"
              title="Execute"
              description="Perform audits and document observations and evidence."
            />

            <WorkflowStep
              number="03"
              title="Resolve"
              description="Track findings and corrective actions until closure."
            />

            <WorkflowStep
              number="04"
              title="Report"
              description="Generate reports and analyze audit performance."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SECURITY
      ===================================================== */}
      <section id="security" className="bg-slate-950 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
          
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Enterprise Ready
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Built with security and control in mind.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Keep sensitive audit information organized with secure
              authentication, role-based access and centralized data
              management.
            </p>

            <div className="mt-8 space-y-5">
              <SecurityItem
                title="Secure Authentication"
                description="Protected login and user access."
              />

              <SecurityItem
                title="Role-Based Access"
                description="Give users access according to their responsibilities."
              />

              <SecurityItem
                title="Centralized Data"
                description="Keep audit information organized in one platform."
              />
            </div>
          </div>

          {/* Security Visual */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 shadow-2xl">
              
              <div className="mx-auto flex h-64 max-w-md items-center justify-center rounded-2xl border border-white/10 bg-slate-900 shadow-inner">
                
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-blue-500/10 text-4xl">
                    🔐
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    Secure Audit Environment
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Your data. Your control.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-blue-500/20" />
            <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full border border-purple-500/20" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20">
        
        <div className="absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl" />

        <div className="absolute bottom-0 right-10 h-40 w-40 animate-pulse rounded-full bg-white/10 blur-2xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          
          <h2 className="text-3xl font-black md:text-5xl">
            Ready to take control of your audits?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-blue-100">
            Bring audits, compliance, findings and reporting together
            in one powerful management platform.
          </p>

          <Link
            href="/login"
            className="mt-9 inline-flex items-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-2xl transition duration-300 hover:-translate-y-1 hover:bg-slate-100"
          >
            Enter Audit Dashboard
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row">
          
          <div>
            <p className="font-semibold text-slate-300">
              Audit Management System
            </p>

            <p className="mt-1">
              Enterprise Audit & Compliance Platform
            </p>
          </div>

          <div className="flex items-center gap-5">
            <span>Secure</span>
            <span>•</span>
            <span>Reliable</span>
            <span>•</span>
            <span>Efficient</span>
          </div>

          <p>
            © 2026 Audit Management System
          </p>
        </div>
      </footer>
    </main>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${gradient} to-transparent p-7 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-900/20`}
    >
      {/* Hover glow */}
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>

        <h3 className="mt-6 text-lg font-bold">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          {description}
        </p>

        <div className="mt-6 text-sm font-semibold text-blue-400 transition group-hover:translate-x-1">
          Learn more →
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   WORKFLOW STEP
========================================================= */

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative">
      <div className="mb-6 flex items-center gap-4">
        
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-400 transition duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
          {number}
        </div>

        <div className="hidden h-px flex-1 bg-white/10 md:block" />
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}


/* =========================================================
   SECURITY ITEM
========================================================= */

function SecurityItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-sm text-green-400">
        ✓
      </div>

      <div>
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

