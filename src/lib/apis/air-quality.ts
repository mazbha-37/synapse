import { AirQualityData } from "@/types";
import { getAqiLevel } from "@/lib/constants";

const API_KEY = process.env.AQICN_API_KEY;
const BASE_URL = "https://api.waqi.info";

export async function fetchAirQuality(city: string): Promise<AirQualityData> {
  if (!API_KEY) {
    throw new Error("AQICN API key is not configured");
  }

  const response = await fetch(
    `${BASE_URL}/feed/${encodeURIComponent(city)}/?token=${API_KEY}`,
    { next: { revalidate: 600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch air quality data");
  }

  const data = await response.json();

  if (data.status !== "ok") {
    if (data.data === "Unknown station") {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error("Failed to fetch air quality data");
  }

  const aqi = data.data.aqi;
  const iaqi = data.data.iaqi || {};
  const level = getAqiLevel(aqi);

  return {
    city: data.data.city.name,
    aqi,
    level: level.label as AirQualityData["level"],
    dominantPollutant: data.data.dominentpol || "pm25",
    pm25: iaqi.pm25?.v || 0,
    pm10: iaqi.pm10?.v || 0,
    temperature: iaqi.t?.v,
    humidity: iaqi.h?.v,
    lastUpdated: data.data.time.iso,
  };
}
