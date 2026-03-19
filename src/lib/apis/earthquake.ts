export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  depth: number;
  latitude: number;
  longitude: number;
  url: string;
  felt?: number;
}

export async function fetchEarthquakes(limit: number = 5, minMagnitude: number = 4): Promise<EarthquakeEvent[]> {
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=${limit}&minmagnitude=${minMagnitude}&orderby=time`;

  const response = await fetch(url, { next: { revalidate: 600 } });
  if (!response.ok) throw new Error("Failed to fetch earthquake data");

  const data = await response.json();

  return data.features.map((f: { id: string; properties: { mag: number; place: string; time: number; url: string; felt: number }; geometry: { coordinates: number[] } }) => ({
    id: f.id,
    magnitude: f.properties.mag,
    place: f.properties.place,
    time: new Date(f.properties.time).toISOString(),
    depth: Math.round(f.geometry.coordinates[2]),
    latitude: f.geometry.coordinates[1],
    longitude: f.geometry.coordinates[0],
    url: f.properties.url,
    felt: f.properties.felt,
  }));
}
