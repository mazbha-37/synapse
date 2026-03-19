import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchHolidays } from "@/lib/apis/holidays";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get("countryCode") || "US";

  try {
    const data = await fetchHolidays(countryCode);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch holidays";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
