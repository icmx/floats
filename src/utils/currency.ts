import {
  CODE_LENGTH,
  PIVOT_CURRENCY_CODE,
  SERIES_COLORS,
  SYMBOL_LENGTH,
  SYMBOLS,
} from '../constants/currency';
import type {
  CodeString,
  Currency,
  DateRate,
  SymbolString,
} from '../types/currency';

export const getSeriesColor = (seriesIndex: number): string => {
  return SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
};

export const isSymbolString = (
  source: unknown
): source is SymbolString => {
  if (!source || typeof source !== 'string') {
    return false;
  }

  const symbol = source as SymbolString;

  if (symbol.length !== SYMBOL_LENGTH) {
    return false;
  }

  if (!SYMBOLS.includes(symbol)) {
    return false;
  }

  return true;
};

export const splitSymbolToCodes = (
  symbol: SymbolString
): [CodeString, CodeString] => {
  const baseCode = symbol.substring(0, CODE_LENGTH) as CodeString;

  const quoteCode = symbol.substring(
    CODE_LENGTH,
    SYMBOL_LENGTH
  ) as CodeString;

  return [baseCode, quoteCode];
};

export const extractCurrencyCodes = (
  currency: Currency
): [CodeString, CodeString] => {
  return splitSymbolToCodes(currency.head[1]);
};

export const createCurrency = (
  baseCode: CodeString,
  quoteCode: CodeString,
  body: DateRate[]
): Currency => {
  return {
    head: ['date', `${baseCode}${quoteCode}`],
    body: [...body],
  };
};

export const createPivotCurrency = (): Currency => {
  return createCurrency(PIVOT_CURRENCY_CODE, PIVOT_CURRENCY_CODE, []);
};

export const createCrossCurrency = (
  base: Currency,
  quote: Currency
): Currency => {
  const [
    [baseBaseCode, baseQuoteCode],
    [quoteBaseCode, quoteQuoteCode],
  ] = [extractCurrencyCodes(base), extractCurrencyCodes(quote)];

  if (baseBaseCode !== quoteBaseCode) {
    throw new Error(
      `Base codes must be the same. Now: "${baseBaseCode}/*", "${quoteBaseCode}/*"`
    );
  }

  const ratesByDates = new Map<
    number,
    { base: number | null; quote: number | null }
  >();

  const emptyRate: { base: number | null; quote: number | null } = {
    base: null,
    quote: null,
  };

  base.body.forEach(([date, rate]) => {
    ratesByDates.set(date, {
      ...(ratesByDates.get(date) || emptyRate),
      base: rate,
    });
  });

  quote.body.forEach(([date, rate]) => {
    ratesByDates.set(date, {
      ...(ratesByDates.get(date) || emptyRate),
      quote: rate,
    });
  });

  if (isPivotCurrency(base)) {
    quote.body.forEach(([date]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || emptyRate),
        base: 1,
      });
    });
  }

  if (isPivotCurrency(quote)) {
    base.body.forEach(([date]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || emptyRate),
        quote: 1,
      });
    });
  }

  const body: DateRate[] = [];

  Array.from(ratesByDates.entries())
    .sort(([prev], [next]) => {
      return prev - next;
    })
    .forEach(([date, { base, quote }]) => {
      if (!base || !quote) {
        return;
      }

      body.push([date, quote / base]);
    });

  return createCurrency(baseQuoteCode, quoteQuoteCode, body);
};

export const isPivotCurrency = (currency: Currency): boolean => {
  return (
    currency.head[1] === `${PIVOT_CURRENCY_CODE}${PIVOT_CURRENCY_CODE}`
  );
};

export const isEmptyCurrency = (currency: Currency): boolean => {
  return currency.body.length === 0;
};
