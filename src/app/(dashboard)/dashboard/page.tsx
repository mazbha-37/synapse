"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, RefreshCw, Layers, Clock, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WidgetGrid } from "@/components/dashboard/WidgetGrid";
import { AddWidgetDialog } from "@/components/dashboard/AddWidgetDialog";
import { AiChatSheet } from "@/components/ai/AiChatSheet";
import { DashboardSwitcher } from "@/components/dashboard/DashboardSwitcher";
import { IWidget, IDashboard, WidgetType, GridLayoutItem } from "@/types";
import { WIDGET_DEFAULT_SIZES } from "@/lib/constants";

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 120) return "1 min ago";
  return `${Math.floor(seconds / 60)} min ago`;
}

function getWidgetInsightPrompt(widget: IWidget): string {
  const { type, config } = widget;
  switch (type) {
    case "weather":
      return `Give me a brief weather insight and forecast for ${config.city}. What should I expect?`;
    case "crypto":
      return `Give me a current market analysis and brief outlook for ${(config.coins as string[])?.join(", ") || "crypto"} in ${((config.currency as string) || "usd").toUpperCase()}.`;
    case "news":
      return `What are the key themes and trending stories in ${config.category} news right now?`;
    case "github":
      return config.type === "profile"
        ? `Tell me about GitHub developer "${config.username}" and their notable projects.`
        : `What are the hottest trending GitHub repositories and what tech trends do they reflect?`;
    case "nasa":
      return `Tell me about a recent exciting astronomy or space discovery.`;
    case "air-quality":
      return `What are the current air quality conditions in ${config.city} and any health recommendations?`;
    default:
      return `Give me a quick insight about my ${type} dashboard widget.`;
  }
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<IDashboard | null>(null);
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Auto-refresh state
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(0); // minutes; 0 = off
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [relativeTime, setRelativeTime] = useState("");

  // Update "X min ago" label every 15 seconds
  useEffect(() => {
    if (!lastRefreshed) return;
    setRelativeTime(formatRelativeTime(lastRefreshed));
    const t = setInterval(() => setRelativeTime(formatRelativeTime(lastRefreshed)), 15000);
    return () => clearInterval(t);
  }, [lastRefreshed]);

  // Open chat if query param is present
  useEffect(() => {
    if (searchParams.get("chat") === "open") setIsChatOpen(true);
  }, [searchParams]);

  useEffect(() => { fetchDashboards(); }, []);
  useEffect(() => {
    if (currentDashboard) fetchWidgets(currentDashboard._id.toString());
  }, [currentDashboard]);


  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval === 0) return;
    const timer = setInterval(() => handleRefreshAll(), refreshInterval * 60 * 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA"].includes(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "k" || e.key === "K") { e.preventDefault(); setIsChatOpen(true); }
      if (e.key === "n" || e.key === "N") { e.preventDefault(); setIsAddDialogOpen(true); }
      if (e.key === "r" || e.key === "R") { e.preventDefault(); handleRefreshAll(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefreshAll = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setLastRefreshed(new Date());
    setRelativeTime("just now");
    setTimeout(() => setIsRefreshing(false), 800);
    toast.success("Widgets refreshed");
  }, []);

  const fetchDashboards = async () => {
    try {
      const res = await fetch("/api/dashboards");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDashboards(data);
      // Only set initial dashboard if no ?id= param is present
      const targetId = searchParams.get("id");
      const initial = targetId
        ? data.find((d: IDashboard) => d._id.toString() === targetId)
        : data.find((d: IDashboard) => d.isDefault) || data[0];
      if (initial) setCurrentDashboard(initial);
    } catch {
      toast.error("Failed to load dashboards");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWidgets = async (dashboardId: string) => {
    try {
      const res = await fetch(`/api/dashboards/${dashboardId}/widgets`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWidgets(data);
    } catch {
      toast.error("Failed to load widgets");
    }
  };

  const handleAddWidget = async (type: string, config: Record<string, unknown>) => {
    if (!currentDashboard) return;
    try {
      const parsedLayout: GridLayoutItem[] = currentDashboard.layout
        ? JSON.parse(currentDashboard.layout)
        : [];

      const defaultSize = WIDGET_DEFAULT_SIZES[type as WidgetType];
      const newW = defaultSize?.w || 4;
      const newH = defaultSize?.h || 3;
      const COLS = 12;

      // Build current positions from saved layout or widget.position
      const positions = widgets.map((w) => {
        const saved = parsedLayout.find((item) => item.i === w._id.toString());
        return {
          x: saved?.x ?? w.position.x,
          y: saved?.y ?? w.position.y,
          w: saved?.w ?? w.position.w,
          h: saved?.h ?? w.position.h,
        };
      });

      // Place widgets in a strict 2-column layout (x=0 or x=6)
      let newX = 0;
      let newY = 0;
      if (positions.length > 0) {
        const maxY = positions.reduce((m, p) => Math.max(m, p.y + p.h), 0);
        const lastRowY = positions.reduce((m, p) => Math.max(m, p.y), 0);
        const widgetsInLastRow = positions.filter((p) => p.y >= lastRowY);
        if (widgetsInLastRow.length < 2) {
          // Last row has space for one more widget
          const occupiedXs = widgetsInLastRow.map((p) => p.x);
          newX = occupiedXs.includes(0) ? 6 : 0;
          newY = lastRowY;
        } else {
          // Start a new row
          newX = 0;
          newY = maxY;
        }
      }

      const res = await fetch(`/api/dashboards/${currentDashboard._id}/widgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          config,
          position: { x: newX, y: newY, w: newW, h: newH },
        }),
      });
      if (!res.ok) throw new Error();
      const newWidget = await res.json();
      setWidgets([...widgets, newWidget]);
      toast.success("Widget added");
    } catch {
      toast.error("Failed to add widget");
    }
  };

  const handleRemoveWidget = async (widgetId: string) => {
    try {
      const res = await fetch(
        `/api/dashboards/${currentDashboard?._id}/widgets/${widgetId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setWidgets(widgets.filter((w) => w._id.toString() !== widgetId));
      toast.success("Widget removed");
    } catch {
      toast.error("Failed to remove widget");
    }
  };

  const handleLayoutChange = async (layout: unknown[]) => {
    if (!currentDashboard) return;
    try {
      await fetch(`/api/dashboards/${currentDashboard._id}/layout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout }),
      });
    } catch { /* silent */ }
  };

  const handleQuickInsight = (widget: IWidget) => {
    const prompt = getWidgetInsightPrompt(widget);
    setChatInitialMessage(prompt);
    setIsChatOpen(true);
  };

  const handleChatClose = (open: boolean) => {
    setIsChatOpen(open);
    if (!open) setChatInitialMessage(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {currentDashboard?.name || "Dashboard"}
            </h1>
            <Badge variant="secondary" className="text-xs gap-1 font-normal">
              <Layers className="h-3 w-3" />
              {widgets.length} {widgets.length === 1 ? "widget" : "widgets"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {currentDashboard?.description || "Your personal data command center"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <DashboardSwitcher
            dashboards={dashboards}
            currentDashboard={currentDashboard}
            onDashboardChange={setCurrentDashboard}
          />
          <Button variant="outline" size="sm" onClick={() => setIsChatOpen(true)} title="AI Chat (K)">
            <MessageSquare className="h-4 w-4" />
            <span className="ml-2">AI Chat</span>
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)} title="Add Widget (N)">
            <Plus className="h-4 w-4" />
            <span className="ml-2">Add Widget</span>
          </Button>
        </div>
      </div>

      {/* Live data toolbar */}
      {currentDashboard && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                refreshInterval > 0 ? "bg-green-500 animate-pulse" : "bg-muted-foreground/50"
              )}
            />
            <Clock className="h-3 w-3" />
            {lastRefreshed
              ? <span>Updated <strong className="text-foreground">{relativeTime}</strong></span>
              : <span>Press <kbd className="px-1 py-0.5 bg-background border rounded text-[10px] mx-0.5">R</kbd> to refresh</span>
            }
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground" title="Keyboard shortcuts: K=AI Chat, N=Add Widget, R=Refresh">
              <Keyboard className="h-3 w-3" />
              <span className="hidden md:inline text-[11px]">K · N · R</span>
            </div>
            <Select
              value={String(refreshInterval)}
              onValueChange={(v) => setRefreshInterval(Number(v))}
            >
              <SelectTrigger className="h-7 w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Manual refresh</SelectItem>
                <SelectItem value="1">Auto: 1 min</SelectItem>
                <SelectItem value="5">Auto: 5 min</SelectItem>
                <SelectItem value="15">Auto: 15 min</SelectItem>
                <SelectItem value="30">Auto: 30 min</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="h-7 w-7 p-0"
              title="Refresh all widgets (R)"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      )}

      {/* Widget Grid */}
      {currentDashboard && widgets.length > 0 && (
        <WidgetGrid
          widgets={widgets}
          layout={currentDashboard.layout}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={handleRemoveWidget}
          onQuickInsight={handleQuickInsight}
          refreshKey={refreshKey}
        />
      )}

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 border-2 border-dashed border-muted rounded-xl">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-5 px-4">
            Add your first widget to start tracking data from various sources.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </div>
      )}

      <AddWidgetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddWidget={handleAddWidget}
      />

      <AiChatSheet
        open={isChatOpen}
        onOpenChange={handleChatClose}
        widgetData={{}}
        initialMessage={chatInitialMessage}
      />
    </div>
  );
}
