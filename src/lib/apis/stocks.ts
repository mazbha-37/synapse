export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  latestTradingDay: string;
}

export async function fetchStock(symbol: string): Promise<StockQuote> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error("ALPHA_VANTAGE_API_KEY is not configured");

  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) throw new Error("Failed to fetch stock data");
  const data = await response.json();

  if (data.Note) throw new Error("API rate limit reached. Alpha Vantage free tier: 25 req/day.");
  if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
    throw new Error(`Symbol "${symbol}" not found or no data available`);
  }

  const q = data["Global Quote"];
  const price = parseFloat(q["05. price"]);
  const change = parseFloat(q["09. change"]);
  const changePercent = parseFloat(q["10. change percent"].replace("%", ""));

  return {
    symbol: q["01. symbol"],
    name: q["01. symbol"],
    price,
    change,
    changePercent,
    high: parseFloat(q["03. high"]),
    low: parseFloat(q["04. low"]),
    volume: parseInt(q["06. volume"]).toLocaleString(),
    latestTradingDay: q["07. latest trading day"],
  };
}
