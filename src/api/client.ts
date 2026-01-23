import type { CodeString } from '../types/currency';
import { validateCodeString } from '../utils/currency';
import { Currency, PIVOT_CURRENCY_CODE } from './currency';

export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const API_PIVOT_CURRENCY = validateCodeString(
  import.meta.env.BUNDLE_API_PIVOT_CURRENCY
);

export const fetchCSV = async (url: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/${API_PIVOT_CURRENCY}/${url}`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to fetch "${url}": ${response.status}/${response.statusText}`
    );
  }

  const text = await response.text();

  return text;
};

export const fetchCurrencyByCode = async (
  code: CodeString
): Promise<Currency> => {
  if (code === PIVOT_CURRENCY_CODE) {
    return new Currency(PIVOT_CURRENCY_CODE, PIVOT_CURRENCY_CODE);
  }

  const [csv, latestCsv] = await Promise.all([
    fetchCSV(`/${code}.csv`),
    fetchCSV(`/${code}.latest.csv`),
  ]);

  return new Currency(PIVOT_CURRENCY_CODE, code)
    .appendWith(csv)
    .appendWith(latestCsv);
};

export const fetchCurrencyBySymbol = async ([baseCode, quoteCode]: [
  CodeString,
  CodeString
]): Promise<Currency> => {
  const [baseCurrency, quoteCurrency] = await Promise.all([
    fetchCurrencyByCode(baseCode),
    fetchCurrencyByCode(quoteCode),
  ]);

  return baseCurrency.rateBy(quoteCurrency);
};

export const fetchCurrenciesBySymbols = async (
  symbols: [CodeString, CodeString][]
): Promise<Currency[]> => {
  const currencies = await Promise.all(
    symbols.map((symbol) => {
      return fetchCurrencyBySymbol(symbol);
    })
  );

  return currencies;
};
