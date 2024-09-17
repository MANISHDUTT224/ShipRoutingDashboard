import React from 'react';

function RouteDetails({ details }) {
  return (
    <div className="route-details">
      <h2>Route Details</h2>
      <p><strong>Start Port:</strong> {details.start}</p>
      <p><strong>Destination:</strong> {details.destination}</p>
      <p><strong>Speed:</strong> {details.speed} knots</p>
      <p><strong>Distance:</strong> {details.distance} nautical miles</p>
      <p><strong>ETA:</strong> {details.eta}</p>
      <p><strong>Fuel Consumption:</strong> {details.fuel}</p>
    </div>
  );
}

export default RouteDetails;
