import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Dashboard from "@/models/Dashboard";
import Widget from "@/models/Widget";
import AuditLog from "@/models/AuditLog";

// DELETE a widget
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; widgetId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, widgetId } = await params;

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

    // Delete the widget
    const widget = await Widget.findOneAndDelete({
      _id: widgetId,
      dashboardId: id,
    });

    if (!widget) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404 }
      );
    }

    // Log action
    await AuditLog.create({
      userId: session.user.id,
      action: "widget.remove",
      details: `Removed ${widget.type} widget from dashboard: ${dashboard.name}`,
    });

    return NextResponse.json({ message: "Widget deleted successfully" });
  } catch (error) {
    console.error("Error deleting widget:", error);
    return NextResponse.json(
      { error: "Failed to delete widget" },
      { status: 500 }
    );
  }
}
