import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Dashboard from "@/models/Dashboard";
import Widget from "@/models/Widget";
import AuditLog from "@/models/AuditLog";
import { updateDashboardSchema } from "@/validators/dashboard";

// GET a single dashboard with its widgets
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

    const dashboard = await Dashboard.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    const widgets = await Widget.find({ dashboardId: id }).lean();

    return NextResponse.json({ ...dashboard, widgets });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}

// PUT update a dashboard
export async function PUT(
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

    const result = updateDashboardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    // If setting as default, unset others
    if (result.data.isDefault) {
      await Dashboard.updateMany(
        { userId: session.user.id, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: result.data },
      { new: true }
    );

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    // Log action
    await AuditLog.create({
      userId: session.user.id,
      action: "dashboard.update",
      details: `Updated dashboard: ${dashboard.name}`,
    });

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("Error updating dashboard:", error);
    return NextResponse.json(
      { error: "Failed to update dashboard" },
      { status: 500 }
    );
  }
}

// DELETE a dashboard
export async function DELETE(
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

    // Delete all widgets associated with this dashboard
    await Widget.deleteMany({ dashboardId: id });

    // Delete the dashboard
    await Dashboard.deleteOne({ _id: id });

    // Log action
    await AuditLog.create({
      userId: session.user.id,
      action: "dashboard.delete",
      details: `Deleted dashboard: ${dashboard.name}`,
    });

    return NextResponse.json({ message: "Dashboard deleted successfully" });
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    return NextResponse.json(
      { error: "Failed to delete dashboard" },
      { status: 500 }
    );
  }
}
