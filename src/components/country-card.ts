import { Country } from '../types/country';
import { Helpers } from '../utils/helpers';

export class CountryCard {
  static create(country: Country, onClick: (country: Country) => void): HTMLElement {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.addEventListener('click', () => onClick(country));

    const flagUrl = Helpers.getFlagUrl(country);

    card.innerHTML = `
      <img src="${flagUrl}" 
           alt="Drapeau de ${Helpers.escapeHtml(country.name)}" 
           class="country-flag"
           onerror="this.src='https://via.placeholder.com/320x160?text=Drapeau+non+disponible'">
      <div class="country-info">
        <h3 class="country-name">${Helpers.escapeHtml(country.name)}</h3>
        <div class="country-details">
          <div class="country-detail">
            <span class="detail-icon">🏛️</span>
            <span>${Helpers.escapeHtml(country.capital)}</span>
          </div>
          <div class="country-detail">
            <span class="detail-icon">🌍</span>
            <span>${Helpers.escapeHtml(country.region)}</span>
          </div>
          <div class="country-detail">
            <span class="detail-icon">👥</span>
            <span>${Helpers.formatNumber(country.population)} habitants</span>
          </div>
          <div class="country-detail">
            <span class="detail-icon">📐</span>
            <span>${Helpers.formatNumber(country.area)} km²</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }
}