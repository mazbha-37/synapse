import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchTrendingRepos, fetchGitHubProfile } from "@/lib/apis/github";
import dbConnect from "@/lib/db";
import ApiSource from "@/models/ApiSource";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "trending";
  const username = searchParams.get("username") || "";

  const startTime = Date.now();

  try {
    let data;
    if (type === "profile" && username) {
      data = await fetchGitHubProfile(username);
    } else {
      data = await fetchTrendingRepos();
    }

    const responseTime = Date.now() - startTime;

    dbConnect().then(() => {
      ApiSource.findOneAndUpdate(
        { slug: "github" },
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
        { slug: "github" },
        {
          $set: { lastErrorMessage: errorMessage, lastCheckedAt: new Date() },
          $inc: { errorCount: 1 },
        }
      ).exec();
    });

    return NextResponse.json(
      { error: "Failed to fetch GitHub data", message: errorMessage },
      { status: 502 }
    );
  }
}
