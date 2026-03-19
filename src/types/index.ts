import { Document } from "mongoose";

// Global mongoose cache for connection singleton
declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

// User Types
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  provider: "google" | "credentials";
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Types
export interface IDashboard extends Document {
  userId: import("mongoose").Types.ObjectId;
  name: string;
  description?: string;
  layout: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Widget Types
export type WidgetType = "weather" | "news" | "crypto" | "github" | "nasa" | "air-quality" | "forex" | "stocks" | "earthquake" | "quote" | "holidays";

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IWidget extends Document {
  dashboardId: import("mongoose").Types.ObjectId;
  type: WidgetType;
  config: Record<string, unknown>;
  position: WidgetPosition;
  lastFetchedAt?: Date;
  cachedData?: string;
  createdAt: Date;
}

// API Source Types
export type ApiStatus = "healthy" | "degraded" | "down";

export interface IApiSource extends Document {
  name: string;
  slug: string;
  baseUrl: string;
  status: ApiStatus;
  avgResponseMs: number;
  lastCheckedAt?: Date;
  dailyCallCount: number;
  dailyLimit: number;
  errorCount: number;
  lastErrorMessage?: string;
}

// AI Chat Types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IAiChat extends Document {
  userId: import("mongoose").Types.ObjectId;
  messages: ChatMessage[];
  widgetContext?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Audit Log Types
export interface IAuditLog extends Document {
  userId?: import("mongoose").Types.ObjectId;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Widget Data Types
export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: {
    date: string;
    tempMin: number;
    tempMax: number;
    icon: string;
    description: string;
  }[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  sparkline7d: number[];
}

export interface TrendingRepo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

export interface GitHubProfile {
  login: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  bio: string;
}

export interface NasaApod {
  title: string;
  explanation: string;
  url: string;
  hdUrl?: string;
  mediaType: "image" | "video";
  date: string;
  copyright?: string;
}

export interface AirQualityData {
  city: string;
  aqi: number;
  level: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  dominantPollutant: string;
  pm25: number;
  pm10: number;
  temperature?: number;
  humidity?: number;
  lastUpdated: string;
}

// Widget Config Types
export interface WeatherConfig {
  city: string;
  units: "metric" | "imperial";
}

export interface NewsConfig {
  category: string;
  country: string;
  maxArticles: number;
}

export interface CryptoConfig {
  coins: string[];
  currency: string;
}

export interface GitHubConfig {
  type: "trending" | "profile";
  username?: string;
}

export interface NasaConfig {
  count: number;
}

export interface AirQualityConfig {
  city: string;
}

export type WidgetConfig = WeatherConfig | NewsConfig | CryptoConfig | GitHubConfig | NasaConfig | AirQualityConfig;

// Grid Layout Types
export interface GridLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

// Admin Types
export interface UserStats {
  totalUsers: number;
  newUsersThisWeek: number;
  percentChange: number;
}

export interface WidgetStats {
  totalWidgets: number;
  widgetsByType: Record<WidgetType, number>;
}

export interface ApiHealthStats {
  slug: string;
  name: string;
  status: ApiStatus;
  avgResponseMs: number;
  dailyCallCount: number;
  dailyLimit: number;
  errorCount: number;
  lastCheckedAt?: Date;
}
