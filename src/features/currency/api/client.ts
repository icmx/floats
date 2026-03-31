import { ApiCache } from '../../../api/cache';
import { fetchString } from '../../../api/client';
import type { Results } from '../../../types/common';
import type {
  Currency,
  DateRate,
  CodeString,
  SymbolString,
} from '../../../types/currency';
import { PIVOT_CURRENCY_CODE } from '../constants';
import {
  parseCsv,
  createPivotCurrency,
  createCurrency,
  splitSymbolToCodes,
  createCrossCurrency,
} from '../utils';

const cache = new ApiCache<Currency>();

export const fetchRateTuples = async (
  url: string
): Promise<DateRate[]> => {
  const csv = await fetchString(`${PIVOT_CURRENCY_CODE}/${url}`);

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
      fetchRateTuples(`${code}.csv`),
      fetchRateTuples(`${code}.latest.csv`),
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
