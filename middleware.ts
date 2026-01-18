import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  // /admin/dashboard へのアクセスを保護
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const verified = await verifyJWT(token);
    if (!verified) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
