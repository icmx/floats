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
  const currencies = await Promise.all(
    symbols.map(([baseCode, quoteCode]) => {
      return fetchCurrencyBySymbol(baseCode, quoteCode);
    })
  );

  return currencies;
};

export const fetchCurrenciesByNotation = async (
  source: unknown
): Promise<Currency[]> => {
  if (!source || typeof source !== 'string') {
    throw new Error('Unable to fetch currencies: Invalid notation');
  }

  const symbols = source
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

  const TODO_HARD_LIMIT = 5;

  if (symbols.length > TODO_HARD_LIMIT) {
    throw new Error(
      `Too many symbols: ${symbols.length} (max ${TODO_HARD_LIMIT})`
    );
  }

  const currencies = await fetchCurrenciesBySymbols(symbols);

  return currencies;
};
