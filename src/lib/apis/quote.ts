export interface QuoteData {
  text: string;
  author: string;
}

export async function fetchQuote(): Promise<QuoteData> {
  const response = await fetch(
    "https://zenquotes.io/api/today",
    { next: { revalidate: 86400 } }
  );

  if (!response.ok) throw new Error("Failed to fetch quote");
  const data = await response.json();

  if (!Array.isArray(data) || !data[0]) throw new Error("Invalid quote data");

  return {
    text: data[0].q,
    author: data[0].a,
  };
}
