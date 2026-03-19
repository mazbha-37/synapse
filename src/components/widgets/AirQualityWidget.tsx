"use client";

import { useState, useEffect } from "react";
import { AirQualityData } from "@/types";
import { WidgetSkeleton } from "../dashboard/WidgetWrapper";
import { Wind, Thermometer, Droplets } from "lucide-react";

interface AirQualityWidgetProps {
  config: { city?: string };
}

export function AirQualityWidget({ config }: AirQualityWidgetProps) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const city = config.city || "London";

  useEffect(() => {
    fetchAirQualityData();
  }, [city]);

  const fetchAirQualityData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/widgets/air-quality?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch air quality data");
      }

      const airQualityData = await response.json();
      setData(airQualityData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load air quality data");
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
        <Wind className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Wind className="h-8 w-8 mb-2" />
        <p className="text-sm">No air quality data available</p>
      </div>
    );
  }

  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return "#10B981"; // Good - Green
    if (aqi <= 100) return "#F59E0B"; // Moderate - Yellow
    if (aqi <= 150) return "#F97316"; // Unhealthy for Sensitive - Orange
    if (aqi <= 200) return "#EF4444"; // Unhealthy - Red
    if (aqi <= 300) return "#8B5CF6"; // Very Unhealthy - Purple
    return "#7F1D1D"; // Hazardous - Maroon
  };

  const getAqiLabel = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const aqiColor = getAqiColor(data.aqi);
  const aqiLabel = getAqiLabel(data.aqi);

  return (
    <div className="space-y-4">
      {/* AQI Display */}
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
          style={{ backgroundColor: aqiColor }}
        >
          {data.aqi}
        </div>
        <div>
          <div className="font-medium text-lg" style={{ color: aqiColor }}>
            {aqiLabel}
          </div>
          <div className="text-sm text-muted-foreground">{data.city}</div>
          <div className="text-xs text-muted-foreground">
            Dominant: {data.dominantPollutant.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">PM2.5</div>
          <div className="font-medium">{data.pm25} µg/m³</div>
        </div>
        <div className="p-2 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">PM10</div>
          <div className="font-medium">{data.pm10} µg/m³</div>
        </div>
      </div>

      {/* Weather Info */}
      {(data.temperature !== undefined || data.humidity !== undefined) && (
        <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
          {data.temperature !== undefined && (
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              <span>{data.temperature}°C</span>
            </div>
          )}
          {data.humidity !== undefined && (
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              <span>{data.humidity}%</span>
            </div>
          )}
        </div>
      )}

      {/* AQI Scale */}
      <div className="pt-2">
        <div className="text-xs text-muted-foreground mb-1">AQI Scale</div>
        <div className="h-2 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-[#10B981]" title="Good" />
          <div className="flex-1 bg-[#F59E0B]" title="Moderate" />
          <div className="flex-1 bg-[#F97316]" title="Unhealthy for Sensitive" />
          <div className="flex-1 bg-[#EF4444]" title="Unhealthy" />
          <div className="flex-1 bg-[#8B5CF6]" title="Very Unhealthy" />
          <div className="flex-1 bg-[#7F1D1D]" title="Hazardous" />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300</span>
          <span>500</span>
        </div>
      </div>
    </div>
  );
}
