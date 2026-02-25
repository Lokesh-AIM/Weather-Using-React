import React, { useEffect, useState } from 'react'
import './Weather.css'

import search_icon from '../assets/search.png'
import cloud_icon from '../assets/cloud.png'
import clear_icon from '../assets/clear.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {

  const [city, setCity] = useState('')
  const [weatherdata, setWeatherData] = useState(null)
  const [isCelsius, setIsCelsius] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentCities, setRecentCities] = useState([])

  const allIcons = {
    '01d': clear_icon,
    '01n': clear_icon,
    '02d': cloud_icon,
    '02n': cloud_icon,
    '03d': cloud_icon,
    '03n': cloud_icon,
    '04d': drizzle_icon,
    '04n': drizzle_icon,
    '09d': rain_icon,
    '09n': rain_icon,
    '10d': rain_icon,
    '10n': rain_icon,
    '13d': snow_icon,
    '13n': snow_icon,
  }

  const search = async (searchCity) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'City not found')
        setLoading(false)
        return
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon

      setWeatherData({
        city: data.name,
        temperature: Math.floor(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        icon
      })


      setRecentCities(prev =>
        [data.name, ...prev.filter(c => c !== data.name)].slice(0, 5)
      )

    } catch {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search('Bangalore')
  }, [])

  const displayTemp = () => {
    if (!weatherdata) return ''
    const c = weatherdata.temperature
    return isCelsius
      ? `${c}°C`
      : `${Math.round((c * 9) / 5 + 32)}°F`
  }

  return (
    <div className="weather">

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search(city)}
        />
        <img src={search_icon} onClick={() => search(city)} />
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      {weatherdata && !loading && (
        <>
          <img src={weatherdata.icon} className="weather-icon" />
          <p className="temperature">{displayTemp()}</p>

          <button
            className="unit-toggle"
            onClick={() => setIsCelsius(!isCelsius)}
          >
            {isCelsius ? 'Show °F' : 'Show °C'}
          </button>

          <p className="location">{weatherdata.city}</p>
          <p className="condition">{weatherdata.condition}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} />
              <div>
                <p>{weatherdata.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} />
              <div>
                <p>{weatherdata.windSpeed} km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>

          {recentCities.length > 0 && (
            <div className="recent">
              <p>Recent searches:</p>
              {recentCities.map(c => (
                <span key={c} onClick={() => search(c)}>{c}</span>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default Weather
