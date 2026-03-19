"use client";

import { useState, useEffect } from "react";
import { CoinData } from "@/types";
import { WidgetSkeleton } from "../dashboard/WidgetWrapper";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { Bitcoin, TrendingUp, TrendingDown } from "lucide-react";

interface CryptoWidgetProps {
  config: { coins?: string[]; currency?: string };
}

export function CryptoWidget({ config }: CryptoWidgetProps) {
  const [data, setData] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coins = config.coins || ["bitcoin", "ethereum", "solana"];
  const currency = config.currency || "usd";

  useEffect(() => {
    fetchCryptoData();
  }, [coins, currency]);

  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/widgets/crypto?coins=${coins.join(",")}&currency=${currency}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cryptocurrency data");
      }

      const cryptoData = await response.json();
      setData(cryptoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load crypto data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <WidgetSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive">
        <Bitcoin className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Bitcoin className="h-8 w-8 mb-2" />
        <p className="text-sm">No cryptocurrency data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((coin) => (
        <div
          key={coin.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium text-sm">{coin.name}</div>
              <div className="text-xs text-muted-foreground uppercase">
                {coin.symbol}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-sm">
              {formatCurrency(coin.currentPrice, currency)}
            </div>
            <div
              className={`text-xs flex items-center justify-end gap-1 ${
                coin.priceChangePercentage24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {coin.priceChangePercentage24h >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
            </div>
          </div>
        </div>
      ))}

      {/* Mini Sparkline */}
      {data[0]?.sparkline7d && (
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">7-Day Trend (BTC)</div>
          <Sparkline data={data[0].sparkline7d} />
        </div>
      )}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  });

  const isPositive = data[data.length - 1] >= data[0];
  const color = isPositive ? "#10B981" : "#EF4444";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points={`0,100 ${points.join(" ")} 100,100`}
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  );
}
