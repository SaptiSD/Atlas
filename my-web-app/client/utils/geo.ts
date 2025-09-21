export function requestLocationOncePerSession(): void {
  try {
    if (typeof window === 'undefined') return;
    const key = 'atlas:geo:requested';
    if (sessionStorage.getItem(key)) return;
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      sessionStorage.setItem(key, 'unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log('User location:', { latitude: lat, longitude: lon });
        sessionStorage.setItem(key, 'granted');

        // Fetch nearby supermarkets/groceries from our API route
        try {
          fetch(`/api/places?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lon)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data && Array.isArray(data.places)) {
                console.log('Nearby supermarkets/groceries (10 mile radius):');
                data.places.forEach((p: any) => console.log(p.name, '-', p.vicinity));
              } else {
                console.warn('No places returned from API', data);
              }
            })
            .catch((err) => console.warn('Error fetching places:', err));
        } catch (err) {
          console.warn('Fetch to /api/places failed:', err);
        }
      },
      (error) => {
        console.warn('Could not get geolocation:', error.message);
        sessionStorage.setItem(key, 'denied');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  } catch (err) {
    console.warn('Error requesting location:', err);
  }
}
