import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Dashboard from "@/models/Dashboard";
import Widget from "@/models/Widget";
import { GridLayoutItem } from "@/types";

// PUT update dashboard layout
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
    const { layout } = body;

    if (!Array.isArray(layout)) {
      return NextResponse.json(
        { error: "Layout must be an array" },
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

    // Update dashboard layout
    dashboard.layout = JSON.stringify(layout);
    await dashboard.save();

    // Update individual widget positions
    const layoutItems: GridLayoutItem[] = layout;
    for (const item of layoutItems) {
      await Widget.updateOne(
        { _id: item.i, dashboardId: id },
        {
          $set: {
            "position.x": item.x,
            "position.y": item.y,
            "position.w": item.w,
            "position.h": item.h,
          },
        }
      );
    }

    return NextResponse.json({ message: "Layout updated successfully" });
  } catch (error) {
    console.error("Error updating layout:", error);
    return NextResponse.json(
      { error: "Failed to update layout" },
      { status: 500 }
    );
  }
}
