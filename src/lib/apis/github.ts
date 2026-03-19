import { TrendingRepo, GitHubProfile } from "@/types";

const BASE_URL = "https://api.github.com";

export async function fetchTrendingRepos(): Promise<TrendingRepo[]> {
  // Calculate date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().split("T")[0];

  const response = await fetch(
    `${BASE_URL}/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=10`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending repositories");
  }

  const data = await response.json();

  return data.items.map((repo: {
    name: string;
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    html_url: string;
  }) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "No description",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || "Unknown",
    url: repo.html_url,
  }));
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`User "${username}" not found`);
    }
    throw new Error("Failed to fetch GitHub profile");
  }

  const data = await response.json();

  return {
    login: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    bio: data.bio || "No bio",
  };
}
