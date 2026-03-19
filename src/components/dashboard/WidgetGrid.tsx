"use client";

import { useCallback } from "react";
import { ResponsiveGridLayout, verticalCompactor, useContainerWidth } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import { IWidget, GridLayoutItem } from "@/types";
import { WidgetWrapper } from "./WidgetWrapper";
import { WeatherWidget } from "../widgets/WeatherWidget";
import { NewsWidget } from "../widgets/NewsWidget";
import { CryptoWidget } from "../widgets/CryptoWidget";
import { GitHubWidget } from "../widgets/GitHubWidget";
import { NasaWidget } from "../widgets/NasaWidget";
import { AirQualityWidget } from "../widgets/AirQualityWidget";
import { ForexWidget } from "../widgets/ForexWidget";
import { StocksWidget } from "../widgets/StocksWidget";
import { EarthquakeWidget } from "../widgets/EarthquakeWidget";
import { QuoteWidget } from "../widgets/QuoteWidget";
import { HolidaysWidget } from "../widgets/HolidaysWidget";
import { GRID_CONFIG, WIDGET_DEFAULT_SIZES } from "@/lib/constants";
import { debounce } from "@/lib/utils";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface WidgetGridProps {
  widgets: IWidget[];
  layout: string;
  onLayoutChange: (layout: unknown[]) => void;
  onRemoveWidget: (widgetId: string) => void;
  onQuickInsight: (widget: IWidget) => void;
  refreshKey: number;
}

const widgetComponents: Record<string, React.ComponentType<{ config: Record<string, unknown> }>> = {
  weather: WeatherWidget,
  news: NewsWidget,
  crypto: CryptoWidget,
  github: GitHubWidget,
  nasa: NasaWidget,
  "air-quality": AirQualityWidget,
  forex: ForexWidget,
  stocks: StocksWidget,
  earthquake: EarthquakeWidget,
  quote: QuoteWidget,
  holidays: HolidaysWidget,
};

export function WidgetGrid({
  widgets,
  layout,
  onLayoutChange,
  onRemoveWidget,
  onQuickInsight,
  refreshKey,
}: WidgetGridProps) {
  const { width, containerRef } = useContainerWidth({ initialWidth: 1200 });

  const parsedLayout: GridLayoutItem[] = layout ? JSON.parse(layout) : [];

  const gridLayout: Layout = widgets.map((widget) => {
    const savedItem = parsedLayout.find((item) => item.i === widget._id.toString());
    const defaultSize = WIDGET_DEFAULT_SIZES[widget.type];

    return {
      i: widget._id.toString(),
      x: savedItem?.x ?? widget.position.x,
      y: savedItem?.y ?? widget.position.y,
      w: savedItem?.w ?? widget.position.w ?? defaultSize.w,
      h: savedItem?.h ?? widget.position.h ?? defaultSize.h,
      minW: defaultSize.minW,
      minH: defaultSize.minH,
    };
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLayoutChange = useCallback(
    debounce((newLayout: unknown) => {
      onLayoutChange(newLayout as unknown[]);
    }, 300),
    [onLayoutChange]
  );

  return (
    <div ref={containerRef}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: gridLayout }}
        breakpoints={GRID_CONFIG.breakpoints}
        cols={GRID_CONFIG.cols}
        rowHeight={GRID_CONFIG.rowHeight}
        compactor={verticalCompactor}
        onLayoutChange={debouncedLayoutChange as (layout: Layout) => void}
        margin={[16, 16]}
        width={width}
      >
        {widgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type];

          return (
            <div key={widget._id.toString()} className="h-full">
              <WidgetWrapper
                widget={widget}
                onRemove={() => onRemoveWidget(widget._id.toString())}
                onQuickInsight={() => onQuickInsight(widget)}
              >
                {WidgetComponent && (
                  // Key changes on refreshKey to force remount & re-fetch
                  <WidgetComponent
                    key={`${widget._id}-${refreshKey}`}
                    config={widget.config}
                  />
                )}
              </WidgetWrapper>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
