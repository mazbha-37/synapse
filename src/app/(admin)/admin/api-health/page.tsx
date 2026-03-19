"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";
import { ApiStatus } from "@/types";

interface ApiSource {
  _id: string;
  name: string;
  slug: string;
  baseUrl: string;
  status: ApiStatus;
  avgResponseMs: number;
  lastCheckedAt?: string;
  dailyCallCount: number;
  dailyLimit: number;
  errorCount: number;
  lastErrorMessage?: string;
}

export default function ApiHealthPage() {
  const [apiSources, setApiSources] = useState<ApiSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testingApi, setTestingApi] = useState<string | null>(null);

  useEffect(() => {
    fetchApiHealth();
  }, []);

  const fetchApiHealth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/api-health");
      if (response.ok) {
        const data = await response.json();
        setApiSources(data);
      }
    } catch {
      toast.error("Failed to fetch API health status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApi = async (slug: string) => {
    try {
      setTestingApi(slug);
      const response = await fetch("/api/admin/api-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (response.ok) {
        toast.success("API test completed");
        fetchApiHealth();
      } else {
        throw new Error("Failed to test API");
      }
    } catch {
      toast.error("Failed to test API");
    } finally {
      setTestingApi(null);
    }
  };

  const getStatusIcon = (status: ApiStatus) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ApiStatus) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case "down":
        return <Badge variant="destructive">Down</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Health Monitor</h1>
          <p className="text-muted-foreground">
            Monitor the status and performance of all API integrations
          </p>
        </div>
        <Button onClick={fetchApiHealth} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-20" />
                <CardContent className="h-40" />
              </Card>
            ))
          : apiSources.map((api) => (
              <Card key={api._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      {getStatusBadge(api.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span>{api.avgResponseMs}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Calls</span>
                      <span>
                        {api.dailyCallCount} / {api.dailyLimit}
                      </span>
                    </div>
                    <Progress
                      value={(api.dailyCallCount / api.dailyLimit) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Error Count (24h)</span>
                    <span className={api.errorCount > 0 ? "text-red-500" : ""}>
                      {api.errorCount}
                    </span>
                  </div>

                  {api.lastErrorMessage && (
                    <div className="text-sm text-red-500 line-clamp-2">
                      Last Error: {api.lastErrorMessage}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Last checked:{" "}
                      {api.lastCheckedAt
                        ? formatRelativeTime(api.lastCheckedAt)
                        : "Never"}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestApi(api.slug)}
                      disabled={testingApi === api.slug}
                    >
                      {testingApi === api.slug ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Test Now"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
