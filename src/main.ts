import { fetchWeatherByCity, fetchWeatherByCoords } from './services/weatherService';
import { getCurrentLocation } from './services/geolocationService';
import { renderWeatherData, showLoading, hideLoading, showError } from './components/weatherDisplay';
import { setupSearchHandler } from './handlers/searchHandler';

function initApp(): void {
  const weatherDisplay = document.getElementById('weather-display');
  const loadingContainer = document.getElementById('loading');
  const errorContainer = document.getElementById('error');
  const cityInput = document.getElementById('city-input') as HTMLInputElement | null;
  const searchBtn = document.getElementById('search-btn');
  const locationBtn = document.getElementById('location-btn');

  if (!weatherDisplay || !loadingContainer || !errorContainer || !cityInput || !searchBtn || !locationBtn) {
    console.error('Required DOM elements not found');
    return;
  }

  function clearDisplays(): void {
    weatherDisplay!.innerHTML = '';
    errorContainer!.classList.add('hidden');
    errorContainer!.innerHTML = '';
  }

  async function handleCitySearch(city: string): Promise<void> {
    clearDisplays();
    showLoading(loadingContainer!);

    try {
      const weatherData = await fetchWeatherByCity(city);
      hideLoading(loadingContainer!);
      renderWeatherData(weatherData, weatherDisplay!);
    } catch (error) {
      hideLoading(loadingContainer!);
      const message = error instanceof Error ? error.message : 'Failed to fetch weather data';
      showError(message, errorContainer!);
    }
  }

  async function handleLocationSearch(): Promise<void> {
    clearDisplays();
    showLoading(loadingContainer!);

    try {
      const coords = await getCurrentLocation();
      const weatherData = await fetchWeatherByCoords(coords.latitude, coords.longitude);
      hideLoading(loadingContainer!);
      renderWeatherData(weatherData, weatherDisplay!);
    } catch (error) {
      hideLoading(loadingContainer!);
      const message = error instanceof Error ? error.message : 'Failed to fetch weather data';
      showError(message, errorContainer!);
    }
  }

  setupSearchHandler({
    cityInput,
    searchBtn,
    locationBtn,
    onCitySearch: handleCitySearch,
    onLocationSearch: handleLocationSearch,
  });
}

document.addEventListener('DOMContentLoaded', initApp);
