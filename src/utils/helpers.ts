export class Helpers {
  static formatNumber(num: number): string {
    if (!num || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  static debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }

  static getFlagUrl(country: { alpha2Code?: string; flag?: string }): string {
    if (country.flag) {
      return country.flag;
    }
    
    if (country.alpha2Code) {
      return `https://flagcdn.com/w320/${country.alpha2Code.toLowerCase()}.png`;
    }
    
    return 'https://via.placeholder.com/320x160?text=Drapeau+non+disponible';
  }

  static escapeHtml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static calculateDensity(population: number, area: number): string {
    if (!population || !area || area === 0) return 'N/A';
    return this.formatNumber(Math.round(population / area));
  }
}