export type WeatherCondition =
  | 'sunny'
  | 'cloudy'
  | 'snowing'
  | 'raining'
  | 'windy'
  | 'partly-cloudy'

export interface Resort {
  id: string
  name: string
  location: string
  coordinates?: {
    lat: number
    lon: number
  }
  currentTemp: number // in Fahrenheit
  weatherCondition: WeatherCondition
  precip24h: number // in inches
  precip48h: number // in inches
  baseSnow: number // in inches
  uvIndex: number // 0-11+ UV index
  windSpeed: number // mph
  liftsOpen: number
  totalLifts: number
}

