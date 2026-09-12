import Link from "next/link";

export default function AuditNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Audit Not Found
        </h1>

        <p className="mt-3 text-gray-500">
          The audit you are looking for does not exist.
        </p>

        <Link
          href="/dashboard/audits"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Audits
        </Link>
      </div>
    </div>
  );
}