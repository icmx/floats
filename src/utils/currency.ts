import {
  CODE_LENGTH,
  CODES,
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

export const validateCodeString = (source: unknown): CodeString => {
  if (!source || typeof source !== 'string') {
    throw new Error('Invalid currency code.');
  }

  const code = source as CodeString;

  if (code.length !== CODE_LENGTH || !CODES.includes(code)) {
    throw new Error(`No such currency code: "${code}".`);
  }

  return code;
};

export const validateSymbolString = (source: unknown): SymbolString => {
  if (!source || typeof source !== 'string') {
    throw new Error('Invalid currency symbol.');
  }

  const symbol = source as SymbolString;

  if (symbol.length !== SYMBOL_LENGTH || !SYMBOLS.includes(symbol)) {
    throw new Error(`No such currency symbol: "${symbol}".`);
  }

  return symbol;
};

export const splitSymbolToCodeStrings = (
  symbolString: SymbolString
): [CodeString, CodeString] => {
  const baseCode = symbolString.substring(0, CODE_LENGTH) as CodeString;
  const quoteCode = symbolString.substring(
    CODE_LENGTH,
    CODE_LENGTH + CODE_LENGTH
  ) as CodeString;

  return [baseCode, quoteCode];
};

export const parseSymbolStringsToTuples = (
  rawSymbolStrings: string[]
): [CodeString, CodeString][] => {
  return rawSymbolStrings.map((rawSymbolString) => {
    const symbolString = validateSymbolString(rawSymbolString);
    const [baseCodeString, quoteCodeString] =
      splitSymbolToCodeStrings(symbolString);

    return [baseCodeString, quoteCodeString];
  });
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
