"use client";

import { useState, useEffect } from "react";
import { NewsArticle } from "@/types";
import { WidgetSkeleton } from "../dashboard/WidgetWrapper";
import { truncateText, formatRelativeTime } from "@/lib/utils";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsWidgetProps {
  config: { category?: string; country?: string; maxArticles?: number };
}

export function NewsWidget({ config }: NewsWidgetProps) {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = config.category || "general";
  const country = config.country || "us";
  const maxArticles = config.maxArticles || 5;

  useEffect(() => {
    fetchNewsData();
  }, [category, country, maxArticles]);

  const fetchNewsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/widgets/news?category=${category}&country=${country}&max=${maxArticles}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news data");
      }

      const newsData = await response.json();
      setData(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news data");
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
        <Newspaper className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Newspaper className="h-8 w-8 mb-2" />
        <p className="text-sm">No news articles available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-auto">
      {data.map((article, index) => (
        <a
          key={index}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
              <Newspaper className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
              {truncateText(article.description || "", 60)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{article.source}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(article.publishedAt)}
              </span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}
