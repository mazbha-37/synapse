import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchCrypto } from "@/lib/apis/crypto";
import dbConnect from "@/lib/db";
import ApiSource from "@/models/ApiSource";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const coins = searchParams.get("coins")?.split(",") || ["bitcoin", "ethereum", "solana"];
  const currency = searchParams.get("currency") || "usd";

  const startTime = Date.now();

  try {
    const data = await fetchCrypto(coins, currency);
    const responseTime = Date.now() - startTime;

    dbConnect().then(() => {
      ApiSource.findOneAndUpdate(
        { slug: "crypto" },
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
        { slug: "crypto" },
        {
          $set: { lastErrorMessage: errorMessage, lastCheckedAt: new Date() },
          $inc: { errorCount: 1 },
        }
      ).exec();
    });

    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency data", message: errorMessage },
      { status: 502 }
    );
  }
}
