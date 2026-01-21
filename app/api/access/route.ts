import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workerId = (body.workerId || "").trim();
    const path = (body.path || "").trim();

    if (!workerId) {
      return NextResponse.json(
        { error: "workerId is required" },
        { status: 400 },
      );
    }

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const log = await prisma.accessLog.create({
      data: {
        workerId,
        path,
      },
    });

    return NextResponse.json({ success: true, id: log.id });
  } catch (error) {
    console.error("Access log error:", error);
    return NextResponse.json(
      { error: "Failed to record access" },
      { status: 500 },
    );
  }
}
