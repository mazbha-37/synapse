"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CalendarDays, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface Holiday {
  date: string;
  name: string;
  localName: string;
  types: string[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr + "T00:00:00") >= new Date(new Date().toISOString().split("T")[0]);
}

export function HolidaysWidget({ config }: { config: Record<string, unknown> }) {
  const [data, setData] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countryCode = (config.countryCode as string) || "US";

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/widgets/holidays?countryCode=${countryCode}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [countryCode]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground py-4">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm text-center">{error}</p>
      </div>
    );
  }

  const displayed = data.slice(0, 8);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{new Date().getFullYear()} Holidays</span>
        </div>
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{countryCode.toUpperCase()}</span>
      </div>

      {displayed.map((h) => {
        const today = isToday(h.date);
        const upcoming = isUpcoming(h.date);
        return (
          <div
            key={h.date + h.name}
            className={cn(
              "flex items-center gap-3 py-1.5 px-2 rounded-md transition-colors",
              today ? "bg-primary/10 border border-primary/30" : upcoming ? "hover:bg-muted/50" : "opacity-50"
            )}
          >
            <div className={cn("text-xs font-mono w-14 flex-shrink-0 font-semibold", today ? "text-primary" : "text-muted-foreground")}>
              {formatDate(h.date)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate font-medium">{h.name}</p>
            </div>
            {today && <PartyPopper className="h-4 w-4 text-primary flex-shrink-0" />}
          </div>
        );
      })}

      {data.length > 8 && (
        <p className="text-xs text-muted-foreground text-center pt-1">+{data.length - 8} more holidays</p>
      )}
    </div>
  );
}
