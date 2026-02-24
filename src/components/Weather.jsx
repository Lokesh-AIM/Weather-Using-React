import React, { useEffect, useRef, useState } from 'react'
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

  const inputRef = useRef()

  const [weatherdata, setWeatherData] = useState(null)
  const [isCelsius, setIsCelsius] = useState(true) // 🔹 added

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

  const search = async (city) => {
    if (city === '') {
      alert('Enter City Name')
      return
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        alert(data.message)
        return
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        tempreature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      })

    } catch (error) {
      console.error('Error in fetching weather data')
      setWeatherData(null)
    }
  }

  useEffect(() => {
    search('Bangalore')
  }, [])

  const displayTemp = () => {
    if (!weatherdata) return ''
    return isCelsius
      ? `${weatherdata.tempreature}°C`
      : `${Math.round((weatherdata.tempreature * 9) / 5 + 32)}°F`
  }

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search city' />
        <img src={search_icon} onClick={() => search(inputRef.current.value)} />
      </div>

      {weatherdata ? <>
        <img src={weatherdata.icon} alt="" className='weather-icon' />

        <p className='temperature'>{displayTemp()}</p>

        {/* 🔹 added button only */}
        <button
          className="unit-toggle"
          onClick={() => setIsCelsius(!isCelsius)}
        >
          {isCelsius ? 'Show °F' : 'Show °C'}
        </button>

        <p className='location'>{weatherdata.location}</p>

        <div className="weather-data">
          <div className="col">
            <img src={humidity_icon} alt="" />
            <div>
              <p>{weatherdata.humidity}%</p>
              <span>Humidity</span>
            </div>
          </div>

          <div className="col">
            <img src={wind_icon} alt="" />
            <div>
              <p>{weatherdata.windSpeed} km/h</p>
              <span>Wind speed</span>
            </div>
          </div>
        </div>
      </> : null}

    </div>
  )
}

export default Weather