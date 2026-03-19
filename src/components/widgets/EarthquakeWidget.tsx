"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface EarthquakeEvent {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  depth: number;
  url: string;
}

function getMagColor(mag: number): string {
  if (mag >= 7) return "bg-red-600 text-white";
  if (mag >= 6) return "bg-orange-500 text-white";
  if (mag >= 5) return "bg-yellow-500 text-black";
  return "bg-green-500 text-white";
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

export function EarthquakeWidget({ config }: { config: Record<string, unknown> }) {
  const [data, setData] = useState<EarthquakeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = (config.limit as number) || 5;
  const minMag = (config.minMagnitude as number) || 4;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/widgets/earthquake?limit=${limit}&minMagnitude=${minMag}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [limit, minMag]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
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

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">No earthquakes found for the given filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((eq) => (
        <div key={eq.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0", getMagColor(eq.magnitude))}>
            {eq.magnitude.toFixed(1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{eq.place}</p>
            <p className="text-xs text-muted-foreground">
              Depth: {eq.depth} km · {formatTimeAgo(eq.time)}
            </p>
          </div>
          <a href={eq.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ))}
      <p className="text-xs text-muted-foreground text-center pt-1">Source: USGS · No API key needed</p>
    </div>
  );
}
