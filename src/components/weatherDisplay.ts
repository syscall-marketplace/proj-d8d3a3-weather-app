import type { WeatherData } from '../types/weather';

const ICON_BASE_URL = 'https://openweathermap.org/img/wn';

export function renderWeatherData(data: WeatherData, container: HTMLElement): void {
  if (!container) return;

  const iconUrl = `${ICON_BASE_URL}/${data.icon}@2x.png`;

  container.innerHTML = `
    <div class="weather-card">
      <div class="weather-header">
        <h2 class="weather-location">${data.location}</h2>
        <img class="weather-icon" src="${iconUrl}" alt="${data.description}">
      </div>
      <div class="weather-temp">${Math.round(data.temperature)}°C</div>
      <div class="weather-description">${data.description}</div>
      <div class="weather-details">
        <div class="weather-detail">
          <span class="weather-detail-label">Humidity</span>
          <span class="weather-detail-value">${data.humidity}%</span>
        </div>
        <div class="weather-detail">
          <span class="weather-detail-label">Wind Speed</span>
          <span class="weather-detail-value">${data.windSpeed} m/s</span>
        </div>
      </div>
      <div class="weather-timestamp">Updated: ${data.timestamp.toLocaleTimeString()}</div>
    </div>
  `;
}

export function showLoading(container: HTMLElement): void {
  if (!container) return;
  container.classList.remove('hidden');
}

export function hideLoading(container: HTMLElement): void {
  if (!container) return;
  container.classList.add('hidden');
}

export function showError(message: string, container: HTMLElement): void {
  if (!container) return;
  container.textContent = message;
  container.classList.remove('hidden');
}
