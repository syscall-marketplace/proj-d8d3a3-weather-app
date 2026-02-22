import axios from 'axios';
import type { WeatherData, WeatherApiResponse } from '../types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY as string;

function transformResponse(data: WeatherApiResponse): WeatherData {
  return {
    location: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
    timestamp: new Date(),
  };
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  if (!city.trim()) {
    throw new Error('City name cannot be empty');
  }

  try {
    const response = await axios.get<WeatherApiResponse>(API_BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return transformResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`City "${city}" not found`);
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
      throw new Error(`Failed to fetch weather data: ${error.response?.statusText ?? error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching weather data');
  }
}

export async function fetchWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  try {
    const response = await axios.get<WeatherApiResponse>(API_BASE_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return transformResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
      throw new Error(`Failed to fetch weather data: ${error.response?.statusText ?? error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching weather data');
  }
}
