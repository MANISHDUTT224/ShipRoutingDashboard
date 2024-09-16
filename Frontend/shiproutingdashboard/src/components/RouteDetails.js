import React from 'react';

function RouteDetails({ routeDetails }) {
  return (
    <div className="route-details">
      <h2>Route Details</h2>
      <p>Distance: {routeDetails.distance?.toFixed(2)} nautical miles</p>
      <p>ETA: {routeDetails.eta?.toFixed(2)} hours</p>
      <p>Fuel Consumption: {routeDetails.fuelConsumption?.toFixed(2)} tons</p>
    </div>
  );
}

export default RouteDetails;