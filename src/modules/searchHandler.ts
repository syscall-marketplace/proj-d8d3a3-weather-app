import { fetchWeatherByCity, fetchWeatherByCoords } from '../services/weatherService';
import { getCurrentLocation } from '../services/geolocationService';
import { renderWeatherData, showLoading, showError } from '../components/weatherDisplay';

export function setupSearchHandlers(): void {
  const cityInput = document.getElementById('city-input') as HTMLInputElement | null;
  const searchBtn = document.getElementById('search-btn') as HTMLButtonElement | null;
  const locationBtn = document.getElementById('location-btn') as HTMLButtonElement | null;
  const weatherDisplay = document.getElementById('weather-display') as HTMLElement | null;
  const loadingEl = document.getElementById('loading') as HTMLElement | null;
  const errorEl = document.getElementById('error') as HTMLElement | null;

  if (!cityInput || !searchBtn || !locationBtn || !weatherDisplay) {
    return;
  }

  async function handleCitySearch(): Promise<void> {
    const city = cityInput!.value.trim();

    if (!city) {
      if (errorEl) showError('Please enter a city name.', errorEl);
      return;
    }

    clearResults();
    if (loadingEl) showLoading(loadingEl);
    setButtonsDisabled(true);

    try {
      const data = await fetchWeatherByCity(city);
      if (loadingEl) {
        loadingEl.innerHTML = '';
        loadingEl.classList.add('hidden');
      }
      renderWeatherData(data, weatherDisplay!);
      weatherDisplay!.classList.remove('hidden');
    } catch (error) {
      if (loadingEl) {
        loadingEl.innerHTML = '';
        loadingEl.classList.add('hidden');
      }
      const message = error instanceof Error ? error.message : 'Failed to fetch weather data.';
      if (errorEl) showError(message, errorEl);
    } finally {
      setButtonsDisabled(false);
    }
  }

  async function handleGeolocation(): Promise<void> {
    clearResults();
    if (loadingEl) showLoading(loadingEl);
    setButtonsDisabled(true);

    try {
      const coords = await getCurrentLocation();
      const data = await fetchWeatherByCoords(coords.latitude, coords.longitude);
      if (loadingEl) {
        loadingEl.innerHTML = '';
        loadingEl.classList.add('hidden');
      }
      renderWeatherData(data, weatherDisplay!);
      weatherDisplay!.classList.remove('hidden');
    } catch (error) {
      if (loadingEl) {
        loadingEl.innerHTML = '';
        loadingEl.classList.add('hidden');
      }
      const message = error instanceof Error ? error.message : 'Failed to get weather for your location.';
      if (errorEl) showError(message, errorEl);
    } finally {
      setButtonsDisabled(false);
    }
  }

  function clearResults(): void {
    if (weatherDisplay) {
      weatherDisplay.innerHTML = '';
      weatherDisplay.classList.add('hidden');
    }
    if (errorEl) {
      errorEl.innerHTML = '';
      errorEl.classList.add('hidden');
    }
    if (loadingEl) {
      loadingEl.innerHTML = '';
      loadingEl.classList.add('hidden');
    }
  }

  function setButtonsDisabled(disabled: boolean): void {
    searchBtn!.disabled = disabled;
    locationBtn!.disabled = disabled;
    cityInput!.disabled = disabled;
  }

  searchBtn.addEventListener('click', () => {
    void handleCitySearch();
  });

  cityInput.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleCitySearch();
    }
  });

  locationBtn.addEventListener('click', () => {
    void handleGeolocation();
  });
}
