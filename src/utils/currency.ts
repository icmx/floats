import {
  CODE_LENGTH,
  PIVOT_CURRENCY_CODE,
  SYMBOL_LENGTH,
  SYMBOLS,
} from '../constants/currency';
import type {
  CodeString,
  Currency,
  RateTuple,
  SymbolString,
} from '../types/currency';

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

export const createCurrency = (
  baseCode: CodeString,
  quoteCode: CodeString,
  data: RateTuple[]
): Currency => {
  return {
    baseCode,
    quoteCode,
    data,
  };
};

export const createPivotCurrency = (): Currency => {
  return createCurrency(PIVOT_CURRENCY_CODE, PIVOT_CURRENCY_CODE, []);
};

export const createCrossCurrency = (
  base: Currency,
  quote: Currency
): Currency => {
  if (base.baseCode !== quote.baseCode) {
    throw new Error(
      `Base codes must be the same. Now: "${base.baseCode}*", "${quote.baseCode}*"`
    );
  }

  if (isPivotCurrency(base)) {
    return quote;
  }

  if (isPivotCurrency(quote)) {
    return base;
  }

  const ratesByDates = new Map<
    number,
    { left?: number; right?: number }
  >();

  base.data.forEach(([date, rate]) => {
    ratesByDates.set(date, {
      ...(ratesByDates.get(date) || {}),
      left: rate,
    });
  });

  quote.data.forEach(([date, rate]) => {
    ratesByDates.set(date, {
      ...(ratesByDates.get(date) || {}),
      right: rate,
    });
  });

  const data: RateTuple[] = [];

  Array.from(ratesByDates.entries())
    .sort(([prev], [next]) => {
      return prev - next;
    })
    .forEach(([date, { left, right }]) => {
      if (!left || !right) {
        return;
      }

      data.push([date, right / left]);
    });

  return createCurrency(base.quoteCode, quote.quoteCode, data);
};

export const isPivotCurrency = (currency: Currency): boolean => {
  return (
    currency.baseCode === PIVOT_CURRENCY_CODE &&
    currency.quoteCode === PIVOT_CURRENCY_CODE
  );
};

export const isEmptyCurrency = (currency: Currency): boolean => {
  return currency.data.length === 0;
};

export const LOCALES = navigator?.languages || ['en'];

export const EXPLORE_FRACTION_DIGITS = 6;

export const CONVERT_FRACTION_DIGITS = 2;

export const exploreFormatter = new Intl.NumberFormat(LOCALES, {
  maximumFractionDigits: EXPLORE_FRACTION_DIGITS,
  minimumFractionDigits: EXPLORE_FRACTION_DIGITS,
  roundingMode: 'halfEven',
});

export const convertFormatter = new Intl.NumberFormat(LOCALES, {
  maximumFractionDigits: CONVERT_FRACTION_DIGITS,
  minimumFractionDigits: CONVERT_FRACTION_DIGITS,
  roundingMode: 'halfEven',
});
