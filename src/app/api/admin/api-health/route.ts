import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ApiSource from "@/models/ApiSource";

// GET API health status (admin only)
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await dbConnect();

    const apiSources = await ApiSource.find().sort({ name: 1 }).lean();

    return NextResponse.json(apiSources);
  } catch (error) {
    console.error("Error fetching API health:", error);
    return NextResponse.json(
      { error: "Failed to fetch API health status" },
      { status: 500 }
    );
  }
}

// POST test an API (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "API slug is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const apiSource = await ApiSource.findOne({ slug });
    if (!apiSource) {
      return NextResponse.json(
        { error: "API source not found" },
        { status: 404 }
      );
    }

    // Test the API
    const startTime = Date.now();
    let status: "healthy" | "degraded" | "down" = "healthy";
    let errorMessage = "";

    try {
      const response = await fetch(apiSource.baseUrl, {
        method: "HEAD",
        timeout: 5000,
      } as RequestInit);

      const responseTime = Date.now() - startTime;

      if (responseTime >= 2000) {
        status = "degraded";
      }

      apiSource.avgResponseMs = responseTime;
    } catch (error) {
      status = "down";
      errorMessage = error instanceof Error ? error.message : "Unknown error";
    }

    apiSource.status = status;
    apiSource.lastCheckedAt = new Date();
    if (errorMessage) {
      apiSource.lastErrorMessage = errorMessage;
      apiSource.errorCount += 1;
    }

    await apiSource.save();

    return NextResponse.json(apiSource);
  } catch (error) {
    console.error("Error testing API:", error);
    return NextResponse.json(
      { error: "Failed to test API" },
      { status: 500 }
    );
  }
}
