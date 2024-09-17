import React, { useState } from 'react';

const ports = [
  "Shanghai", "Singapore", "Rotterdam", "Antwerp", "Hamburg",
  "Los Angeles", "Long Beach", "Dubai", "Busan", "Hong Kong",
  "Mumbai", "Tokyo", "Sydney", "Cape Town", "New York"
];

function RouteInput({ onSubmit }) {
  const [startPort, setStartPort] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [speed, setSpeed] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startPort || !destinationPort || !speed) {
      alert("All fields must be filled");
      return;
    }
    setIsLoading(true);
    onSubmit(startPort, destinationPort, speed);
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading
  };

  return (
    <div className="route-input">
      <h2>Route Input</h2>
      <form onSubmit={handleSubmit}>
        <label>Start Port:</label>
        <select value={startPort} onChange={(e) => setStartPort(e.target.value)} required>
          <option value="" disabled>Select Start Port</option>
          {ports.map(port => <option key={port} value={port}>{port}</option>)}
        </select>
        
        <label>Destination Port:</label>
        <select value={destinationPort} onChange={(e) => setDestinationPort(e.target.value)} required>
          <option value="" disabled>Select Destination Port</option>
          {ports.map(port => <option key={port} value={port}>{port}</option>)}
        </select>
        
        <label>Speed (knots):</label>
        <input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} required />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Calculating..." : "Calculate Route"}
        </button>
      </form>
    </div>
  );
}

export default RouteInput;