import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="alerts">
      <h2>Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index} className={'alert-${alert.severity}'}>
            {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Alerts;