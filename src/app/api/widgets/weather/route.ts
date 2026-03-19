import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchWeather } from "@/lib/apis/weather";
import dbConnect from "@/lib/db";
import ApiSource from "@/models/ApiSource";

export async function GET(req: NextRequest) {
  // 1. Auth check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse params
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "London";
  const units = (searchParams.get("units") as "metric" | "imperial") || "metric";

  // 3. Track API call timing
  const startTime = Date.now();

  try {
    // 4. Fetch data
    const data = await fetchWeather(city, units);
    const responseTime = Date.now() - startTime;

    // 5. Update API source health (fire and forget)
    dbConnect().then(() => {
      ApiSource.findOneAndUpdate(
        { slug: "weather" },
        {
          $set: { status: "healthy", avgResponseMs: responseTime, lastCheckedAt: new Date() },
          $inc: { dailyCallCount: 1 },
        }
      ).exec();
    });

    // 6. Return data
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // 7. Track error
    dbConnect().then(() => {
      ApiSource.findOneAndUpdate(
        { slug: "weather" },
        {
          $set: { lastErrorMessage: errorMessage, lastCheckedAt: new Date() },
          $inc: { errorCount: 1 },
        }
      ).exec();
    });

    return NextResponse.json(
      { error: "Failed to fetch weather data", message: errorMessage },
      { status: 502 }
    );
  }
}
