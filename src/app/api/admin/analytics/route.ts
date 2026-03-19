import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Widget from "@/models/Widget";
import ApiSource from "@/models/ApiSource";
import AiChat from "@/models/AiChat";

// GET analytics data (admin only)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User growth (last 30 days)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Widget popularity
    const widgetPopularity = await Widget.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // API call volume (last 14 days)
    const apiCallVolume = await ApiSource.aggregate([
      {
        $project: {
          name: 1,
          slug: 1,
          dailyCallCount: 1,
        },
      },
    ]);

    // AI usage (last 14 days)
    const aiUsage = await AiChat.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Summary stats
    const totalUsers = await User.countDocuments();
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    const totalWidgets = await Widget.countDocuments();
    const totalAiChats = await AiChat.countDocuments();
    const totalApiCalls = await ApiSource.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$dailyCallCount" },
        },
      },
    ]);

    return NextResponse.json({
      summary: {
        totalUsers,
        newUsersThisWeek,
        totalWidgets,
        totalAiChats,
        totalApiCalls: totalApiCalls[0]?.total || 0,
      },
      userGrowth,
      widgetPopularity,
      apiCallVolume,
      aiUsage,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
