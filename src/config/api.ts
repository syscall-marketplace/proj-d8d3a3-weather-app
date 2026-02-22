export const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  API_KEY: 'your-api-key-here', // Replace with actual API key
  UNITS: 'metric'
} as const;

export const ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  GEOCODING: 'https://api.openweathermap.org/geo/1.0/direct'
} as const;