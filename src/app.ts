import { Country } from './types/country';
import { ApiService } from './services/api.service';
import { CountryCard } from './components/country-card';
import { CountryModal } from './components/country-modal';
import { Helpers } from './utils/helpers';

export class CountryExplorerApp {
  private countries: Country[] = [];
  private filteredCountries: Country[] = [];
  private regions: Set<string> = new Set();
  private modal: CountryModal;

  // Éléments DOM
  private searchInput!: HTMLInputElement;
  private regionFilter!: HTMLSelectElement;
  private sortSelect!: HTMLSelectElement;
  private countriesGrid!: HTMLElement;
  private loadingSection!: HTMLElement;
  private errorSection!: HTMLElement;
  private statsSection!: HTMLElement;
  private totalCountries!: HTMLElement;
  private totalPopulation!: HTMLElement;
  private totalArea!: HTMLElement;

  constructor() {
    this.initializeElements();
    this.modal = new CountryModal();
    this.setupEventListeners();
    this.loadCountriesData();
  }

  private initializeElements(): void {
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.regionFilter = document.getElementById('regionFilter') as HTMLSelectElement;
    this.sortSelect = document.getElementById('sortSelect') as HTMLSelectElement;
    this.countriesGrid = document.getElementById('countriesGrid') as HTMLElement;
    this.loadingSection = document.getElementById('loadingSection') as HTMLElement;
    this.errorSection = document.getElementById('errorSection') as HTMLElement;
    this.statsSection = document.getElementById('statsSection') as HTMLElement;
    this.totalCountries = document.getElementById('totalCountries') as HTMLElement;
    this.totalPopulation = document.getElementById('totalPopulation') as HTMLElement;
    this.totalArea = document.getElementById('totalArea') as HTMLElement;
  }

  private setupEventListeners(): void {
    const debouncedSearch = Helpers.debounce(() => this.filterCountries(), 300);
    this.searchInput.addEventListener('input', debouncedSearch);
    
    this.regionFilter.addEventListener('change', () => this.filterCountries());
    this.sortSelect.addEventListener('change', () => this.sortCountries());
  }

  private async loadCountriesData(): Promise<void> {
    this.showLoading();

    try {
      console.log('🔄 Début du chargement des données...');
      this.countries = await ApiService.getAllCountries();
      
      if (this.countries.length === 0) {
        throw new Error('Aucune donnée reçue de l\'API');
      }
      
      this.processCountriesData();
      this.updateStatistics();
      this.renderCountries();
      this.hideError();
      
    } catch (error) {
      console.error('❌ Erreur critique:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.showError(`Erreur lors du chargement: ${errorMessage}`);
      await this.loadFallbackData();
    } finally {
      this.hideLoading();
    }
  }

  private processCountriesData(): void {
    console.log('🔄 Traitement des données...');
    
    // Nettoyer les données
    this.countries = this.countries.map(country => ({
      ...country,
      population: country.population || 0,
      area: country.area || 0,
      capital: country.capital || 'Non spécifié',
      region: country.region || 'Non spécifié',
      subregion: country.subregion || 'Non spécifié'
    }));

    // Extraire les régions
    this.regions = new Set(this.countries.map(country => country.region).filter(Boolean));
    this.updateRegionFilter();

    this.filteredCountries = [...this.countries];
    this.sortCountries();
    
    console.log('✅ Données traitées. Régions trouvées:', Array.from(this.regions));
  }

  private updateRegionFilter(): void {
    while (this.regionFilter.children.length > 1) {
      this.regionFilter.removeChild(this.regionFilter.lastChild!);
    }

    const sortedRegions = Array.from(this.regions).sort();
    sortedRegions.forEach(region => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      this.regionFilter.appendChild(option);
    });
  }

  private filterCountries(): void {
    const searchTerm = this.searchInput.value.toLowerCase();
    const selectedRegion = this.regionFilter.value;

    this.filteredCountries = this.countries.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchTerm);
      const matchesRegion = !selectedRegion || country.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    this.sortCountries();
  }

  private sortCountries(): void {
    const sortBy = this.sortSelect.value;

    this.filteredCountries.sort((a, b) => {
      switch (sortBy) {
        case 'population':
          return (b.population || 0) - (a.population || 0);
        case 'area':
          return (b.area || 0) - (a.area || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    this.renderCountries();
  }

  private renderCountries(): void {
    this.countriesGrid.innerHTML = '';

    if (this.filteredCountries.length === 0) {
      this.countriesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
          <h3>🔍 Aucun pays trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      `;
      return;
    }

    this.filteredCountries.forEach(country => {
      const card = CountryCard.create(country, (selectedCountry) => {
        this.showCountryDetails(selectedCountry);
      });
      this.countriesGrid.appendChild(card);
    });
  }

  private showCountryDetails(country: Country): void {
    console.log('🔍 Affichage des détails pour:', country.name);
    console.log('📊 Données complètes:', country);
    this.modal.show(country);
  }

  private updateStatistics(): void {
    const totalCountries = this.countries.length;
    const totalPopulation = this.countries.reduce((sum, country) => sum + (country.population || 0), 0);
    const totalArea = this.countries.reduce((sum, country) => sum + (country.area || 0), 0);

    this.totalCountries.textContent = `${Helpers.formatNumber(totalCountries)} pays chargés`;
    this.totalPopulation.textContent = `${Helpers.formatNumber(totalPopulation)} habitants`;
    this.totalArea.textContent = `${Helpers.formatNumber(totalArea)} km²`;
  }

  private async loadFallbackData(): Promise<void> {
    console.log('🔄 Chargement des données de secours...');
    
    const fallbackData: Country[] = [
      {
        name: "France",
        capital: "Paris",
        region: "Europe",
        subregion: "Western Europe",
        population: 67391582,
        area: 551695,
        languages: [{ name: "French", nativeName: "Français" }],
        currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
        flag: "https://flagcdn.com/w320/fr.png",
        alpha2Code: "FR",
        alpha3Code: "FRA",
        nativeName: "France",
        timezones: ["UTC+01:00"],
        borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
        latlng: [46, 2],
        demonym: "French",
        callingCodes: ["+33"]
      },
      {
        name: "United States",
        capital: "Washington, D.C.",
        region: "Americas",
        subregion: "Northern America",
        population: 329484123,
        area: 9372610,
        languages: [{ name: "English" }],
        currencies: [{ code: "USD", name: "United States Dollar", symbol: "$" }],
        flag: "https://flagcdn.com/w320/us.png",
        alpha2Code: "US",
        alpha3Code: "USA",
        nativeName: "United States",
        timezones: ["UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00", "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC+10:00", "UTC+12:00"],
        borders: ["CAN", "MEX"],
        latlng: [38, -97],
        demonym: "American",
        callingCodes: ["+1"]
      }
    ];

    this.countries = fallbackData;
    this.processCountriesData();
    this.updateStatistics();
    this.renderCountries();
  }

  private showLoading(): void {
    this.loadingSection.style.display = 'block';
    this.countriesGrid.innerHTML = '';
  }

  private hideLoading(): void {
    this.loadingSection.style.display = 'none';
  }

  private showError(message: string): void {
    this.errorSection.textContent = message;
    this.errorSection.style.display = 'block';
  }

  private hideError(): void {
    this.errorSection.style.display = 'none';
  }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
  new CountryExplorerApp();
});