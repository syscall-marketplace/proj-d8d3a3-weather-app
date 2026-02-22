import type { WeatherData } from '../types/weather';

const ICON_BASE_URL = 'https://openweathermap.org/img/wn';

export function renderWeatherData(data: WeatherData, container: HTMLElement): void {
  if (!container) return;

  const iconUrl = data.icon ? `${ICON_BASE_URL}/${data.icon}@2x.png` : '';
  const temperature = data.temperature != null ? `${Math.round(data.temperature)}°C` : 'N/A';
  const description = data.description ?? 'No description';
  const location = data.location ?? 'Unknown location';
  const humidity = data.humidity != null ? `${data.humidity}%` : 'N/A';
  const windSpeed = data.windSpeed != null ? `${data.windSpeed} m/s` : 'N/A';
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '';

  container.innerHTML = `
    <div class="weather-card">
      <div class="weather-header">
        <h2 class="weather-location">${location}</h2>
        ${iconUrl ? `<img class="weather-icon" src="${iconUrl}" alt="${description}">` : ''}
      </div>
      <div class="weather-temp">${temperature}</div>
      <div class="weather-description">${description}</div>
      <div class="weather-details">
        <div class="weather-detail">
          <span class="weather-detail-label">Humidity</span>
          <span class="weather-detail-value">${humidity}</span>
        </div>
        <div class="weather-detail">
          <span class="weather-detail-label">Wind Speed</span>
          <span class="weather-detail-value">${windSpeed}</span>
        </div>
      </div>
      ${timestamp ? `<div class="weather-timestamp">Updated: ${timestamp}</div>` : ''}
    </div>
  `;
}

export function showLoading(container: HTMLElement): void {
  if (!container) return;
  container.innerHTML = `
    <div class="loading-spinner">
      <p>Loading weather data...</p>
    </div>
  `;
  container.classList.remove('hidden');
}

export function hideLoading(container: HTMLElement): void {
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('hidden');
}

export function showError(message: string, container: HTMLElement): void {
  if (!container) return;
  container.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
  container.classList.remove('hidden');
}
