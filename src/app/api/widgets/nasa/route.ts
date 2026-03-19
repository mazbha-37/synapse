import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchApod } from "@/lib/apis/nasa";
import dbConnect from "@/lib/db";
import ApiSource from "@/models/ApiSource";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get("count") || "1", 10);

  const startTime = Date.now();

  try {
    const data = await fetchApod(count);
    const responseTime = Date.now() - startTime;

    dbConnect().then(() => {
      ApiSource.findOneAndUpdate(
        { slug: "nasa" },
        {
          $set: { status: "healthy", avgResponseMs: responseTime, lastCheckedAt: new Date() },
          $inc: { dailyCallCount: 1 },
        }
      ).exec();
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    dbConnect().then(() => {
      ApiSource.findOneAndUpdate(
        { slug: "nasa" },
        {
          $set: { lastErrorMessage: errorMessage, lastCheckedAt: new Date() },
          $inc: { errorCount: 1 },
        }
      ).exec();
    });

    return NextResponse.json(
      { error: "Failed to fetch NASA data", message: errorMessage },
      { status: 502 }
    );
  }
}
