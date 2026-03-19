import { NewsArticle } from "@/types";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_BASE_URL = "https://gnews.io/api/v4";

export async function fetchNews(
  category = "general",
  country = "us",
  max = 5
): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    throw new Error("GNews API key is not configured");
  }

  const response = await fetch(
    `${GNEWS_BASE_URL}/top-headlines?category=${category}&lang=en&country=${country}&max=${max}&apikey=${GNEWS_API_KEY}`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    // Try fallback to NewsData.io if GNews fails
    return fetchNewsFallback(category, country, max);
  }

  const data = await response.json();

  return data.articles.map((article: {
    title: string;
    description: string;
    url: string;
    image: string;
    source: { name: string };
    publishedAt: string;
  }) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    source: article.source.name,
    publishedAt: article.publishedAt,
  }));
}

async function fetchNewsFallback(
  category = "general",
  country = "us",
  max = 5
): Promise<NewsArticle[]> {
  // NewsData.io as fallback (requires NEWSDATA_API_KEY env var)
  const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
  if (!NEWSDATA_API_KEY) {
    return getMockNewsData();
  }
  const BASE_URL = "https://newsdata.io/api/1/news";

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${NEWSDATA_API_KEY}&country=${country}&category=${category}&size=${max}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news from fallback source");
    }

    const data = await response.json();

    return data.results.map((article: {
      title: string;
      description: string;
      link: string;
      image_url: string;
      source_id: string;
      pubDate: string;
    }) => ({
      title: article.title,
      description: article.description || "",
      url: article.link,
      image: article.image_url || "",
      source: article.source_id,
      publishedAt: article.pubDate,
    }));
  } catch {
    // Return mock data if both APIs fail
    return getMockNewsData();
  }
}

function getMockNewsData(): NewsArticle[] {
  return [
    {
      title: "Technology Advances in AI Continue to Accelerate",
      description: "New developments in artificial intelligence are transforming industries worldwide...",
      url: "#",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
      source: "Tech Daily",
      publishedAt: new Date().toISOString(),
    },
    {
      title: "Global Climate Summit Reaches New Agreement",
      description: "World leaders have agreed on ambitious new targets for carbon reduction...",
      url: "#",
      image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400",
      source: "World News",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      title: "Space Exploration: New Mission to Mars Announced",
      description: "NASA and international partners announce collaborative mission...",
      url: "#",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
      source: "Space Today",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}
