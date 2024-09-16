import React, { useState } from 'react';

function RouteInput() {
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [speed, setSpeed] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Start:", startPoint, "Destination:", destination, "Speed:", speed);
    // Handle ship routing logic here
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
    </div>
  );
}

export default RouteInput;
