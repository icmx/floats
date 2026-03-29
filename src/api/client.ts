import { PIVOT_CURRENCY_CODE } from '../constants/currency';
import type { Results } from '../types/common';
import type {
  CodeString,
  Currency,
  DateRate,
  SymbolString,
} from '../types/currency';
import {
  createCrossCurrency,
  createCurrency,
  createPivotCurrency,
  parseCsv,
  splitSymbolToCodes,
} from '../utils/currency';
import { ApiCache } from './cache';

const cache = new ApiCache<Currency>();

export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const fetchString = async (url: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/${PIVOT_CURRENCY_CODE}${url}`
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
): Promise<DateRate[]> => {
  const csv = await fetchString(url);
  const data = parseCsv(csv);

  return data;
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
  return cache.resolve(symbol, async () => {
    const [baseCode, quoteCode] = splitSymbolToCodes(symbol);

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
