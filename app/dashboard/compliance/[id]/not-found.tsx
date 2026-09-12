import Link from "next/link";

export default function ComplianceNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        {/* ICON */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <span className="text-2xl font-bold text-red-500">
            !
          </span>
        </div>

        {/* TITLE */}
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Compliance Record Not Found
        </h1>

        {/* MESSAGE */}
        <p className="mt-2 text-sm leading-6 text-slate-500">
          The compliance record you are looking for does not exist
          or may have been removed.
        </p>

        {/* BUTTON */}
        <Link
          href="/dashboard/compliance"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Compliance
        </Link>

      </div>
    </div>
  );
}