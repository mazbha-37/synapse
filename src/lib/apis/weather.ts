import { WeatherData } from "@/types";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(city: string, units: "metric" | "imperial" = "metric"): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not configured");
  }

  // Fetch current weather
  const currentResponse = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`,
    { next: { revalidate: 600 } }
  );

  if (!currentResponse.ok) {
    if (currentResponse.status === 404) {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error("Failed to fetch weather data");
  }

  const currentData = await currentResponse.json();

  // Fetch forecast
  const forecastResponse = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`,
    { next: { revalidate: 600 } }
  );

  if (!forecastResponse.ok) {
    throw new Error("Failed to fetch forecast data");
  }

  const forecastData = await forecastResponse.json();

  // Process forecast - get one entry per day (at noon)
  const dailyForecasts: typeof forecastData.list = [];
  const seenDates = new Set<string>();

  for (const item of forecastData.list) {
    const date = item.dt_txt.split(" ")[0];
    if (!seenDates.has(date) && item.dt_txt.includes("12:00")) {
      seenDates.add(date);
      dailyForecasts.push(item);
    }
    if (dailyForecasts.length >= 5) break;
  }

  return {
    city: currentData.name,
    country: currentData.sys.country,
    temp: Math.round(currentData.main.temp),
    feelsLike: Math.round(currentData.main.feels_like),
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
    forecast: dailyForecasts.map((item: { dt_txt: string; main: { temp_min: number; temp_max: number }; weather: { icon: string; description: string }[] }) => ({
      date: item.dt_txt.split(" ")[0],
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    })),
  };
}
