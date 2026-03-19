import { CoinData } from "@/types";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchCrypto(
  coins = ["bitcoin", "ethereum", "solana"],
  currency = "usd"
): Promise<CoinData[]> {
  const ids = coins.join(",");

  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrency data");
  }

  const data = await response.json();

  return data.map((coin: {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap: number;
    sparkline_in_7d: { price: number[] };
  }) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    currentPrice: coin.current_price,
    priceChange24h: coin.price_change_24h,
    priceChangePercentage24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    sparkline7d: coin.sparkline_in_7d?.price || [],
  }));
}
