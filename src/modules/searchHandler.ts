import type { WeatherData, GeolocationCoords } from '../types/weather';

interface WeatherService {
  fetchWeatherByCity(city: string): Promise<WeatherData>;
  fetchWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData>;
}

interface GeolocationService {
  getCurrentLocation(): Promise<GeolocationCoords>;
}

interface DisplayModule {
  renderWeatherData(data: WeatherData, container: HTMLElement): void;
  showLoading(container: HTMLElement): void;
  showError(message: string, container: HTMLElement): void;
}

export function setupSearchHandlers(
  weatherService: WeatherService,
  geolocationService: GeolocationService,
  displayModule: DisplayModule
): void {
  const cityInput = document.getElementById('city-input') as HTMLInputElement | null;
  const searchBtn = document.getElementById('search-btn') as HTMLButtonElement | null;
  const locationBtn = document.getElementById('location-btn') as HTMLButtonElement | null;
  const weatherDisplay = document.getElementById('weather-display') as HTMLElement | null;
  const loadingEl = document.getElementById('loading') as HTMLElement | null;
  const errorEl = document.getElementById('error') as HTMLElement | null;

  if (!cityInput || !searchBtn || !locationBtn || !weatherDisplay) {
    return;
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

  function hideLoading(): void {
    if (loadingEl) {
      loadingEl.innerHTML = '';
      loadingEl.classList.add('hidden');
    }
  }

  async function handleCitySearch(): Promise<void> {
    const city = cityInput!.value.trim();

    if (!city) {
      if (errorEl) displayModule.showError('Please enter a city name.', errorEl);
      return;
    }

    clearResults();
    if (loadingEl) displayModule.showLoading(loadingEl);
    setButtonsDisabled(true);

    try {
      const data = await weatherService.fetchWeatherByCity(city);
      hideLoading();
      displayModule.renderWeatherData(data, weatherDisplay!);
      weatherDisplay!.classList.remove('hidden');
    } catch (error) {
      hideLoading();
      const message = error instanceof Error ? error.message : 'Failed to fetch weather data.';
      if (errorEl) displayModule.showError(message, errorEl);
    } finally {
      setButtonsDisabled(false);
    }
  }

  async function handleGeolocation(): Promise<void> {
    clearResults();
    if (loadingEl) displayModule.showLoading(loadingEl);
    setButtonsDisabled(true);

    try {
      const coords = await geolocationService.getCurrentLocation();
      const data = await weatherService.fetchWeatherByCoords(coords.latitude, coords.longitude);
      hideLoading();
      displayModule.renderWeatherData(data, weatherDisplay!);
      weatherDisplay!.classList.remove('hidden');
    } catch (error) {
      hideLoading();
      const message = error instanceof Error ? error.message : 'Failed to get weather for your location.';
      if (errorEl) displayModule.showError(message, errorEl);
    } finally {
      setButtonsDisabled(false);
    }
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
