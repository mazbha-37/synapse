"use client";

import { useState, useEffect } from "react";
import { NasaApod } from "@/types";
import { WidgetSkeleton } from "../dashboard/WidgetWrapper";
import { Rocket, Calendar, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface NasaWidgetProps {
  config: { count?: number };
}

export function NasaWidget({ config }: NasaWidgetProps) {
  const [data, setData] = useState<NasaApod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<NasaApod | null>(null);

  const count = config.count || 1;

  useEffect(() => {
    fetchNasaData();
  }, [count]);

  const fetchNasaData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/widgets/nasa?count=${count}`);

      if (!response.ok) {
        throw new Error("Failed to fetch NASA data");
      }

      const nasaData = await response.json();
      setData(nasaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load NASA data");
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
        <Rocket className="h-8 w-8 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Rocket className="h-8 w-8 mb-2" />
        <p className="text-sm">No NASA data available</p>
      </div>
    );
  }

  const currentApod = data[0];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative cursor-pointer group overflow-hidden rounded-lg"
        onClick={() => setSelectedImage(currentApod)}
      >
        {currentApod.mediaType === "image" ? (
          <img
            src={currentApod.url}
            alt={currentApod.title}
            className="w-full h-40 object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-40 bg-muted flex items-center justify-center">
            <Rocket className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs font-medium line-clamp-1">{currentApod.title}</p>
        </div>
      </div>

      {/* Info */}
      <div>
        <h4 className="font-medium text-sm line-clamp-1">{currentApod.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{currentApod.date}</span>
          {currentApod.copyright && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Camera className="h-3 w-3" />
                {currentApod.copyright}
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3 mt-2">
          {currentApod.explanation}
        </p>
      </div>

      {/* Thumbnails if multiple */}
      {data.length > 1 && (
        <div className="flex gap-2 pt-2 border-t">
          {data.slice(1).map((apod, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => setSelectedImage(apod)}
            >
              {apod.mediaType === "image" ? (
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
            <DialogDescription>
              {selectedImage?.date}
              {selectedImage?.copyright && ` • ${selectedImage.copyright}`}
            </DialogDescription>
          </DialogHeader>
          {selectedImage?.mediaType === "image" && (
            <img
              src={selectedImage.hdUrl || selectedImage.url}
              alt={selectedImage.title}
              className="w-full rounded-lg"
            />
          )}
          <p className="text-sm text-muted-foreground">{selectedImage?.explanation}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
