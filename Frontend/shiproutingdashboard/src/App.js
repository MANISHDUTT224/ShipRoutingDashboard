// import React, { useState } from "react";
// import Map from "./components/Map";
// import RouteInput from "./components/RouteInput";
// import RouteDetails from "./components/RouteDetails";
// import Alerts from "./components/Alerts";
// import './App.css';

// function App() {
//   const [routeDetails, setRouteDetails] = useState(null);

//   const handleRouteSubmit = (startPort, destinationPort, speed) => {
//     console.log("Start Port:", startPort, "Destination Port:", destinationPort, "Speed:", speed);
//     // Here, you can fetch the calculated route from your backend and update the state.
//     setRouteDetails({
//       start: startPort,
//       destination: destinationPort,
//       speed,
//       distance: 500,
//       eta: "24 hours",
//       fuel: "2000 liters"
//     });
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Optimal Ship Routing System</h1>
//       </header>
//       <main>
//         <section className="input-section">
//           <RouteInput onSubmit={handleRouteSubmit} />
//         </section>
//         {routeDetails && (
//           <section className="details-section">
//             <Map />
//             <RouteDetails details={routeDetails} />
//             <Alerts />
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;
import React, { useState } from "react";
import Map from "./components/Map";
import RouteInput from "./components/RouteInput";
import RouteDetails from "./components/RouteDetails";
import Alerts from "./components/Alerts";
import './App.css';

function App() {
  const [routeDetails, setRouteDetails] = useState(null);
  const [optimalRoute, setOptimalRoute] = useState([]);

  const handleRouteSubmit = (startPort, destinationPort, speed) => {
    console.log("Start Port:", startPort, "Destination Port:", destinationPort, "Speed:", speed);
    
    // Simulated backend route calculation
    const route = calculateMockRoute(startPort, destinationPort); 
    setOptimalRoute(route);

    setRouteDetails({
      start: startPort,
      destination: destinationPort,
      speed,
      distance: 500,
      eta: "24 hours",
      fuel: "2000 liters"
    });
  };

  const calculateMockRoute = (start, destination) => {
    // This function simulates the backend route calculation, you can replace it with real logic
    return [
      { lat: 0, lon: -50 },
      { lat: 10, lon: -40 },
      { lat: 20, lon: -30 },
      { lat: 30, lon: 30 }  // Example route points
    ];
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Optimal Ship Routing System</h1>
      </header>
      <main>
        <section className="input-section">
          <RouteInput onSubmit={handleRouteSubmit} />
        </section>
        {routeDetails && (
          <section className="details-section">
            <Map route={optimalRoute} />
            <RouteDetails details={routeDetails} />
            <Alerts />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
