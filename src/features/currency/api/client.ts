import { API_BASE_URL } from '@/config/env';
import { Cached } from '@/lib/cached';
import { type Results } from '@/types/results';
import { PIVOT_CODE } from '../config/codes';
import {
  createPivotCurrency,
  createCurrency,
  createCrossCurrency,
} from '../lib/currency';
import { splitSymbolToCodes } from '../lib/symbols';
import { parseTicks } from '../lib/ticks';
import {
  type Currency,
  type CodeString,
  type SymbolString,
  type Tick,
} from '../types';

const cached = new Cached<Currency>();

export const fetchString = async (url: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/${url}`);

  if (!response.ok) {
    throw new Error(
      `Unable to fetch "${url}": ${response.status}/${response.statusText}`
    );
  }

  const text = await response.text();

  return text;
};

export const fetchTicks = async (url: string): Promise<Tick[]> => {
  const csv = await fetchString(`${PIVOT_CODE}/${url}`);

  const data = parseTicks(csv);
  return data;
};

export const fetchCurrencyByCode = async (
  code: CodeString
): Promise<Currency> => {
  return cached.resolve(code, async () => {
    if (code === PIVOT_CODE) {
      return createPivotCurrency();
    }

    const [ticks, latestTicks] = await Promise.all([
      fetchTicks(`${code}.csv`),
      fetchTicks(`${code}.latest.csv`),
    ]);

    return createCurrency(PIVOT_CODE, code, [...ticks, ...latestTicks]);
  });
};

export const fetchCurrencyBySymbol = async (
  symbol: SymbolString
): Promise<Currency> => {
  return cached.resolve(symbol, async () => {
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
