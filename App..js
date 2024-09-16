import React from "react";
import Map from "./components/Map";
import RouteInput from "./components/RouteInput";
import RouteDetails from "./components/RouteDetails";
import Alerts from "./components/Alerts";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Optimal Ship Routing System</h1>
      </header>
      <main>
        <section className="input-section">
          <RouteInput />
        </section>
        <section className="map-section">
          <Map />
        </section>
        <section className="details-section">
          <RouteDetails />
          <Alerts />
        </section>
      </main>
    </div>
  );
}

export default App;
