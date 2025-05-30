// Currency utility functions

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Relative to base currency (KES)
}

// Default list of supported currencies
export const currencies: Currency[] = [
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", exchangeRate: 1 },
  { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 0.0078 },
  { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.0072 },
  { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.0062 },
  {
    code: "TZS",
    name: "Tanzanian Shilling",
    symbol: "TSh",
    exchangeRate: 19.5,
  },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", exchangeRate: 28.9 },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF", exchangeRate: 9.2 },
];

// Get user's region currency based on browser locale
export function getUserRegionCurrency(): Currency {
  try {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      try {
        const userLocale = navigator.language;
        const userRegion = new Intl.NumberFormat(userLocale, {
          style: "currency",
          currency: "USD",
        })
          .formatToParts(1)
          .find((part) => part.type === "currency");

        // Try to find the currency in our list
        const regionCurrency = currencies.find(
          (c) => c.code === userRegion?.value,
        );

        // Default to KES if not found
        return regionCurrency || currencies[0];
      } catch (browserError) {
        console.error("Browser API error:", browserError);
        return currencies[0];
      }
    }
    // Default to KES if not in browser
    return currencies[0];
  } catch (error) {
    console.error("Error determining user region currency:", error);
    // Default to KES
    return currencies[0];
  }
}

// Format currency with the appropriate symbol and locale
export function formatCurrency(
  amount: number,
  currencyCode: string = "KES",
): string {
  const currency =
    currencies.find((c) => c.code === currencyCode) || currencies[0];

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Convert amount from one currency to another
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  const from = currencies.find((c) => c.code === fromCurrency) || currencies[0];
  const to = currencies.find((c) => c.code === toCurrency) || currencies[0];

  // Convert to base currency (KES) first, then to target currency
  const amountInBase = amount / from.exchangeRate;
  return amountInBase * to.exchangeRate;
}

// Calculate final amount based on input amount and exchange rate
export function calculateFinalAmount(
  amount: number,
  exchangeRate: number = 1,
): number {
  return amount * exchangeRate;
}
