"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { WIDGET_TYPES, NEWS_CATEGORIES, NEWS_COUNTRIES, CRYPTO_COINS, CURRENCIES } from "@/lib/constants";
import { WidgetType } from "@/types";
import { CloudSun, Newspaper, Bitcoin, Github, Rocket, Wind, ChevronRight, ArrowLeft, DollarSign, TrendingUp, Activity, Quote, CalendarDays } from "lucide-react";

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (type: string, config: Record<string, unknown>) => void;
}

const widgetIcons: Record<WidgetType, typeof CloudSun> = {
  weather: CloudSun,
  news: Newspaper,
  crypto: Bitcoin,
  github: Github,
  nasa: Rocket,
  "air-quality": Wind,
  forex: DollarSign,
  stocks: TrendingUp,
  earthquake: Activity,
  quote: Quote,
  holidays: CalendarDays,
};

export function AddWidgetDialog({ open, onOpenChange, onAddWidget }: AddWidgetDialogProps) {
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null);
  const [config, setConfig] = useState<Record<string, unknown>>({});

  const handleAdd = () => {
    if (selectedType) {
      onAddWidget(selectedType, config);
      onOpenChange(false);
      setSelectedType(null);
      setConfig({});
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedType(null);
      setConfig({});
    }
    onOpenChange(open);
  };

  const renderConfigForm = () => {
    switch (selectedType) {
      case "weather":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city name (e.g., London)"
                value={(config.city as string) || ""}
                onChange={(e) => setConfig({ ...config, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Select
                value={(config.units as string) || "metric"}
                onValueChange={(value) => setConfig({ ...config, units: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Celsius (°C)</SelectItem>
                  <SelectItem value="imperial">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "news":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={(config.category as string) || "general"}
                onValueChange={(value) => setConfig({ ...config, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={(config.country as string) || "us"}
                onValueChange={(value) => setConfig({ ...config, country: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxArticles">Max Articles</Label>
              <Input
                id="maxArticles"
                type="number"
                min={1}
                max={10}
                value={(config.maxArticles as number) || 5}
                onChange={(e) => setConfig({ ...config, maxArticles: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case "crypto":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Coins</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {CRYPTO_COINS.map((coin) => (
                  <div key={coin.value} className="flex items-center gap-2">
                    <Checkbox
                      id={coin.value}
                      checked={((config.coins as string[]) || []).includes(coin.value)}
                      onCheckedChange={(checked) => {
                        const currentCoins = (config.coins as string[]) || [];
                        if (checked) {
                          setConfig({ ...config, coins: [...currentCoins, coin.value] });
                        } else {
                          setConfig({ ...config, coins: currentCoins.filter((c) => c !== coin.value) });
                        }
                      }}
                    />
                    <label htmlFor={coin.value} className="text-sm cursor-pointer">
                      {coin.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={(config.currency as string) || "usd"}
                onValueChange={(value) => setConfig({ ...config, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "github":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Tabs
                value={(config.type as string) || "trending"}
                onValueChange={(value) => setConfig({ ...config, type: value })}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="trending">Trending Repos</TabsTrigger>
                  <TabsTrigger value="profile">User Profile</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {(config.type as string) === "profile" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter GitHub username"
                  value={(config.username as string) || ""}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case "nasa":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of Images</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={5}
                value={(config.count as number) || 1}
                onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Number of recent Astronomy Pictures of the Day to display (1–5)
              </p>
            </div>
          </div>
        );

      case "air-quality":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city name (e.g., London)"
                value={(config.city as string) || ""}
                onChange={(e) => setConfig({ ...config, city: e.target.value })}
              />
            </div>
          </div>
        );

      case "forex":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base">Base Currency</Label>
              <Select
                value={(config.base as string) || "USD"}
                onValueChange={(value) => setConfig({ ...config, base: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["USD","EUR","GBP","JPY","CAD","AUD","CHF","CNY","INR","BDT","SGD","AED"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Shows rates of major currencies against your base. Needs EXCHANGERATE_API_KEY.</p>
            </div>
          </div>
        );

      case "stocks":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL, TSLA, MSFT, GOOGL"
                value={(config.symbol as string) || ""}
                onChange={(e) => setConfig({ ...config, symbol: e.target.value.toUpperCase() })}
              />
              <p className="text-xs text-muted-foreground">US stock ticker symbol. Needs ALPHA_VANTAGE_API_KEY (25 req/day free).</p>
            </div>
          </div>
        );

      case "earthquake":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minMagnitude">Minimum Magnitude</Label>
              <Select
                value={String((config.minMagnitude as number) || 4)}
                onValueChange={(v) => setConfig({ ...config, minMagnitude: parseFloat(v ?? "4") })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.5">2.5+ (Minor)</SelectItem>
                  <SelectItem value="4">4.0+ (Light)</SelectItem>
                  <SelectItem value="5">5.0+ (Moderate)</SelectItem>
                  <SelectItem value="6">6.0+ (Strong)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Number of Results</Label>
              <Input
                id="limit"
                type="number"
                min={3}
                max={10}
                value={(config.limit as number) || 5}
                onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">No API key required — powered by USGS.</p>
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Displays a daily inspirational quote. No configuration needed.
            </p>
            <p className="text-xs text-muted-foreground">No API key required — powered by ZenQuotes.</p>
          </div>
        );

      case "holidays":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country</Label>
              <Select
                value={(config.countryCode as string) || "US"}
                onValueChange={(v) => setConfig({ ...config, countryCode: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[
                    { code: "US", label: "🇺🇸 United States" },
                    { code: "GB", label: "🇬🇧 United Kingdom" },
                    { code: "BD", label: "🇧🇩 Bangladesh" },
                    { code: "CA", label: "🇨🇦 Canada" },
                    { code: "AU", label: "🇦🇺 Australia" },
                    { code: "IN", label: "🇮🇳 India" },
                    { code: "DE", label: "🇩🇪 Germany" },
                    { code: "FR", label: "🇫🇷 France" },
                    { code: "JP", label: "🇯🇵 Japan" },
                    { code: "SG", label: "🇸🇬 Singapore" },
                    { code: "AE", label: "🇦🇪 UAE" },
                    { code: "PK", label: "🇵🇰 Pakistan" },
                  ].map(({ code, label }) => (
                    <SelectItem key={code} value={code}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">No API key required — powered by Nager.Date.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget type and configure it to display on your dashboard.
          </DialogDescription>
        </DialogHeader>

        {!selectedType ? (
          <div className="grid grid-cols-2 gap-2 py-2">
            {WIDGET_TYPES.map((widget) => {
              const Icon = widgetIcons[widget.type];
              return (
                <button
                  key={widget.type}
                  type="button"
                  className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/60 hover:bg-accent/50 transition-all text-left w-full"
                  onClick={() => setSelectedType(widget.type)}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-1">{widget.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                      {widget.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedType(null); setConfig({}); }}
              className="gap-1.5 -ml-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to widget types
            </Button>

            {renderConfigForm()}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={
                  (selectedType === "weather" && !config.city) ||
                  (selectedType === "crypto" && !(config.coins as string[])?.length) ||
                  (selectedType === "github" && config.type === "profile" && !config.username) ||
                  (selectedType === "air-quality" && !config.city) ||
                  (selectedType === "stocks" && !config.symbol)
                }
              >
                Add Widget
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
