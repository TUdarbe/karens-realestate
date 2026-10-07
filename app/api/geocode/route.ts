// Address -> lat/lng for the listings map. The Amplify feed we have access to
// does not include Latitude/Longitude, so we geocode with OpenStreetMap
// Nominatim. Its usage policy allows ~1 request/second and requires caching,
// so requests are serialized and results are kept in memory.

type Point = { lat: number; lng: number } | null;

const cache = new Map<string, Point>();
let queue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

async function nominatim(q: string): Promise<Point> {
  const wait = Math.max(0, lastRequestAt + 1100 - Date.now());
  if (wait) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ca&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "KayBolesaRealEstate/1.0 (listing map)" },
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (!res.ok) return null;
  const [hit] = (await res.json()) as { lat: string; lon: string }[];
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
}

async function geocode(q: string): Promise<Point> {
  if (cache.has(q)) return cache.get(q)!;
  const job = queue.then(async () => {
    if (cache.has(q)) return cache.get(q)!;
    let point = await nominatim(q);
    // Fall back to the postal code if the full street address isn't found.
    const postal = q.match(/[A-Z]\d[A-Z] ?\d[A-Z]\d/i)?.[0];
    if (!point && postal) point = await nominatim(`${postal}, Ontario`);
    cache.set(q, point);
    return point;
  });
  queue = job.catch(() => null);
  return job;
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length > 200) return Response.json({ error: "Missing q" }, { status: 400 });
  try {
    return Response.json(await geocode(q), {
      headers: { "Cache-Control": "public, max-age=2592000" },
    });
  } catch {
    return Response.json(null);
  }
}
