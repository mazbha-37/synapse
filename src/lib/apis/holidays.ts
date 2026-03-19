export interface Holiday {
  date: string;
  name: string;
  localName: string;
  types: string[];
}

export async function fetchHolidays(countryCode: string = "US"): Promise<Holiday[]> {
  const year = new Date().getFullYear();
  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toUpperCase()}`,
    { next: { revalidate: 86400 } }
  );

  if (!response.ok) throw new Error(`Failed to fetch holidays for ${countryCode}`);
  const data = await response.json();

  if (!Array.isArray(data)) throw new Error("Invalid holiday data");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Return upcoming holidays first, then past ones
  const upcoming = data.filter((h: { date: string }) => new Date(h.date) >= today);
  const past = data.filter((h: { date: string }) => new Date(h.date) < today);

  return [...upcoming, ...past].map((h: { date: string; name: string; localName: string; types: string[] }) => ({
    date: h.date,
    name: h.name,
    localName: h.localName,
    types: h.types,
  }));
}
