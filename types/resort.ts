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
  currentTemp: number // in Fahrenheit
  weatherCondition: WeatherCondition
  precip24h: number // in inches
  precip48h: number // in inches
  baseSnow: number // in inches
  uxIndex: number // 0-100 score
  windSpeed: number // mph
  liftsOpen: number
  totalLifts: number
}

