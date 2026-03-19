"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutDashboard, Activity, Brain } from "lucide-react";
import { formatCompactNumber } from "@/lib/utils";

interface AdminStats {
  summary: {
    totalUsers: number;
    newUsersThisWeek: number;
    totalWidgets: number;
    totalAiChats: number;
    totalApiCalls: number;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.summary.totalUsers || 0,
      change: `+${stats?.summary.newUsersThisWeek || 0} this week`,
      icon: Users,
    },
    {
      title: "Active Widgets",
      value: stats?.summary.totalWidgets || 0,
      change: "Across all dashboards",
      icon: LayoutDashboard,
    },
    {
      title: "AI Queries",
      value: stats?.summary.totalAiChats || 0,
      change: "Total conversations",
      icon: Brain,
    },
    {
      title: "API Calls Today",
      value: formatCompactNumber(stats?.summary.totalApiCalls || 0),
      change: "All sources combined",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">
          Platform-wide statistics and monitoring
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "-" : card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/users"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-muted-foreground">
                View and manage user accounts
              </div>
            </a>
            <a
              href="/admin/api-health"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">API Health</div>
              <div className="text-sm text-muted-foreground">
                Monitor API status and performance
              </div>
            </a>
            <a
              href="/admin/analytics"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-muted-foreground">
                View detailed platform analytics
              </div>
            </a>
            <a
              href="/admin/logs"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">Audit Logs</div>
              <div className="text-sm text-muted-foreground">
                Review system activity logs
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Service</span>
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Operational
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
