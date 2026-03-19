"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, AlertCircle } from "lucide-react";

interface ForexData {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CAD: "🇨🇦",
  AUD: "🇦🇺", CHF: "🇨🇭", CNY: "🇨🇳", INR: "🇮🇳", BDT: "🇧🇩",
  SGD: "🇸🇬", AED: "🇦🇪",
};

export function ForexWidget({ config }: { config: Record<string, unknown> }) {
  const [data, setData] = useState<ForexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (config.base as string) || "USD";

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/widgets/forex?base=${base}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [base]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
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

  const entries = Object.entries(data.rates);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CURRENCY_FLAGS[data.base] || "💱"}</span>
          <div>
            <p className="text-xs text-muted-foreground">Base currency</p>
            <p className="font-bold text-lg">{data.base}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          Live rates
        </div>
      </div>

      <div className="space-y-1 overflow-auto">
        {entries.map(([currency, rate]) => (
          <div
            key={currency}
            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-base w-6">{CURRENCY_FLAGS[currency] || "🏳️"}</span>
              <span className="text-sm font-medium">{currency}</span>
            </div>
            <span className="text-sm font-mono">
              {rate >= 100
                ? rate.toFixed(2)
                : rate >= 1
                ? rate.toFixed(4)
                : rate.toFixed(6)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
