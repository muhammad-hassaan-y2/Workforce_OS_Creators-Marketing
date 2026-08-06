import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard route
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("kaiso_access_token")?.value;
    
    // Pass through or attach security headers
    const response = NextResponse.next();
    response.headers.set("x-kaiso-auth-status", token ? "authenticated" : "guest");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
