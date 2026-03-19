"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { IWidget, WidgetType } from "@/types";
import {
  CloudSun, Newspaper, Bitcoin, Github, Rocket, Wind,
  MoreVertical, RefreshCw, Sparkles, Settings, Trash2,
  DollarSign, TrendingUp, Activity, Quote, CalendarDays,
} from "lucide-react";

interface WidgetWrapperProps {
  widget: IWidget;
  onRemove: () => void;
  onQuickInsight: () => void;
  children: React.ReactNode;
}

const widgetIcons: Record<WidgetType, typeof CloudSun> = {
  weather: CloudSun,
  news: Newspaper,
  crypto: Bitcoin,
  github: Github,
  nasa: Rocket,
  "air-quality": Wind,
  forex: DollarSign,
  stocks: TrendingUp,
  earthquake: Activity,
  quote: Quote,
  holidays: CalendarDays,
};

const widgetTitles: Record<WidgetType, string> = {
  weather: "Weather",
  news: "News",
  crypto: "Cryptocurrency",
  github: "GitHub",
  nasa: "NASA APOD",
  "air-quality": "Air Quality",
  forex: "Forex / Currency",
  stocks: "Stock Market",
  earthquake: "Earthquakes",
  quote: "Quote of the Day",
  holidays: "Public Holidays",
};

export function WidgetWrapper({ widget, onRemove, onQuickInsight, children }: WidgetWrapperProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const Icon = widgetIcons[widget.type];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {widgetTitles[widget.type]}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRefresh}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onQuickInsight}>
              <Sparkles className="mr-2 h-4 w-4" />
              Quick Insight
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRemove} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function WidgetSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
