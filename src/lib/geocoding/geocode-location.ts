interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface OpenStreetMapResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeLocation(searchQuery: string): Promise<GeocodeResult | null> {
  if (!searchQuery.trim()) {
    return null;
  }

  const query = new URLSearchParams({
    q: searchQuery,
    format: "json",
    limit: "1",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query.toString()}`, {
    headers: {
      "User-Agent": "worldestate-app/1.0",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as OpenStreetMapResult[];

  if (!payload.length) {
    return null;
  }

  const [firstResult] = payload;

  return {
    latitude: Number(firstResult.lat),
    longitude: Number(firstResult.lon),
    displayName: firstResult.display_name,
  };
}
