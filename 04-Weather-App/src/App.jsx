import { useState } from 'react';
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import fog from "@meteocons/lottie/fill/fog.json";
import mist from "@meteocons/lottie/fill/mist.json";
import drizzle from "@meteocons/lottie/fill/drizzle.json";
import hail from "@meteocons/lottie/fill/hail.json";
import partlyCloudyDay from "@meteocons/lottie/fill/partly-cloudy-day.json";
import partlyCloudyNight from "@meteocons/lottie/fill/partly-cloudy-night.json";
import clearDay from "@meteocons/lottie/fill/clear-day.json";
import clearNight from "@meteocons/lottie/fill/clear-night.json";
import cloudy from "@meteocons/lottie/fill/cloudy.json";
import rain from "@meteocons/lottie/fill/rain.json";
import snow from "@meteocons/lottie/fill/snow.json";
import thunderstorm from "@meteocons/lottie/fill/thunderstorms.json";
import './App.css';



function App() {
  const [city, setCity] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [sunProgress, setSunProgress] = useState(0);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const iconRef = useRef(null); 



  useEffect(() => {
  getCurrentLocation();
}, []);





useEffect(() => {
  if (!weather || !iconRef.current) return;
 
  iconRef.current.innerHTML = "";

  let animationData = partlyCloudyNight;


const code = weather.weather_code;
console.log("is_day:", weather.is_day);
console.log("weather_code:", code);

if (code === 0) {
   animationData = weather.is_day
    ? clearDay
     : clearNight;
   

  

} else if (code === 1) {
  // Mainly clear
   animationData = weather.is_day
    ? partlyCloudyDay
    : partlyCloudyNight;

} else if (code === 2) {
  // Partly cloudy
  animationData = weather.is_day
    ? partlyCloudyDay
    : partlyCloudyNight;

} else if (code === 3) {
  // Overcast
  animationData = cloudy;


} else if (code === 45) {
  // Fog
  animationData = fog;

} else if (code === 48) {
  // Depositing rime fog
  animationData = mist;

} else if (code >= 51 && code <= 57) {
  // Drizzle
  animationData = drizzle;

} else if (code >= 61 && code <= 67) {
  // Rain
  animationData = rain;

} else if (code >= 71 && code <= 77) {
  // Snow
  animationData = snow;

} else if (code >= 80 && code <= 82) {
  // Rain showers
  animationData = rain;

} else if (code === 85 || code === 86) {
  // Snow showers
  animationData = snow;

} else if (code === 95) {
  // Thunderstorm
  animationData = thunderstorm;

} else if (code === 96 || code === 99) {
  // Thunderstorm with hail
  animationData = hail;

} else {
  // Fallback
  animationData = cloudy;
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




useEffect(() => {
  if (!sunrise || !sunset) return;

  const updateSunPosition = () => {
    const now = new Date();

    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);

    const progress =
      (now - sunriseTime) / (sunsetTime - sunriseTime);

    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    setSunProgress(clampedProgress);
  };

  updateSunPosition();

  const timer = setInterval(updateSunPosition, 60000);

  return () => clearInterval(timer);

}, [sunrise, sunset]);

async function getCurrentLocation() {
  try {
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

               setLatitude(latitude);
               setLongitude(longitude);

        console.log("GPS Latitude:", latitude);
        console.log("GPS Longitude:", longitude);


        // Get city name from coordinates
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}`
        );

        const data = await response.json();

        console.log(data);


        // Set city if available
        if (data.results && data.results.length > 0) {
          setCity(data.results[0].name);
        } else {
          setCity("Current Location");
        }


        getWeatherByCoordinates(latitude, longitude);

      },

      async (error) => {

        console.log("GPS Error:", error.message);

        // FALLBACK TO IP LOCATION
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();

        console.log("IP Location:", data.city);

        setCity(data.city);

        getWeatherByCoordinates(
          data.latitude,
          data.longitude
        );

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );


  } catch (err) {
    setError("Unable to detect your location");
  } finally {
    setLoading(false);
  }
}

async function getWeatherByCoordinates( latitude,longitude ) {
      
  try{
    setLoading(true);
     
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code,is_day&daily=sunrise,sunset&timezone=auto`;
      

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
  
          setSunrise(weatherData.daily.sunrise[0]);
            setSunset(weatherData.daily.sunset[0]);

        setWeather(weatherData.current);
  } catch(err){
    setError("Unabel to get the Current location Weather");

  } finally {
    setLoading(false);
  }
}


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


      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code,is_day&daily=sunrise,sunset&timezone=auto`;
      
      
  

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      console.log(weatherData.daily);

      setSunrise(weatherData.daily.sunrise[0]);
      setSunset(weatherData.daily.sunset[0]);

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
<div className="sun-path">

  <div
  className="sun"
  style={{
    left: `${sunProgress * 100}%`,
    bottom: `${Math.sin(sunProgress * Math.PI) * 150}px`,
    opacity: Math.sin(sunProgress * Math.PI),
    transform: "translateX(-50%)"
  }}
>
  ☀️
  </div>

  <span className="sunrise-label">
    <img src="sunrise-svgrepo-com (1).svg" alt="" width={50}/>
    {sunrise && sunrise.slice(11,16)}
  </span>

  <span className="sunset-label">
    <img src="sunset.svg" alt="" width={50}/>
     {sunset && sunset.slice(11,16)}
  </span>

</div>
        <h2>Weather Info</h2>
        <div className="weather-details">
          <p className="weather-item">
             <span>Sunrise:</span>
          <span className="weather-value">
         {sunrise && sunrise.slice(11,16)}
            </span>
           </p>

<p className="weather-item">
  <span>Sunset:</span>
  <span className="weather-value">
    {sunset && sunset.slice(11,16)}
  </span>
</p>
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