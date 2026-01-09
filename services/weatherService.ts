import { Resort, WeatherCondition, DailyForecast } from '../types/resort'

// Open-Meteo API interfaces
interface OpenMeteoResponse {
  current: {
    temperature_2m: number // Celsius
    windspeed_10m: number // km/h
    weathercode: number
    uv_index: number
  }
  hourly: {
    time: string[]
    snowfall: number[] // cm
    temperature_2m: number[]
  }
  daily?: {
    time: string[]
    snowfall_sum: number[] // cm
    temperature_2m_max: number[] // Fahrenheit (when unit specified)
    temperature_2m_min: number[] // Fahrenheit (when unit specified)
    weathercode: number[]
    windspeed_10m_max: number[] // mph (when unit specified)
  }
}

// Convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9) / 5 + 32)
}

// Convert km/h to mph
const kmhToMph = (kmh: number): number => {
  return Math.round(kmh * 0.621371)
}

// Convert cm to inches
const cmToInches = (cm: number): number => {
  return Math.round((cm * 0.393701) * 10) / 10
}

// Map Open-Meteo weather codes to our WeatherCondition types
// Reference: https://open-meteo.com/en/docs
const mapWeatherCode = (code: number): WeatherCondition => {
  // 0: Clear sky
  if (code === 0) return 'sunny'
  
  // 1-3: Mainly clear, partly cloudy, and overcast
  if (code >= 1 && code <= 2) return 'partly-cloudy'
  if (code === 3) return 'cloudy'
  
  // 45, 48: Fog
  if (code === 45 || code === 48) return 'cloudy'
  
  // 51-67: Rain (drizzle, rain, freezing rain)
  if (code >= 51 && code <= 67) return 'raining'
  
  // 71-77, 85-86: Snow
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snowing'
  
  // 80-82: Rain showers
  if (code >= 80 && code <= 82) return 'raining'
  
  // 95-99: Thunderstorm
  if (code >= 95 && code <= 99) return 'raining'
  
  return 'partly-cloudy'
}

// Calculate snowfall from hourly data for a given time period
const calculateSnowfall = (times: string[], snowfall: number[], hours: number): number => {
  const now = new Date()
  const cutoffTime = new Date(now.getTime() - hours * 60 * 60 * 1000)
  
  let totalSnowfall = 0
  
  for (let i = 0; i < times.length; i++) {
    const time = new Date(times[i])
    if (time >= cutoffTime && time <= now) {
      totalSnowfall += snowfall[i] || 0
    }
  }
  
  return cmToInches(totalSnowfall)
}

export const fetchResortWeather = async (
  resort: Partial<Resort>
): Promise<Partial<Resort>> => {
  if (!resort.coordinates) {
    throw new Error('Resort coordinates are required')
  }

  const { lat, lon } = resort.coordinates

  try {
    // Open-Meteo API URL with all required parameters
    // Request past 72 hours of hourly data to calculate 24h and 48h snowfall
    // Also request 7-day daily forecast for snowfall and temperatures
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.append('latitude', lat.toString())
    url.searchParams.append('longitude', lon.toString())
    url.searchParams.append('current', 'temperature_2m,windspeed_10m,weathercode,uv_index')
    url.searchParams.append('hourly', 'snowfall,temperature_2m')
    url.searchParams.append('daily', 'snowfall_sum,temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max')
    url.searchParams.append('temperature_unit', 'fahrenheit')
    url.searchParams.append('windspeed_unit', 'mph')
    url.searchParams.append('past_hours', '72')
    url.searchParams.append('forecast_days', '7')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`)
    }

    const data: OpenMeteoResponse = await response.json()

    // Extract current conditions
    const currentTemp = Math.round(data.current.temperature_2m)
    const windSpeed = Math.round(data.current.windspeed_10m)
    const weatherCondition = mapWeatherCode(data.current.weathercode)
    const uvIndex = Math.round(data.current.uv_index)

    // Calculate snowfall from past 24h and 48h
    const precip24h = calculateSnowfall(data.hourly.time, data.hourly.snowfall, 24)
    const precip48h = calculateSnowfall(data.hourly.time, data.hourly.snowfall, 48)

    // Calculate high and low temperatures for today (next 24 hours)
    const futureTemps = data.hourly.temperature_2m.slice(0, 24)
    const highTemp = Math.round(Math.max(...futureTemps))
    const lowTemp = Math.round(Math.min(...futureTemps))

    // Build 7-day forecast from daily data
    let dailyForecast: DailyForecast[] | undefined
    if (data.daily) {
      dailyForecast = data.daily.time.map((date, i) => ({
        date,
        snowfall: cmToInches(data.daily!.snowfall_sum[i] || 0),
        tempHigh: Math.round(data.daily!.temperature_2m_max[i]),
        tempLow: Math.round(data.daily!.temperature_2m_min[i]),
        weatherCondition: mapWeatherCode(data.daily!.weathercode[i]),
        windSpeed: Math.round(data.daily!.windspeed_10m_max[i]),
      }))
    }

    return {
      currentTemp,
      highTemp,
      lowTemp,
      weatherCondition,
      precip24h,
      precip48h,
      uvIndex,
      windSpeed,
      dailyForecast,
    }
  } catch (error) {
    console.error(`Error fetching weather for resort:`, error)
    throw error
  }
}

export const fetchAllResortsWeather = async (
  resorts: Resort[]
): Promise<Resort[]> => {
  const weatherPromises = resorts.map(async (resort) => {
    try {
      const weatherData = await fetchResortWeather(resort)
      return {
        ...resort,
        ...weatherData,
      }
    } catch (error) {
      console.error(`Failed to fetch weather for ${resort.name}:`, error)
      // Return original resort data if weather fetch fails
      return resort
    }
  })

  return Promise.all(weatherPromises)
}

