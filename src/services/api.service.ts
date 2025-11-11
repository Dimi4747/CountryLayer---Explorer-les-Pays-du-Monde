import { Country, Language, Currency } from '../types/country';

const API_KEY = '486edbc7f823b4ff9e246d4e475baa8e';
const BASE_URL = 'https://api.countrylayer.com/v2';

export class ApiService {
  static async getAllCountries(): Promise<Country[]> {
    try {
      console.log('🔍 Chargement des données depuis CountryLayer...');
      
      const response = await fetch(`${BASE_URL}/all?access_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP! status: ${response.status}`);
      }
      
      const apiData: any[] = await response.json();
      console.log('📦 Données brutes reçues:', apiData.slice(0, 2)); // Affiche les 2 premiers pays
      
      // Transformer les données
      const countries: Country[] = apiData.map(countryData => 
        this.transformApiData(countryData)
      );
      
      console.log(`✅ ${countries.length} pays chargés avec succès`);
      return countries;
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      throw error;
    }
  }

  private static transformApiData(apiData: any): Country {
    console.log('🔄 Transformation des données pour:', apiData.name);
    
    return {
      name: apiData.name || 'Non spécifié',
      capital: apiData.capital || 'Non spécifié',
      region: apiData.region || 'Non spécifié',
      subregion: apiData.subregion || 'Non spécifié',
      population: apiData.population || 0,
      area: apiData.area || 0,
      languages: this.transformLanguages(apiData.languages),
      currencies: this.transformCurrencies(apiData.currencies),
      flag: apiData.flag || this.generateFlagUrl(apiData.alpha2Code),
      alpha2Code: apiData.alpha2Code || apiData.alpha2_code || '',
      alpha3Code: apiData.alpha3Code || apiData.alpha3_code || '',
      nativeName: apiData.nativeName || apiData.native_name || '',
      timezones: apiData.timezones || [],
      borders: apiData.borders || [],
      latlng: apiData.latlng || [0, 0],
      demonym: apiData.demonym || '',
      topLevelDomain: apiData.topLevelDomain || apiData.top_level_domain || [],
      callingCodes: apiData.callingCodes || apiData.calling_codes || [],
      altSpellings: apiData.altSpellings || apiData.alt_spellings || [],
      regionalBlocs: apiData.regionalBlocs || apiData.regional_blocs || [],
      cioc: apiData.cioc || ''
    };
  }

  private static transformLanguages(languagesData: any): Language[] {
    if (!languagesData) {
      console.log('⚠️ Aucune donnée de langue');
      return [];
    }
    
    console.log('🗣️ Données langues brutes:', languagesData);
    
    // Si c'est un tableau d'objets
    if (Array.isArray(languagesData)) {
      return languagesData.map(lang => ({
        name: lang.name || lang,
        nativeName: lang.nativeName || lang.native_name,
        iso639_1: lang.iso639_1,
        iso639_2: lang.iso639_2
      }));
    }
    
    // Si c'est un objet {fra: "French"}
    if (typeof languagesData === 'object') {
      return Object.entries(languagesData).map(([code, name]) => ({
        iso639_1: code,
        name: name as string
      }));
    }
    
    return [];
  }

  private static transformCurrencies(currenciesData: any): Currency[] {
    if (!currenciesData) {
      console.log('⚠️ Aucune donnée de devise');
      return [];
    }
    
    console.log('💰 Données devises brutes:', currenciesData);
    
    // Si c'est un tableau d'objets
    if (Array.isArray(currenciesData)) {
      return currenciesData.map(currency => ({
        code: currency.code || '',
        name: currency.name || currency,
        symbol: currency.symbol || ''
      }));
    }
    
    // Si c'est un objet {EUR: {name: "Euro", symbol: "€"}}
    if (typeof currenciesData === 'object' && !Array.isArray(currenciesData)) {
      return Object.entries(currenciesData).map(([code, currency]) => ({
        code: code,
        name: (currency as any).name || '',
        symbol: (currency as any).symbol || ''
      }));
    }
    
    return [];
  }

  private static generateFlagUrl(alpha2Code: string): string {
    if (!alpha2Code) return 'https://via.placeholder.com/320x160?text=Drapeau+non+disponible';
    return `https://flagcdn.com/w320/${alpha2Code.toLowerCase()}.png`;
  }

  static async getCountryByCode(code: string): Promise<Country> {
    try {
      const response = await fetch(`${BASE_URL}/alpha/${code}?access_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP! status: ${response.status}`);
      }
      
      const countryData = await response.json();
      return this.transformApiData(countryData);
      
    } catch (error) {
      console.error('Erreur lors du chargement du pays:', error);
      throw error;
    }
  }
}