export interface Language {
  name: string;
  nativeName?: string;
  iso639_1?: string;
  iso639_2?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
}

export interface RegionalBloc {
  acronym: string;
  name: string;
}

export interface Country {
  name: string;
  capital: string;
  region: string;
  subregion?: string;
  population: number;
  area: number;
  languages: Language[];
  currencies: Currency[];
  flag: string;
  alpha2Code: string;
  alpha3Code: string;
  nativeName?: string;
  timezones: string[];
  borders: string[];
  latlng: [number, number];
  demonym?: string;
  topLevelDomain?: string[];
  callingCodes?: string[];
  altSpellings?: string[];
  regionalBlocs?: RegionalBloc[];
  cioc?: string;
}