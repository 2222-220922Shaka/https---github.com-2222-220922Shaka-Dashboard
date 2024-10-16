import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import axios from 'axios'; // Import axios for making HTTP requests
import moment from 'moment'; // Import moment for date formatting
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Import necessary Leaflet components
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import L from 'leaflet'; // Import Leaflet library

// Fix the default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DayForecast({ location }) {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c'; // Replace with your weather API key
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;
      const result = await axios.get(url);
      setForecastData(result.data);
    };
    fetchForecast();
  }, [location]);

  if (!forecastData) {
    return <div>Loading forecast...</div>;
  }

  // Get data for the next 5 days at 12:00 PM
  const forecastItems = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));

  // Get the coordinates of the location
  const { lat, lon } = forecastData.city.coord;

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecastItems.map(item => (
          <div key={item.dt} className="forecast-item">
            <p>{moment(item.dt_txt).format('dddd')}</p>
            <img
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
            <p>{Math.round(item.main.temp)}°C</p>
            <p>{item.weather[0].description}</p>
          </div>
        ))}
      </div>

      {/* Map Section with box-shadow */}
      <div className="map-box">
        <MapContainer center={[lat, lon]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lon]}>
            <Popup>
              {location}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default DayForecast;
