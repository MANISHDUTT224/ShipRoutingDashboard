import React, { useState } from 'react';
import axios from 'axios';

function RouteInput() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [speed, setSpeed] = useState('');
  const [routeData, setRouteData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/calculate-route', {
      startPoint,
      destination,
      speed
    })
    .then(response => {
      setRouteData(response.data);
    })
    .catch(error => {
      console.error('There was an error calculating the route!', error);
    });
  };

  return (
    <div className="route-input">
      <h2>Route Input</h2>
      <form onSubmit={handleSubmit}>
        <label>Start Point:</label>
        <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} required />

        <label>Destination:</label>
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />

        <label>Speed (knots):</label>
        <input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} required />

        <button type="submit">Calculate Route</button>
      </form>

      {routeData && (
        <div className="route-details">
          <h2>Route Details</h2>
          <p>Distance: {routeData.distance} nautical miles</p>
          <p>ETA: {routeData.eta} hours</p>
          <p>Fuel Consumption: {routeData.fuelConsumption} liters</p>
        </div>
      )}
    </div>
  );
}

export default RouteInput;
