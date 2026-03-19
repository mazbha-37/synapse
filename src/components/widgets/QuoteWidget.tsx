"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Quote } from "lucide-react";

interface QuoteData {
  text: string;
  author: string;
}

export function QuoteWidget({ config: _ }: { config: Record<string, unknown> }) {
  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/widgets/quote")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-1/3 mt-4" />
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

  return (
    <div className="flex flex-col justify-between h-full py-2">
      <div className="flex-1">
        <Quote className="h-8 w-8 text-primary/30 mb-3" />
        <p className="text-base leading-relaxed italic font-medium">
          &ldquo;{data.text}&rdquo;
        </p>
      </div>
      <div className="mt-4 pt-3 border-t">
        <p className="text-sm font-semibold text-primary">— {data.author}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Quote of the day · ZenQuotes</p>
      </div>
    </div>
  );
}
