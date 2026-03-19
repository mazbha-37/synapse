"use client";

import { useState, useEffect } from "react";
import { WeatherData } from "@/types";
import { WidgetSkeleton } from "../dashboard/WidgetWrapper";
import { formatDate } from "@/lib/utils";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherWidgetProps {
  config: { city?: string; units?: string };
}

export function WeatherWidget({ config }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const city = config.city || "London";
  const units = config.units || "metric";

  useEffect(() => {
    fetchWeatherData();
  }, [city, units]);

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/widgets/weather?city=${encodeURIComponent(city)}&units=${units}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData = await response.json();
      setData(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather data");
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
        <Cloud className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Cloud className="h-8 w-8 mb-2" />
        <p className="text-sm">No weather data available</p>
      </div>
    );
  }

  const tempUnit = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "m/s" : "mph";

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">
            {data.temp}
            {tempUnit}
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {data.description}
          </div>
          <div className="text-xs text-muted-foreground">
            {data.city}, {data.country}
          </div>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-16 h-16"
        />
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Thermometer className="h-3 w-3" />
          <span>Feels like {data.feelsLike}{tempUnit}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Droplets className="h-3 w-3" />
          <span>{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Wind className="h-3 w-3" />
          <span>{data.windSpeed} {speedUnit}</span>
        </div>
      </div>

      {/* Forecast */}
      {data.forecast.length > 0 && (
        <div className="border-t pt-3">
          <div className="text-xs font-medium mb-2">5-Day Forecast</div>
          <div className="grid grid-cols-5 gap-1">
            {data.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground">
                  {formatDate(day.date, "EEE")}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-8 h-8 mx-auto"
                />
                <div className="text-xs">
                  {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
