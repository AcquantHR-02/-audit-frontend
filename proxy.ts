import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;

//    if (path === "/register") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
  console.log("Path:", path);
  console.log("Method:", method);

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};