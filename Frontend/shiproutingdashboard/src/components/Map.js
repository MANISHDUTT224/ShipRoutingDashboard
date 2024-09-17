import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ensure Leaflet default icon images are properly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to adjust map view
function AdjustView({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map(([lon, lat]) => [lat, lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, route]);
  return null;
}

function Map() {
  const [startPoint, setStartPoint] = useState([0, -50]);
  const [endPoint, setEndPoint] = useState([30, 30]);
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (setter) => (e) => {
    try {
      const [lat, lon] = e.target.value.split(',').map(Number);
      if (isNaN(lat) || isNaN(lon)) throw new Error('Invalid input');
      setter([lat, lon]);
    } catch (err) {
      setError('Please enter valid coordinates (lat,lon)');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/calculate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startPoint, endPoint }),
      });
      if (!response.ok) throw new Error('Failed to calculate route');
      const data = await response.json();
      setRoute(data.route);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to calculate route: ${error.message}');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Optimal Ship Route on Leaflet Map</h1>
      <div>
        <label>Start Point (lat,lon):</label>
        <input
          type="text"
          value={startPoint.join(',')}
          onChange={handleInputChange(setStartPoint)}
        />
        <label>End Point (lat,lon):</label>
        <input
          type="text"
          value={endPoint.join(',')}
          onChange={handleInputChange(setEndPoint)}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Calculate Route'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={startPoint}>
          <Popup>Start Point</Popup>
        </Marker>
        <Marker position={endPoint}>
          <Popup>End Point</Popup>
        </Marker>
        {route && (
          <Polyline positions={route.map(([lon, lat]) => [lat, lon])} color="blue" />
        )}
        <AdjustView route={route} />
      </MapContainer>
    </div>
  );
}

export default Map;