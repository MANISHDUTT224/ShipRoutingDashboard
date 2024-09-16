import React, { useState } from "react";
import Map from "./components/Map";
import RouteInput from "./components/RouteInput";
import RouteDetails from "./components/RouteDetails";
import Alerts from "./components/Alerts";
import './App.css';

function App() {
  const [route, setRoute] = useState([]);
  const [weatherPredictions, setWeatherPredictions] = useState([]);
  const [routeDetails, setRouteDetails] = useState({});

  return (
    <div className="App">
      <header className="App-header">
        <h1>Optimal Ship Routing System</h1>
      </header>
      <main>
        <section className="input-section">
          <RouteInput setRoute={setRoute} setWeatherPredictions={setWeatherPredictions} setRouteDetails={setRouteDetails} />
        </section>
        <section className="map-section">
          <Map route={route} weatherPredictions={weatherPredictions} />
        </section>
        <section className="details-section">
          <RouteDetails routeDetails={routeDetails} />
          <Alerts />
        </section>
      </main>
    </div>
  );
}

export default App;