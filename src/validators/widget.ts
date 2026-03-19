import { z } from "zod";
import { WidgetType } from "@/types";

const widgetTypeSchema = z.enum(["weather", "news", "crypto", "github", "nasa", "air-quality", "forex", "stocks", "earthquake", "quote", "holidays"]);

export const weatherConfigSchema = z.object({
  city: z.string().min(1, "City is required"),
  units: z.enum(["metric", "imperial"]).default("metric"),
});

export const newsConfigSchema = z.object({
  category: z.string().default("general"),
  country: z.string().default("us"),
  maxArticles: z.number().min(1).max(10).default(5),
});

export const cryptoConfigSchema = z.object({
  coins: z.array(z.string()).min(1, "Select at least one coin"),
  currency: z.string().default("usd"),
});

export const githubConfigSchema = z.object({
  type: z.enum(["trending", "profile"]),
  username: z.string().optional(),
});

export const nasaConfigSchema = z.object({
  count: z.number().min(1).max(5).default(1),
});

export const airQualityConfigSchema = z.object({
  city: z.string().min(1, "City is required"),
});

export const createWidgetSchema = z.object({
  type: widgetTypeSchema,
  config: z.record(z.string(), z.unknown()),
  position: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
    w: z.number().default(4),
    h: z.number().default(3),
  }),
});

export const updateWidgetSchema = z.object({
  config: z.record(z.string(), z.unknown()).optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    })
    .optional(),
});

export function getWidgetConfigSchema(type: WidgetType) {
  switch (type) {
    case "weather":
      return weatherConfigSchema;
    case "news":
      return newsConfigSchema;
    case "crypto":
      return cryptoConfigSchema;
    case "github":
      return githubConfigSchema;
    case "nasa":
      return nasaConfigSchema;
    case "air-quality":
      return airQualityConfigSchema;
    default:
      return z.record(z.string(), z.unknown());
  }
}

export type CreateWidgetInput = z.infer<typeof createWidgetSchema>;
export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>;
