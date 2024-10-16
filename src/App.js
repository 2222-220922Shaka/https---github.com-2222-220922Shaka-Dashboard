import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import Forecast from './Forecast';
import News from './News';
import DayForecast from './DayForecast';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(''); // Location will be fetched dynamically
  const [activeTab, setActiveTab] = useState('weather');
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // To hold the error message

  // Automatically detect the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          setLocation('Cape Town'); // Fallback to default if geolocation fails
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setLocation('Cape Town'); // Fallback if geolocation isn't available
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c'; // Replace with your weather API key
        let url;

        // If location is an object with lat and lon, use reverse geocoding
        if (location.lat && location.lon) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`;
        } else {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
        }

        try {
          const result = await axios.get(url);

          // Check for valid response (city not found will return an error)
          if (result.data.cod !== 200) {
            throw new Error('City not found');
          }

          setWeatherData(result.data);
          setErrorMessage(''); // Clear the error message on successful fetch
        } catch (error) {
          setWeatherData(null); // Reset weatherData if city is invalid
          setErrorMessage('City does not exist. Please try again with a valid city name.');
        }
      }
    };

    fetchWeather();
  }, [location]);

  const handleLocationChange = (event) => {
    setInputValue(event.target.value);
    if (event.key === 'Enter' && inputValue.trim()) {
      setLocation(inputValue.trim());
      setInputValue(''); // Clear the input after search
    }
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      setLocation(inputValue.trim());
      setInputValue(''); // Clear the input after search
    }
  };

  if (!weatherData && !errorMessage) {
    return <div>Loading...</div>;
  }

  // Get the weather icon URL
  const weatherIcon = weatherData ? `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` : '';

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1>Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a city..."
            value={inputValue}
            onChange={handleLocationChange}
            onKeyDown={handleLocationChange}
          />
          <button onClick={handleSearchClick}>Search</button>
        </div>

        <div className="tabs">
          <button onClick={() => setActiveTab('weather')} className={activeTab === 'weather' ? 'active' : ''}>
            Weather
          </button>
          <button onClick={() => setActiveTab('DayForecast')} className={activeTab === 'DayForecast' ? 'active' : ''}>
            5-Day Forecast
          </button>
          <button onClick={() => setActiveTab('news')} className={activeTab === 'news' ? 'active' : ''}>
            News
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>{weatherData ? weatherData.name : 'City not found'}</h2>
          <h3>
            {moment().format('HH:mm')}
            <br />
            {moment().format('dddd, D MMM')}
          </h3>
        </div>

        {errorMessage ? (
          <div className="error-container">
            <p className="error-message">{errorMessage}</p>
          </div>
        ) : (
          <>
            {activeTab === 'weather' && weatherData && (
              <div className="weather-info card">
                <h1>{Math.round(weatherData.main.temp)}°C</h1>
                <img src={weatherIcon} alt={weatherData.weather[0].description} />
                <h3>{weatherData.weather[0].description}</h3>
                <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Wind Speed: {weatherData.wind.speed} km/h</p>
                <Forecast location={weatherData.name} />
              </div>
            )}

            {activeTab === 'news' && weatherData && <News location={weatherData.name} />}
            {activeTab === 'DayForecast' && weatherData && <DayForecast location={weatherData.name} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
