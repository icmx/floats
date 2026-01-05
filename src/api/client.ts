import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { SYMBOLS } from '../constants/currency';
import type { CodeString, SymbolString } from '../types/currency';

export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const API_PIVOT_CURRENCY = import.meta.env
  .BUNDLE_API_PIVOT_CURRENCY;

export const PIVOT_CURRENCY_CODE = API_PIVOT_CURRENCY as CodeString;

export const fetchCSV = async (url: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/${API_PIVOT_CURRENCY}/${url}`
  );

  const text = await response.text();

  return text;
};

export class Currency {
  baseCode: CodeString;

  quoteCode: CodeString;

  rates: { date: number; rate: number }[];

  constructor(baseCode: CodeString, quoteCode: CodeString) {
    this.baseCode = baseCode;
    this.quoteCode = quoteCode;
    this.rates = [];
  }

  get isPivoting(): boolean {
    return (
      this.baseCode === PIVOT_CURRENCY_CODE &&
      this.quoteCode === PIVOT_CURRENCY_CODE
    );
  }

  get isEmpty(): boolean {
    return this.rates.length === 0;
  }

  appendWith(csv: string): this {
    csv
      .trim()
      .split('\n')
      .forEach((line) => {
        const [dateText, rateText] = line.split(',');

        this.rates.push({
          date: new Date(dateText).getTime(),
          rate: Number.parseFloat(rateText),
        });
      });

    return this;
  }

  rateBy(that: Currency): Currency {
    if (this.baseCode !== that.baseCode) {
      throw new Error(
        `Base codes must be the same. Now: "${this.baseCode}/*", "${that.baseCode}/*"`
      );
    }

    if (this.isPivoting) {
      return that;
    }

    if (that.isPivoting) {
      return this;
    }

    const ratesByDates = new Map<
      number,
      { left?: number; right?: number }
    >();

    this.rates.forEach(({ date, rate }) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || {}),
        left: rate,
      });
    });

    that.rates.forEach(({ date, rate }) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || {}),
        right: rate,
      });
    });

    const currency = new Currency(this.quoteCode, that.quoteCode);

    Array.from(ratesByDates.entries())
      .sort(([prev], [next]) => {
        return prev - next;
      })
      .forEach(([date, { left, right }]) => {
        if (!left || !right) {
          return;
        }

        currency.rates.push({ date, rate: right / left });
      });

    return currency;
  }
}

export const fetchCurrencyByCode = async (
  сode: CodeString
): Promise<Currency> => {
  if (сode === PIVOT_CURRENCY_CODE) {
    return new Currency(PIVOT_CURRENCY_CODE, PIVOT_CURRENCY_CODE);
  }

  const [csv, latestCsv] = await Promise.all([
    fetchCSV(`/${сode}.csv`),
    fetchCSV(`/${сode}.latest.csv`),
  ]);

  return new Currency(PIVOT_CURRENCY_CODE, сode)
    .appendWith(csv)
    .appendWith(latestCsv);
};

export const fetchCurrencyBySymbol = async (
  baseCode: CodeString,
  quoteCode: CodeString
): Promise<Currency> => {
  const [baseCurrency, quoteCurrency] = await Promise.all([
    fetchCurrencyByCode(baseCode),
    fetchCurrencyByCode(quoteCode),
  ]);

  return baseCurrency.rateBy(quoteCurrency);
};

export const fetchCurrenciesBySymbols = async (
  symbols: [CodeString, CodeString][]
): Promise<Currency[]> => {
  // @todo: Temporary limit
  const SYMBOLS_HARD_LIMIT = 5;

  const currencies = await Promise.all(
    symbols
      .slice(0, SYMBOLS_HARD_LIMIT)
      .map(([baseCode, quoteCode]) => {
        return fetchCurrencyBySymbol(baseCode, quoteCode);
      })
  );

  return currencies;
};

export const useCurrencies = (): Currency[] => {
  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const codesPairs = useMemo(() => {
    return notation
      .toUpperCase()
      .split(',')
      .map((symbol) => {
        if (!SYMBOLS.includes(symbol as SymbolString)) {
          throw new Error(`No such symbol: "${symbol}"`);
        }

        const base = symbol.substring(0, 3);
        const quote = symbol.substring(3, 6);

        return [base, quote] as [CodeString, CodeString];
      });
  }, [notation]);

  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const load = async () => {
      const items = await fetchCurrenciesBySymbols(codesPairs);

      setCurrencies(items);
    };

    load();
  }, [codesPairs]);

  return currencies;
};

export const useChartPageData = (): {
  name: string;
  data: [number, number][];
} | null => {
  const currencies = useCurrencies();
  const currency = currencies.at(0) || null;

  return useMemo(() => {
    if (!currency) {
      return null;
    }

    const name: string = `${currency.baseCode}${currency.quoteCode}`;
    const data: [number, number][] = currency.rates.map(
      ({ date, rate }) => [date, rate]
    );

    return { name, data };
  }, [currency]);
};

export const useDataPageData = (): {
  head: string[];
  body: { date: number; rates: (number | null)[] }[];
} => {
  const currencies = useCurrencies();

  return useMemo(() => {
    const symbols = currencies.map((currency) => {
      return `${currency.baseCode}${currency.quoteCode}`;
    });

    const head = ['date', ...symbols];

    const ratesByDates = new Map<number, (number | null)[]>();
    const SIZE = currencies.length;

    currencies.forEach((currency, index) => {
      currency.rates.forEach(({ date, rate }) => {
        const ratesByDate =
          ratesByDates.get(date) || new Array(SIZE).fill(null);

        ratesByDate[index] = rate;

        ratesByDates.set(date, ratesByDate);
      });
    });

    const body: { date: number; rates: (number | null)[] }[] = [];

    Array.from(ratesByDates.entries())
      .sort(([prev], [next]) => {
        return prev - next;
      })
      .forEach(([date, rates]) => {
        body.push({ date, rates });
      });

    return { head, body };
  }, [currencies]);
};
