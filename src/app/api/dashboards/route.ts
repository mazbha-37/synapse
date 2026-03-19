import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Dashboard from "@/models/Dashboard";
import Widget from "@/models/Widget";
import AuditLog from "@/models/AuditLog";
import { createDashboardSchema } from "@/validators/dashboard";

// GET all dashboards for the current user
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const dashboards = await Dashboard.find({ userId: session.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(dashboards);
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboards" },
      { status: 500 }
    );
  }
}

// POST create a new dashboard
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const result = createDashboardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    // If this is set as default, unset any existing default
    if (result.data.isDefault) {
      await Dashboard.updateMany(
        { userId: session.user.id },
        { $set: { isDefault: false } }
      );
    }

    const dashboard = await Dashboard.create({
      userId: session.user.id,
      ...result.data,
      layout: "[]",
    });

    // Log action
    await AuditLog.create({
      userId: session.user.id,
      action: "dashboard.create",
      details: `Created dashboard: ${result.data.name}`,
    });

    return NextResponse.json(dashboard, { status: 201 });
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return NextResponse.json(
      { error: "Failed to create dashboard" },
      { status: 500 }
    );
  }
}
