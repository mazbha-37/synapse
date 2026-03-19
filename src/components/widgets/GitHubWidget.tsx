"use client";

import { useState, useEffect } from "react";
import { TrendingRepo, GitHubProfile } from "@/types";
import { WidgetSkeleton } from "../dashboard/WidgetWrapper";
import { formatCompactNumber } from "@/lib/utils";
import { Github, Star, GitFork, Users, BookOpen } from "lucide-react";

interface GitHubWidgetProps {
  config: { type?: string; username?: string };
}

export function GitHubWidget({ config }: GitHubWidgetProps) {
  const [trendingData, setTrendingData] = useState<TrendingRepo[]>([]);
  const [profileData, setProfileData] = useState<GitHubProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const type = config.type || "trending";
  const username = config.username || "";

  useEffect(() => {
    fetchGitHubData();
  }, [type, username]);

  const fetchGitHubData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/widgets/github?type=${type}&username=${encodeURIComponent(username)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub data");
      }

      const data = await response.json();

      if (type === "profile") {
        setProfileData(data);
      } else {
        setTrendingData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GitHub data");
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
        <Github className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (type === "profile" && profileData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={profileData.avatarUrl}
            alt={profileData.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <div className="font-medium text-lg">{profileData.name}</div>
            <div className="text-sm text-muted-foreground">@{profileData.login}</div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {profileData.bio}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="font-medium">{profileData.publicRepos}</div>
            <div className="text-xs text-muted-foreground">Repos</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
            </div>
            <div className="font-medium">{formatCompactNumber(profileData.followers)}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
            </div>
            <div className="font-medium">{formatCompactNumber(profileData.following)}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "trending" && trendingData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Github className="h-8 w-8 mb-2" />
        <p className="text-sm">No trending repositories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-auto">
      {trendingData.slice(0, 5).map((repo) => (
        <a
          key={repo.fullName}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm truncate">{repo.name}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {formatCompactNumber(repo.stars)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {repo.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {formatCompactNumber(repo.forks)}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
