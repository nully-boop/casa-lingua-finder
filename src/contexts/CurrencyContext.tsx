import React, { createContext, useContext, useState, useEffect } from "react";
import CurrencyService, { SupportedCurrency, CURRENCY_SYMBOLS } from "@/services/currencyService";

export type Currency = SupportedCurrency;

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
  convertPrice: (price: number, fromCurrency: string, toCurrency?: Currency) => Promise<number>;
  formatPrice: (price: number, fromCurrency?: string, toCurrency?: Currency) => string;
  formatPricePerSqm: (price: number, area: number, fromCurrency?: string, toCurrency?: Currency) => string;
  isLoading: boolean; // Always false for symbol-only mode
  lastUpdated: Date | null;
  refreshRates: (forceRefresh?: boolean) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates with USD as base currency
const EXCHANGE_RATES: ExchangeRates = {
  USD: 1, // Base currency
  AED: 3.67, // 1 USD = 3.67 AED
  SYP: 2500, // 1 USD = 2500 SYP (approximate)
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem("preferred_currency") as Currency;
    return saved || "USD";
  });
  
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(EXCHANGE_RATES);
  const [isLoading, setIsLoading] = useState(false); // Always false since we don't convert
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem("preferred_currency", currency);
  }, [currency]);

  // No need to fetch exchange rates since we only change symbols
  const refreshRates = async (forceRefresh: boolean = false) => {
    // Do nothing - we don't need exchange rates for symbol-only display
    console.log("Currency symbol changed, no rate fetching needed");
  };

  // Convert price from one currency to another
  const convertPrice = async (price: number, fromCurrency: string, toCurrency?: Currency): Promise<number> => {
    const targetCurrency = toCurrency || currency;

    try {
      return await CurrencyService.convertCurrency(
        price,
        fromCurrency as Currency,
        targetCurrency,
        exchangeRates
      );
    } catch (error) {
      console.error("Currency conversion failed:", error);
      return price; // Return original price as fallback
    }
  };

  // Format price with currency conversion
  const formatPrice = (price: number, fromCurrency?: string, toCurrency?: Currency): string => {
    const targetCurrency = toCurrency || currency;
    const sourceCurrency = fromCurrency || 'USD';

    try {
      let convertedPrice = price;

      // Convert price if currencies are different
      if (sourceCurrency !== targetCurrency) {
        // Convert from source currency to USD first
        if (sourceCurrency !== 'USD') {
          const sourceRate = exchangeRates[sourceCurrency];
          if (sourceRate && sourceRate > 0) {
            convertedPrice = price / sourceRate;
          }
        }

        // Convert from USD to target currency
        if (targetCurrency !== 'USD') {
          const targetRate = exchangeRates[targetCurrency];
          if (targetRate && targetRate > 0) {
            convertedPrice = convertedPrice * targetRate;
          }
        }
      }

      return CurrencyService.formatCurrency(Math.round(convertedPrice), targetCurrency as SupportedCurrency);
    } catch (error) {
      console.error("Error formatting price:", error);
      return CurrencyService.formatCurrency(price, targetCurrency as SupportedCurrency);
    }
  };

  // Format price per square meter with currency conversion
  const formatPricePerSqm = (price: number, area: number, fromCurrency?: string, toCurrency?: Currency): string => {
    if (!area || area <= 0) return "";

    const targetCurrency = toCurrency || currency;
    const sourceCurrency = fromCurrency || 'USD';

    try {
      let convertedPrice = price;

      // Convert price if currencies are different
      if (sourceCurrency !== targetCurrency) {
        // Convert from source currency to USD first
        if (sourceCurrency !== 'USD') {
          const sourceRate = exchangeRates[sourceCurrency];
          if (sourceRate && sourceRate > 0) {
            convertedPrice = price / sourceRate;
          }
        }

        // Convert from USD to target currency
        if (targetCurrency !== 'USD') {
          const targetRate = exchangeRates[targetCurrency];
          if (targetRate && targetRate > 0) {
            convertedPrice = convertedPrice * targetRate;
          }
        }
      }

      const pricePerSqm = Math.round(convertedPrice / area);
      const formattedPrice = CurrencyService.formatCurrency(pricePerSqm, targetCurrency as SupportedCurrency);
      return `${formattedPrice}/m²`;
    } catch (error) {
      console.error("Error formatting price per sqm:", error);
      const pricePerSqm = Math.round(price / area);
      return `${pricePerSqm} ${targetCurrency}/m²`;
    }
  };

  // Auto-refresh rates on mount and when currency changes
  useEffect(() => {
    const updateRates = async () => {
      setIsLoading(true);
      await refreshRates();
      setIsLoading(false);
    };
    updateRates();
  }, [currency]);

  // Load cached rates on mount
  useEffect(() => {
    const loadCachedRates = async () => {
      try {
        const hasCached = await CurrencyService.hasCachedRates(currency);
        if (hasCached) {
          const rates = await CurrencyService.getExchangeRates(currency, false);
          setExchangeRates(rates);

          const lastUpdate = await CurrencyService.getLastUpdateTime();
          setLastUpdated(lastUpdate);
        }
      } catch (error) {
        console.error("Error loading cached rates:", error);
      }
    };

    loadCachedRates();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        convertPrice,
        formatPrice,
        formatPricePerSqm,
        isLoading: false, // Always false since we don't do conversions
        lastUpdated,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
