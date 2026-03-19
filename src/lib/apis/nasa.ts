import { NasaApod } from "@/types";

const API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov/planetary";

export async function fetchApod(count = 1): Promise<NasaApod[]> {
  const url =
    count === 1
      ? `${BASE_URL}/apod?api_key=${API_KEY}`
      : `${BASE_URL}/apod?api_key=${API_KEY}&count=${count}`;

  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error("Failed to fetch NASA APOD data");
  }

  const data = await response.json();

  // If count is 1, API returns a single object, not an array
  const items = count === 1 ? [data] : data;

  return items.map((item: {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: "image" | "video";
    date: string;
    copyright?: string;
  }) => ({
    title: item.title,
    explanation: item.explanation,
    url: item.url,
    hdUrl: item.hdurl,
    mediaType: item.media_type,
    date: item.date,
    copyright: item.copyright,
  }));
}
