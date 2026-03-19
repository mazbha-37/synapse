export interface ForexData {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BDT", "SGD", "AED"];

export async function fetchForex(base: string = "USD"): Promise<ForexData> {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey) throw new Error("EXCHANGERATE_API_KEY is not configured");

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base.toUpperCase()}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) throw new Error("Failed to fetch exchange rates");
  const data = await response.json();

  if (data.result !== "success") throw new Error(data["error-type"] || "API error");

  const filtered: Record<string, number> = {};
  for (const cur of POPULAR_CURRENCIES) {
    if (data.conversion_rates[cur] && cur !== base.toUpperCase()) {
      filtered[cur] = data.conversion_rates[cur];
    }
  }

  return {
    base: base.toUpperCase(),
    rates: filtered,
    lastUpdated: data.time_last_update_utc,
  };
}
