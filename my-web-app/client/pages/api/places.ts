import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Place = {
  name: string;
  vicinity?: string;
  place_id?: string;
  lat?: number;
  lng?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing lat or lng query parameters' });
    }

    // const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Google Places API key on server' });
    }

    // 10 miles in meters
    const radiusMeters = Math.round(10 * 1609.34);
    const location = `${encodeURIComponent(String(lat))},${encodeURIComponent(String(lng))}`;

    const types = ['grocery_or_supermarket'];
    const results: Place[] = [];

    // Helper to pause for Google Places next_page_token (API requires ~2s delay)
    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (const type of types) {
      let page = 0;
      let nextPageToken: string | undefined = undefined;
      do {
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radiusMeters}&type=${type}&key=${apiKey}`;
        if (nextPageToken) url += `&pagetoken=${nextPageToken}`;
        if (nextPageToken) await sleep(2000); // Google requires ~2s delay for next_page_token
        const r = await fetch(url);
        if (!r.ok) break;
        const data = await r.json();
        if (Array.isArray(data.results)) {
          for (const p of data.results) {
            results.push({
              name: p.name,
              vicinity: p.vicinity || p.formatted_address,
              place_id: p.place_id,
              lat: p.geometry?.location?.lat,
              lng: p.geometry?.location?.lng,
            });
          }
        }
        nextPageToken = data.next_page_token;
        page++;
      } while (nextPageToken && page < 3); // Google returns max 3 pages (60 results)
    }

    // Deduplicate by place_id
    const deduped = Array.from(new Map(results.map((p) => [p.place_id, p])).values());

    // Print deduped places to the server console for debugging
    console.log('Google Places API deduped results:', deduped);

    // Write JSON to public/json/places.json for local testing
    try {
      const publicDir = path.join(process.cwd(), 'my-web-app', 'client', 'public');
      const outDir = path.join(publicDir, 'json');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, 'places.json');
      fs.writeFileSync(outPath, JSON.stringify({ places: deduped }, null, 2), 'utf8');
    } catch (writeErr) {
      console.warn('Could not write places JSON file:', writeErr);
    }

    res.status(200).json({ places: deduped });
  } catch (err: any) {
    console.error('Places API error', err);
    res.status(500).json({ error: err?.message || String(err) });
  }
}

// Client-side fetch example (to be removed in production)
fetch('/api/places?lat=40.7128&lng=-74.0060').then(r=>r.json()).then(console.log)
