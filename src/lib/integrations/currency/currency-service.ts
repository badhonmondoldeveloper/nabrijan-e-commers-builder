export interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  rateFromBDT: number; // Conversion rate from BDT base
  decimalDigits: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyRate> = {
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rateFromBDT: 1.0, decimalDigits: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromBDT: 0.0083, decimalDigits: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromBDT: 0.0076, decimalDigits: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromBDT: 0.0065, decimalDigits: 2 }
};

export class CurrencyService {
  /**
   * Safe money conversion from BDT to target currency
   */
  static convert(amountInBDT: number, targetCurrency: string = 'BDT'): number {
    const currency = SUPPORTED_CURRENCIES[targetCurrency.toUpperCase()] || SUPPORTED_CURRENCIES.BDT;
    const converted = amountInBDT * currency.rateFromBDT;
    return Number(converted.toFixed(currency.decimalDigits));
  }

  /**
   * Formats numeric price into localized currency string (e.g. "৳ 1,250.00" or "$ 10.38")
   */
  static formatMoney(amountInBDT: number, targetCurrency: string = 'BDT'): string {
    const currency = SUPPORTED_CURRENCIES[targetCurrency.toUpperCase()] || SUPPORTED_CURRENCIES.BDT;
    const value = this.convert(amountInBDT, targetCurrency);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency.decimalDigits,
      maximumFractionDigits: currency.decimalDigits
    }).format(value);

    return `${currency.symbol} ${formatted}`;
  }
}
