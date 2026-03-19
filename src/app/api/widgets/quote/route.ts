import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchQuote } from "@/lib/apis/quote";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await fetchQuote();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch quote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
