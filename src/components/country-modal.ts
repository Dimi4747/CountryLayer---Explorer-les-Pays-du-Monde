import { Country } from '../types/country';
import { Helpers } from '../utils/helpers';

export class CountryModal {
  private modal!: HTMLElement;
  private modalContent!: HTMLElement;
  private modalTitle!: HTMLElement;
  private modalFlag!: HTMLImageElement;
  private modalBody!: HTMLElement;

  constructor() {
    this.createModal();
    this.setupEventListeners();
  }

  private createModal(): void {
    this.modal = document.createElement('div');
    this.modal.className = 'country-modal';
    this.modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-header">
          <img src="" alt="" class="modal-flag">
          <h2 class="modal-title">Pays</h2>
        </div>
        <div class="modal-body"></div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modalContent = this.modal.querySelector('.modal-content')!;
    this.modalTitle = this.modal.querySelector('.modal-title')!;
    this.modalFlag = this.modal.querySelector('.modal-flag')!;
    this.modalBody = this.modal.querySelector('.modal-body')!;
  }

  private setupEventListeners(): void {
    const closeBtn = this.modal.querySelector('.modal-close')!;
    closeBtn.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  show(country: Country): void {
    this.modalTitle.textContent = country.name;
    this.modalFlag.src = Helpers.getFlagUrl(country);
    this.modalFlag.alt = `Drapeau de ${country.name}`;
    
    this.modalBody.innerHTML = this.generateCountryDetails(country);
    this.modal.classList.add('active');
  }

  close(): void {
    this.modal.classList.remove('active');
  }

  private generateCountryDetails(country: Country): string {
    return `
      <div class="info-section">
        <h3 class="info-title">Informations générales</h3>
        <div class="info-content">
          <p><strong>🏛️ Capitale:</strong> ${Helpers.escapeHtml(country.capital)}</p>
          <p><strong>🌍 Région:</strong> ${Helpers.escapeHtml(country.region)}</p>
          <p><strong>📍 Sous-région:</strong> ${Helpers.escapeHtml(country.subregion || 'Non spécifié')}</p>
          <p><strong>👥 Population:</strong> ${Helpers.formatNumber(country.population)}</p>
          <p><strong>📐 Superficie:</strong> ${Helpers.formatNumber(country.area)} km²</p>
          <p><strong>📊 Densité:</strong> ${Helpers.calculateDensity(country.population, country.area)} hab/km²</p>
          ${country.latlng && country.latlng.length === 2 ? 
            `<p><strong>🧭 Coordonnées:</strong> ${country.latlng[0]}, ${country.latlng[1]}</p>` : ''
          }
        </div>
      </div>
      
      <div class="info-section">
        <h3 class="info-title">Données culturelles</h3>
        <div class="info-content">
          <p><strong>🗣️ Langues:</strong> ${
            country.languages && country.languages.length > 0 
              ? country.languages.map(lang => Helpers.escapeHtml(lang.name)).join(', ') 
              : 'Non spécifié'
          }</p>
          <p><strong>💰 Devises:</strong> ${
            country.currencies && country.currencies.length > 0 
              ? country.currencies.map(curr => 
                  `${Helpers.escapeHtml(curr.name)} (${Helpers.escapeHtml(curr.code || 'N/A')})`
                ).join(', ') 
              : 'Non spécifié'
          }</p>
          <p><strong>⏰ Fuseaux horaires:</strong> ${
            country.timezones && country.timezones.length > 0 
              ? country.timezones.join(', ') 
              : 'Non spécifié'
          }</p>
          ${country.demonym ? `<p><strong>🎌 Gentilé:</strong> ${Helpers.escapeHtml(country.demonym)}</p>` : ''}
        </div>
      </div>
      
      <div class="info-section">
        <h3 class="info-title">Informations administratives</h3>
        <div class="info-content">
          <p><strong>🏷️ Code Alpha-2:</strong> ${country.alpha2Code || 'N/A'}</p>
          <p><strong>🏷️ Code Alpha-3:</strong> ${country.alpha3Code || 'N/A'}</p>
          ${country.nativeName ? `<p><strong>🎌 Nom natif:</strong> ${Helpers.escapeHtml(country.nativeName)}</p>` : ''}
          <p><strong>🛂 Pays frontaliers:</strong> ${
            country.borders && country.borders.length > 0 
              ? country.borders.join(', ') 
              : 'Aucun'
          }</p>
          ${country.callingCodes && country.callingCodes.length > 0 ? 
            `<p><strong>📞 Indicatif:</strong> ${country.callingCodes.join(', ')}</p>` : ''
          }
        </div>
      </div>
    `;
  }
}