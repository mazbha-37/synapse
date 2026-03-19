import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Dashboard from "@/models/Dashboard";
import Widget from "@/models/Widget";
import AuditLog from "@/models/AuditLog";
import { createWidgetSchema, getWidgetConfigSchema } from "@/validators/widget";
import { WIDGET_DEFAULT_SIZES } from "@/lib/constants";

// GET all widgets for a dashboard
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await dbConnect();

    // Verify dashboard belongs to user
    const dashboard = await Dashboard.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    const widgets = await Widget.find({ dashboardId: id }).lean();

    return NextResponse.json(widgets);
  } catch (error) {
    console.error("Error fetching widgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch widgets" },
      { status: 500 }
    );
  }
}

// POST add a new widget to a dashboard
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const result = createWidgetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify dashboard belongs to user
    const dashboard = await Dashboard.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    // Validate widget config based on type
    const configSchema = getWidgetConfigSchema(result.data.type);
    const configResult = configSchema.safeParse(result.data.config);
    if (!configResult.success) {
      return NextResponse.json(
        { error: "Invalid widget config", details: configResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Use default size if not provided
    const defaultSize = WIDGET_DEFAULT_SIZES[result.data.type];
    const position = {
      x: result.data.position.x,
      y: result.data.position.y,
      w: result.data.position.w || defaultSize.w,
      h: result.data.position.h || defaultSize.h,
    };

    const widget = await Widget.create({
      dashboardId: id,
      type: result.data.type,
      config: configResult.data,
      position,
    });

    // Log action
    await AuditLog.create({
      userId: session.user.id,
      action: "widget.add",
      details: `Added ${result.data.type} widget to dashboard: ${dashboard.name}`,
    });

    return NextResponse.json(widget, { status: 201 });
  } catch (error) {
    console.error("Error creating widget:", error);
    return NextResponse.json(
      { error: "Failed to create widget" },
      { status: 500 }
    );
  }
}
