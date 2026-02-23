import { PIVOT_CURRENCY_CODE } from '../constants/currency';
import type { Results } from '../types/common';
import type {
  CodeString,
  Currency,
  RateTuple,
  SymbolString,
} from '../types/currency';
import {
  createCrossCurrency,
  createCurrency,
  createPivotCurrency,
  splitSymbolToCodes,
} from '../utils/currency';
import { ApiCache } from './cache';

const cache = new ApiCache<Currency>();

export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const fetchCSV = async (url: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/${PIVOT_CURRENCY_CODE}/${url}`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to fetch "${url}": ${response.status}/${response.statusText}`
    );
  }

  const text = await response.text();

  return text;
};

export const fetchRateTuples = async (
  url: string
): Promise<RateTuple[]> => {
  const csv = await fetchCSV(url);

  return csv
    .trim()
    .split('\n')
    .map((line) => {
      const [dateText, rateText] = line.split(',');

      return [
        new Date(dateText).getTime(),
        Number.parseFloat(rateText),
      ];
    });
};

export const fetchCurrencyByCode = async (
  code: CodeString
): Promise<Currency> => {
  return cache.resolve(code, async () => {
    if (code === PIVOT_CURRENCY_CODE) {
      return createPivotCurrency();
    }

    const [data, latestData] = await Promise.all([
      fetchRateTuples(`/${code}.csv`),
      fetchRateTuples(`/${code}.latest.csv`),
    ]);

    return createCurrency(PIVOT_CURRENCY_CODE, code, [
      ...data,
      ...latestData,
    ]);
  });
};

export const fetchCurrencyBySymbol = async (
  symbol: SymbolString
): Promise<Currency> => {
  const [baseCode, quoteCode] = splitSymbolToCodes(symbol);

  return cache.resolve(symbol, async () => {
    const [baseCurrency, quoteCurrency] = await Promise.all([
      fetchCurrencyByCode(baseCode),
      fetchCurrencyByCode(quoteCode),
    ]);

    return createCrossCurrency(baseCurrency, quoteCurrency);
  });
};

export const getCurrencies = async (
  symbols: SymbolString[]
): Promise<Results<Currency, unknown>> => {
  const settled = await Promise.allSettled(
    symbols.map((symbol) => {
      return fetchCurrencyBySymbol(symbol);
    })
  );

  return settled.map((result) => {
    if (result.status === 'fulfilled') {
      return { success: true, data: result.value };
    } else {
      return { success: false, error: result.reason };
    }
  });
};
