import { useState } from 'react';
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import clearDay from "@meteocons/lottie/fill/clear-day.json";
import cloudy from "@meteocons/lottie/fill/cloudy.json";
import rain from "@meteocons/lottie/fill/rain.json";
import snow from "@meteocons/lottie/fill/snow.json";
import thunderstorm from "@meteocons/lottie/fill/thunderstorms.json";
import './App.css';



function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const iconRef = useRef(null); 


useEffect(() => {
  if (!weather || !iconRef.current) return;
 
  iconRef.current.innerHTML = "";

  let animationData = clearDay;

  const code = weather.weather_code;

  if (code === 0) {
    animationData = clearDay;
  } else if ([1, 2, 3].includes(code)) {
    animationData = cloudy;
  } else if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82)
  ) {
    animationData = rain;
  } else if (code >= 71 && code <= 77) {
    animationData = snow;
  } else if (code >= 95 && code <= 99) {
    animationData = thunderstorm;
  }

  const animation = lottie.loadAnimation({
    container: iconRef.current,
    renderer: "svg",
    animationData,
    loop: true,
    autoplay: true,
  });

  return () => animation.destroy();
}, [weather]);
  


  async function searchWeather() {
    console.log("Search button clicked");

    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      if (!data.results || data.results.length === 0) {
        setError("No city found");
        return;
      }

      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;


      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`;
      
      
  

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      setWeather(weatherData.current);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (

    
  <div className="app-container">
    <h1>Weather App</h1>
    
    <form onSubmit={(e) => { e.preventDefault(); searchWeather(); }} className="search-form">
      <input 
        type="text" 
        placeholder="Enter your city" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>

    {/* LOADING */}
    {loading && <p className="loading-text">Loading...</p>}

    {/* ERROR */}
    {error && <p className="error-text">{error}</p>}

    {/* WEATHER */}
    {weather && (
      <div className="weather-card">
        <div
  ref={iconRef}
  style={{
    width: "150px",
    height: "150px",
    margin: "0 auto",
  }}
></div>
        <h2>Weather Info</h2>
        <div className="weather-details">
          <p className="weather-item">
            <span>Temperature:</span> 
            <span className="weather-value">{weather.temperature_2m}°C</span>
          </p>
          <p className="weather-item">
            <span>Wind Speed:</span> 
            <span className="weather-value">{weather.wind_speed_10m} km/h</span>
          </p>
        </div>
      </div>
    )}
  </div>
);

}

export default App;