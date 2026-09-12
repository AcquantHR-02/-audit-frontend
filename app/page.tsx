import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-center text-red-400 text-7xl">This is the Homepage. </h1>
      <div className="flex flex-col p-4 m-5 border-r-4 bg-amber-100 items-center text-3xl stroke-2">


      <Link href="/login">Go to Login</Link>
     
      </div>
    </div>
  );
}
