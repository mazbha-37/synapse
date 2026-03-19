import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchForex } from "@/lib/apis/forex";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base") || "USD";

  try {
    const data = await fetchForex(base);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch forex data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
