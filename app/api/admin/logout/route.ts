import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // クッキーをクリア
  response.cookies.set("adminToken", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
