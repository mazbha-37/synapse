import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchEarthquakes } from "@/lib/apis/earthquake";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5");
  const minMag = parseFloat(searchParams.get("minMagnitude") || "4");

  try {
    const data = await fetchEarthquakes(limit, minMag);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch earthquake data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
