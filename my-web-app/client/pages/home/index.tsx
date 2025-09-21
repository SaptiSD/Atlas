import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';

type Place = {
  name: string;
  vicinity?: string;
  place_id?: string;
  lat?: number;
  lng?: number;
};

const Home: React.FC = () => {
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fetch(`/api/places?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch places from API');
            return res.json();
          })
          .then((data) => {
            if (data && Array.isArray(data.places)) {
              setPlaces(data.places);
              setError(null);
            } else {
              setError('No places found in API response');
            }
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      },
      (geoError) => {
        setError('Could not get geolocation: ' + geoError.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="mt-4 text-lg">This is the homepage of your Next.js application.</p>
        <div className="mt-8 w-full max-w-xl bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Nearby Supermarkets & Groceries</h2>
          {error && <div className="text-red-500">{error}</div>}
          {loading && <div>Loading...</div>}
          {!loading && places && places.length === 0 && <div>No places found.</div>}
          {!loading && places && places.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {places.map((p) => (
                <li key={p.place_id || p.name} className="py-2">
                  <span className="font-medium">{p.name}</span>
                  {p.vicinity && <span className="text-gray-500 ml-2">({p.vicinity})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;