import { useSearchParams } from 'react-router';
import { PAIRS } from '../constants/pairs';
import { useEffect, useState } from 'react';

export const API_BASE_URL = import.meta.env.BUNDLE_API_BASE_URL;

export const API_PIVOT_CURRENCY = import.meta.env
  .BUNDLE_API_PIVOT_CURRENCY;

export const PIVOT_CURRENCY_CODE = API_PIVOT_CURRENCY;

export const fetchCSV = async (url: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/${API_PIVOT_CURRENCY}/${url}`
  );

  const text = await response.text();

  return text;
};


export class Currency {
  baseCode: string;

  quoteCode: string;

  rates: { date: string; rate: number }[];

  constructor(baseCode: string, quoteCode: string) {
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
          date: dateText,
          rate: Number.parseFloat(rateText),
        });
      });

    return this;
  }

  rateBy(that: Currency): Currency {
    if (this.baseCode !== that.baseCode) {
      throw new Error(
        `Base codes must be the same. Now: ${this.baseCode}/*, ${that.baseCode}/*`
      );
    }

    if (this.isPivoting) {
      return that;
    }

    if (that.isPivoting) {
      return this;
    }

    // @todo: own structure
    const ratesByDates: {
      [key: string]: { left?: number; right?: number };
    } = {};

    this.rates.forEach(({ date, rate }) => {
      ratesByDates[date] = { ...ratesByDates[date], left: rate };
    });

    that.rates.forEach(({ date, rate }) => {
      ratesByDates[date] = { ...ratesByDates[date], right: rate };
    });

    const currency = new Currency(this.quoteCode, that.quoteCode);

    Object.entries(ratesByDates)
      .sort(([prev], [next]) => {
        // @todo: Data must have own structure?
        const prevValue = new Date(prev).valueOf();
        const nextValue = new Date(next).valueOf();

        return prevValue - nextValue;
      })
      .filter(
        (
          rate
        ): rate is [string, Required<(typeof ratesByDates)[1]>] => {
          return 'left' in rate[1] && 'right' in rate[1];
        }
      )
      .forEach(([date, { left, right }]) => {
        currency.rates.push({ date, rate: right / left });
      });

    return currency;
  }
}

export const fetchCurrency = async (
  currencyCode: string
): Promise<Currency> => {
  if (currencyCode === PIVOT_CURRENCY_CODE) {
    return new Currency(PIVOT_CURRENCY_CODE, PIVOT_CURRENCY_CODE);
  }

  const [csv, latestCsv] = await Promise.all([
    fetchCSV(`/${currencyCode}.csv`),
    fetchCSV(`/${currencyCode}.latest.csv`),
  ]);

  return new Currency(PIVOT_CURRENCY_CODE, currencyCode)
    .appendWith(csv)
    .appendWith(latestCsv);
};

export const fetchCurrencyPair = async (
  baseCurrencyCode: string,
  quoteCurrencyCode: string
): Promise<Currency> => {
  const [baseCurrency, quoteCurrency] = await Promise.all([
    fetchCurrency(baseCurrencyCode),
    fetchCurrency(quoteCurrencyCode),
  ]);

  return baseCurrency.rateBy(quoteCurrency);
};

export const fetchCurrencyPairs = async (
  codesPairs: [string, string][]
): Promise<Currency[]> => {
  const PAIRS_HARD_LIMIT = 5;

  const currencies = await Promise.all(
    codesPairs
      .slice(0, PAIRS_HARD_LIMIT)
      .map(([baseCurrencyCode, quoteCurrencyCode]) => {
        return fetchCurrencyPair(baseCurrencyCode, quoteCurrencyCode);
      })
  );

  return currencies;
};

export const useCurrencies = (): string => {
  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const codesPairs = notation
    .toUpperCase()
    .split(',')
    .map((pair) => {
      if (!PAIRS.includes(pair)) {
        throw new Error(`No such pair: "${pair}"`);
      }

      const base = pair.substring(0, 3);
      const quote = pair.substring(3, 6);

      return [base, quote] satisfies [string, string];
    });

  const [report, setReport] = useState('[loading...]');

  useEffect(() => {
    const load = async () => {
      const lines: string[] = [];
      const currencies = await fetchCurrencyPairs(codesPairs);

      currencies.forEach((currency) => {
        const first = JSON.stringify(currency.rates.at(0));
        const middle = `[${currency.rates.length - 2} items]`;
        const last = JSON.stringify(currency.rates.at(-1));

        lines.push(
          `
            # Currency: ${currency.baseCode}/${currency.quoteCode}:
            - first: ${first}
            - ${middle}
            - last: ${last}
            ---
          `
            .trim()
            .replace(/^\s+/gm, '')
        );
      });

      setReport(lines.join('\n\n'));
    };

    load();
  }, [searchParams, codesPairs]);

  return report;
};
