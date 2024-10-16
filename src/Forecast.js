import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Forecast = ({ location }) => {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';  // Replace with your weather API key
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;
      const result = await axios.get(url);
      setForecastData(result.data);
    };
    fetchForecast();
  }, [location]);

  if (!forecastData) {
    return <div>Loading forecast...</div>;
  }

  // Extract hourly forecast for the current day
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime() / 1000;
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime() / 1000;

  const hourlyForecast = forecastData.list.filter((entry) => {
    const entryTime = entry.dt;
    return entryTime >= todayStart && entryTime <= todayEnd;
  });

  return (
    <div className="forecast">
      <h3>Hourly Forecast:</h3>
      <div className="hourly-forecast">
        {hourlyForecast.map((hour, index) => {
          const date = new Date(hour.dt * 1000);
          const hours = date.getHours();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; // Convert to 12-hour format
          
          return (
            <div key={index} className="hour">
              <p>{formattedHours} {ampm}</p>
              <p>{Math.round(hour.main.temp)}°C</p>
              <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt={hour.weather[0].description} />
              <p>{hour.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;