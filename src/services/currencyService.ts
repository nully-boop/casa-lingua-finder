import axios from 'axios';

// Supported currencies for the real estate app
export const SUPPORTED_CURRENCIES = ['USD', 'AED', 'SYP'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

// Currency symbols and names
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  AED: 'AED ',
  SYP: 'SYP ',
};

export const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  USD: 'US Dollar',
  AED: 'UAE Dirham',
  SYP: 'Syrian Pound',
};

export interface CacheData {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

class CurrencyService {
  private static readonly BASE_URL = 'https://api.exchangerate-api.com/v4/latest';
  private static readonly CACHE_KEY = 'currency_rates';
  private static readonly CACHE_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  // Default rates as fallback (approximate values)
  private static readonly DEFAULT_RATES: Record<string, Record<string, number>> = {
    USD: { USD: 1.0, AED: 3.67, SYP: 2500.0 },
    AED: { USD: 0.27, AED: 1.0, SYP: 680.0 },
    SYP: { USD: 0.0004, AED: 0.0015, SYP: 1.0 },
  };

  /**
   * Get exchange rates for all supported currencies
   */
  static async getExchangeRates(
    baseCurrency: SupportedCurrency = 'USD',
    forceRefresh: boolean = false
  ): Promise<Record<string, number>> {
    try {
      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cachedRates = await this.getCachedRates(baseCurrency);
        if (cachedRates) {
          console.log(`Using cached currency rates for ${baseCurrency}`);
          return cachedRates;
        }
      }

      // Fetch fresh rates from API
      console.log(`Fetching fresh currency rates for ${baseCurrency}`);
      const response = await axios.get(`${this.BASE_URL}/${baseCurrency}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });

      if (response.status === 200 && response.data) {
        const data = response.data;

        if (data.result === 'success' || data.rates) {
          const rates: Record<string, number> = {};

          // Add base currency
          rates[baseCurrency] = 1.0;

          // Add supported currencies
          for (const currency of SUPPORTED_CURRENCIES) {
            if (currency !== baseCurrency && data.rates[currency] != null) {
              rates[currency] = Number(data.rates[currency]);
            }
          }

          // Cache the rates
          await this.cacheRates(baseCurrency, rates);

          console.log('Successfully fetched rates:', rates);
          return rates;
        } else {
          throw new Error('Invalid API response format');
        }
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);

      // Try to return cached rates as fallback
      const cachedRates = await this.getCachedRates(baseCurrency, true);
      if (cachedRates) {
        console.log('Using expired cached rates as fallback');
        return cachedRates;
      }

      // Return default rates if all else fails
      return this.getDefaultRates(baseCurrency);
    }
  }

  /**
   * Convert amount from one currency to another
   */
  static async convertCurrency(
    amount: number,
    fromCurrency: SupportedCurrency,
    toCurrency: SupportedCurrency,
    rates?: Record<string, number>
  ): Promise<number> {
    try {
      // Validate inputs
      if (isNaN(amount) || !isFinite(amount)) {
        throw new Error(`Invalid amount: ${amount}`);
      }

      if (!fromCurrency || !toCurrency) {
        throw new Error('Currency codes cannot be empty');
      }

      if (fromCurrency === toCurrency) return amount;

      // Get rates if not provided
      rates = rates || await this.getExchangeRates(fromCurrency);

      if (!rates || Object.keys(rates).length === 0) {
        throw new Error('No exchange rates available');
      }

      if (fromCurrency === 'USD') {
        // Converting from USD to other currency
        const rate = rates[toCurrency];
        if (rate && rate > 0 && isFinite(rate)) {
          return amount * rate;
        }
      } else if (toCurrency === 'USD') {
        // Converting to USD from other currency
        const rate = rates[fromCurrency];
        if (rate && rate > 0 && isFinite(rate)) {
          return amount / rate;
        }
      } else {
        // Converting between two non-USD currencies
        // First convert to USD, then to target currency
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];

        if (fromRate && toRate && fromRate > 0 && toRate > 0 && 
            isFinite(fromRate) && isFinite(toRate)) {
          const usdAmount = amount / fromRate;
          return usdAmount * toRate;
        }
      }

      // If conversion fails, return original amount as fallback
      console.warn('Currency conversion failed, returning original amount');
      return amount;
    } catch (error) {
      console.error('Error in currency conversion:', error);
      // Return original amount as safe fallback
      return amount;
    }
  }

  /**
   * Format currency amount with proper symbol and formatting
   */
  static formatCurrency(amount: number, currency: SupportedCurrency): string {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;

    // Format based on currency
    switch (currency) {
      case 'USD':
      case 'AED':
        if (amount >= 1000000000) {
          return `${symbol}${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
          return `${symbol}${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
          return `${symbol}${(amount / 1000).toFixed(0)}K`;
        } else {
          return `${symbol}${amount.toFixed(0)}`;
        }

      case 'SYP':
        // SYP amounts are typically very large, so always use K/M format
        if (amount >= 1000000000000) {
          return `${symbol}${(amount / 1000000000000).toFixed(1)}T`;
        } else if (amount >= 1000000000) {
          return `${symbol}${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
          return `${symbol}${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
          return `${symbol}${(amount / 1000).toFixed(0)}K`;
        } else {
          return `${symbol}${amount.toFixed(0)}`;
        }

      default:
        return `${symbol}${amount.toFixed(2)}`;
    }
  }

  /**
   * Get currency symbol
   */
  static getCurrencySymbol(currency: SupportedCurrency): string {
    return CURRENCY_SYMBOLS[currency] || currency;
  }

  /**
   * Get currency name
   */
  static getCurrencyName(currency: SupportedCurrency): string {
    return CURRENCY_NAMES[currency] || currency;
  }

  /**
   * Cache rates locally
   */
  private static async cacheRates(
    baseCurrency: string,
    rates: Record<string, number>
  ): Promise<void> {
    try {
      const cacheData: CacheData = {
        base: baseCurrency,
        rates,
        timestamp: Date.now(),
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      console.log(`Cached currency rates for ${baseCurrency}`);
    } catch (error) {
      console.error('Error caching currency rates:', error);
    }
  }

  /**
   * Get cached rates
   */
  private static async getCachedRates(
    baseCurrency: string,
    ignoreExpiry: boolean = false
  ): Promise<Record<string, number> | null> {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);

      if (cachedData) {
        const data: CacheData = JSON.parse(cachedData);

        // Check if cache is for the same base currency
        if (data.base !== baseCurrency) return null;

        // Check if cache is still valid
        if (!ignoreExpiry) {
          const cacheAge = Date.now() - data.timestamp;
          if (cacheAge > this.CACHE_EXPIRY) {
            console.log('Currency cache expired');
            return null;
          }
        }

        return data.rates;
      }
    } catch (error) {
      console.error('Error reading cached currency rates:', error);
    }

    return null;
  }

  /**
   * Get default rates as fallback
   */
  private static getDefaultRates(baseCurrency: string): Record<string, number> {
    console.log(`Using default currency rates for ${baseCurrency}`);
    return baseCurrency in this.DEFAULT_RATES ? { ...this.DEFAULT_RATES[baseCurrency] } : { ...this.DEFAULT_RATES['USD'] };
  }

  /**
   * Clear cached rates
   */
  static async clearCache(): Promise<void> {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      console.log('Currency cache cleared');
    } catch (error) {
      console.error('Error clearing currency cache:', error);
    }
  }

  /**
   * Check if rates are cached and valid
   */
  static async hasCachedRates(baseCurrency: string): Promise<boolean> {
    const rates = await this.getCachedRates(baseCurrency);
    return rates !== null;
  }

  /**
   * Get last update time
   */
  static async getLastUpdateTime(): Promise<Date | null> {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);

      if (cachedData) {
        const data: CacheData = JSON.parse(cachedData);
        return new Date(data.timestamp);
      }
    } catch (error) {
      console.error('Error getting last update time:', error);
    }

    return null;
  }
}

export default CurrencyService;
