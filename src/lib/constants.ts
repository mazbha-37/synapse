import { WidgetType } from "@/types";

export const WIDGET_TYPES: { type: WidgetType; name: string; description: string; icon: string }[] = [
  {
    type: "weather",
    name: "Weather",
    description: "Current weather and 5-day forecast for any city",
    icon: "CloudSun",
  },
  {
    type: "news",
    name: "News",
    description: "Latest headlines from various categories",
    icon: "Newspaper",
  },
  {
    type: "crypto",
    name: "Cryptocurrency",
    description: "Real-time crypto prices and market data",
    icon: "Bitcoin",
  },
  {
    type: "github",
    name: "GitHub",
    description: "Trending repositories or user profiles",
    icon: "Github",
  },
  {
    type: "nasa",
    name: "NASA APOD",
    description: "Astronomy Picture of the Day",
    icon: "Rocket",
  },
  {
    type: "air-quality",
    name: "Air Quality",
    description: "Real-time air quality index for any city",
    icon: "Wind",
  },
  {
    type: "forex",
    name: "Forex / Currency",
    description: "Live exchange rates for major currencies",
    icon: "DollarSign",
  },
  {
    type: "stocks",
    name: "Stock Market",
    description: "Real-time stock price and market data",
    icon: "TrendingUp",
  },
  {
    type: "earthquake",
    name: "Earthquakes",
    description: "Recent global seismic activity from USGS",
    icon: "Activity",
  },
  {
    type: "quote",
    name: "Quote of the Day",
    description: "Daily inspirational quote",
    icon: "Quote",
  },
  {
    type: "holidays",
    name: "Public Holidays",
    description: "Upcoming public holidays for any country",
    icon: "CalendarDays",
  },
];

export const WIDGET_DEFAULT_SIZES: Record<WidgetType, { w: number; h: number; minW: number; minH: number }> = {
  weather: { w: 6, h: 3, minW: 3, minH: 2 },
  news: { w: 6, h: 4, minW: 3, minH: 3 },
  crypto: { w: 6, h: 3, minW: 3, minH: 2 },
  github: { w: 6, h: 3, minW: 3, minH: 2 },
  nasa: { w: 6, h: 4, minW: 4, minH: 3 },
  "air-quality": { w: 6, h: 3, minW: 3, minH: 2 },
  forex:         { w: 6, h: 4, minW: 3, minH: 3 },
  stocks:        { w: 6, h: 3, minW: 3, minH: 2 },
  earthquake:    { w: 6, h: 4, minW: 4, minH: 3 },
  quote:         { w: 6, h: 3, minW: 3, minH: 2 },
  holidays:      { w: 6, h: 4, minW: 3, minH: 3 },
};

export const GRID_CONFIG = {
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4 },
  rowHeight: 100,
  isDraggable: true,
  isResizable: true,
  compactType: "vertical" as const,
};

export const NEWS_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
];

export const NEWS_COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
];

export const CRYPTO_COINS = [
  { value: "bitcoin", label: "Bitcoin (BTC)" },
  { value: "ethereum", label: "Ethereum (ETH)" },
  { value: "solana", label: "Solana (SOL)" },
  { value: "cardano", label: "Cardano (ADA)" },
  { value: "polkadot", label: "Polkadot (DOT)" },
  { value: "ripple", label: "XRP" },
  { value: "dogecoin", label: "Dogecoin (DOGE)" },
  { value: "chainlink", label: "Chainlink (LINK)" },
  { value: "polygon", label: "Polygon (MATIC)" },
  { value: "litecoin", label: "Litecoin (LTC)" },
];

export const CURRENCIES = [
  { value: "usd", label: "USD ($)" },
  { value: "eur", label: "EUR (€)" },
  { value: "gbp", label: "GBP (£)" },
  { value: "jpy", label: "JPY (¥)" },
];

export const API_SOURCES = {
  weather: {
    name: "OpenWeatherMap",
    slug: "weather",
    baseUrl: "https://api.openweathermap.org/data/2.5",
    dailyLimit: 1000000,
  },
  news: {
    name: "GNews",
    slug: "news",
    baseUrl: "https://gnews.io/api/v4",
    dailyLimit: 100,
  },
  crypto: {
    name: "CoinGecko",
    slug: "crypto",
    baseUrl: "https://api.coingecko.com/api/v3",
    dailyLimit: 10000,
  },
  github: {
    name: "GitHub",
    slug: "github",
    baseUrl: "https://api.github.com",
    dailyLimit: 5000,
  },
  nasa: {
    name: "NASA",
    slug: "nasa",
    baseUrl: "https://api.nasa.gov/planetary",
    dailyLimit: 1000,
  },
  "air-quality": {
    name: "AQICN",
    slug: "air-quality",
    baseUrl: "https://api.waqi.info",
    dailyLimit: 1000,
  },
};

export const AQI_LEVELS = [
  { max: 50, label: "Good", color: "#10B981" },
  { max: 100, label: "Moderate", color: "#F59E0B" },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "#F97316" },
  { max: 200, label: "Unhealthy", color: "#EF4444" },
  { max: 300, label: "Very Unhealthy", color: "#8B5CF6" },
  { max: 500, label: "Hazardous", color: "#7F1D1D" },
];

export function getAqiLevel(aqi: number): { label: string; color: string } {
  for (const level of AQI_LEVELS) {
    if (aqi <= level.max) {
      return { label: level.label, color: level.color };
    }
  }
  return { label: "Hazardous", color: "#7F1D1D" };
}
