import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ route, weatherPredictions }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // Reference for the Leaflet map instance

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map('map').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing layers (Polylines and Markers)
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.Circle) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add route to map
    if (route && route.length > 0) {
      const polyline = L.polyline(route, { color: 'red' }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.fitBounds(polyline.getBounds());

      // Add markers for start and end points
      L.marker(route[0]).addTo(mapInstanceRef.current).bindPopup('Start');
      L.marker(route[route.length - 1]).addTo(mapInstanceRef.current).bindPopup('End');

      // Add weather information
      if (weatherPredictions && weatherPredictions.length > 0) {
        weatherPredictions.forEach((weather, index) => {
          if (index % 5 === 0 && index < route.length) { // Add weather info every 5 points, ensure index is within bounds
            L.circle(route[index], {
              color: 'blue',
              fillColor: '#30f',
              fillOpacity: 0.5,
              radius: weather.wave_height * 10000
            }).addTo(mapInstanceRef.current).bindPopup(
              `Wave Height: ${weather.wave_height.toFixed(2)}m<br>Wind Speed: ${weather.wind_speed.toFixed(2)} knots`
            );
          }
        });
      }
    }
  }, [route, weatherPredictions]);

  // Cleanup the map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="map-container">
      <h2>Route Map</h2>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}

export default Map;
