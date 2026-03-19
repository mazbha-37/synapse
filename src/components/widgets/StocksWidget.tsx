"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, AlertCircle, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  latestTradingDay: string;
}

export function StocksWidget({ config }: { config: Record<string, unknown> }) {
  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const symbol = (config.symbol as string) || "AAPL";

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/widgets/stocks?symbol=${symbol}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
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

  if (!data) return null;

  const isPositive = data.change >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{data.symbol}</span>
          </div>
          <p className="text-3xl font-bold mt-1">${data.price.toFixed(2)}</p>
        </div>
        <div className={cn("flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold", isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {isPositive ? "+" : ""}{data.change.toFixed(2)} ({isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Day High", value: `$${data.high.toFixed(2)}` },
          { label: "Day Low", value: `$${data.low.toFixed(2)}` },
          { label: "Volume", value: data.volume },
          { label: "Last Trade", value: data.latestTradingDay },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/40 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Data via Alpha Vantage · 25 req/day free
      </p>
    </div>
  );
}
