import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';

type Place = {
  name: string;
  vicinity?: string;
  place_id?: string;
  lat?: number;
  lng?: number;
};

const Search: React.FC = () => {
  // Places API state
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Product search and Gemini AI state
  const [product, setProduct] = useState('');
  const [searching, setSearching] = useState(false);
  const [productResults, setProductResults] = useState<Record<string, any>>({}); // place_id -> result
  const [productErrors, setProductErrors] = useState<Record<string, string>>({});

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


  // Handler to search for product info at all places using Gemini
  const handleProductSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !places) return;
    setSearching(true);
    setProductResults({});
    setProductErrors({});
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI('AIzaSyDalK2IOVbk7EYafSNe1NeABXkblLfF09M');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      // For each place, send a prompt
      const results: Record<string, any> = {};
      const errors: Record<string, string> = {};
      for (const p of places) {
        const prompt = `For the store "${p.name}" at "${p.vicinity}", give me:\n- Product Price\n- Product Name\n- Product Description\n- Product Image url\nfor the product "${product}".`;
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = await response.text();
          results[p.place_id || p.name] = text;
        } catch (err: any) {
          errors[p.place_id || p.name] = err?.message || String(err);
        }
      }
      setProductResults(results);
      setProductErrors(errors);
    } catch (err) {
      // global error
      setProductErrors({ global: String(err) });
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">Search</h1>
        <p className="mt-4 text-lg">Search for products here.</p>


        {/* Product search section */}
        <div className="mt-8 w-full max-w-xl bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Product Search (Gemini AI)</h2>
          <form onSubmit={handleProductSearch} className="flex flex-col gap-4">
            <input
              type="text"
              className="border rounded px-3 py-2"
              placeholder="Enter product name (e.g. milk, bread)"
              value={product}
              onChange={e => setProduct(e.target.value)}
              disabled={searching}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={searching || !product}
            >
              {searching ? 'Searching...' : 'Search Product in All Stores'}
            </button>
          </form>
          {productErrors.global && <div className="text-red-500 mt-2">{productErrors.global}</div>}
        </div>

        {/* Places API and product results section */}
        <div className="mt-8 w-full max-w-xl bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Nearby Supermarkets & Groceries</h2>
          {error && <div className="text-red-500">{error}</div>}
          {loading && <div>Loading...</div>}
          {!loading && places && places.length === 0 && <div>No places found.</div>}
          {!loading && places && places.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {places.map((p) => (
                <li key={p.place_id || p.name} className="py-2">
                  <div>
                    <span className="font-medium">{p.name}</span>
                    {p.vicinity && <span className="text-gray-500 ml-2">({p.vicinity})</span>}
                  </div>
                  {product && (searching ? (
                    <div className="text-blue-500">Searching...</div>
                  ) : productResults[p.place_id || p.name] ? (
                    <div className="mt-2 whitespace-pre-line bg-gray-50 p-2 rounded">
                      {productResults[p.place_id || p.name]}
                    </div>
                  ) : productErrors[p.place_id || p.name] ? (
                    <div className="text-red-500 mt-2">{productErrors[p.place_id || p.name]}</div>
                  ) : null)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;