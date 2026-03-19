import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchStock } from "@/lib/apis/stocks";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";

  try {
    const data = await fetchStock(symbol);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch stock data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
