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
  RateNumber,
  SymbolString,
} from '../types/currency';

export const parseCsv = (csv: string): DateRate[] => {
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

// @todo: split and add tests here (very fragile)
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

  type Rate = { base: RateNumber; quote: RateNumber };

  const empty = (): Rate => {
    return { base: null, quote: null };
  };

  const ratesByDates = new Map<number, Rate>();

  const minDate = Math.max(
    base.body.at(0)?.[0] || -Infinity,
    quote.body.at(0)?.[0] || -Infinity
  );

  const maxDate = Math.min(
    base.body.at(-1)?.[0] || Infinity,
    quote.body.at(-1)?.[0] || Infinity
  );

  const MS_1_DAY = 86_400_000;

  for (let date = minDate; date <= maxDate; date += MS_1_DAY) {
    ratesByDates.set(date, empty());
  }

  base.body
    .filter(([date]) => {
      return ratesByDates.has(date);
    })
    .forEach(([date, rate]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || empty()),
        base: rate,
      });
    });

  quote.body
    .filter(([date]) => {
      return ratesByDates.has(date);
    })
    .forEach(([date, rate]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || empty()),
        quote: rate,
      });
    });

  if (isPivotCurrency(base)) {
    Array.from(ratesByDates.entries()).forEach(([date]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || empty()),
        base: 1,
      });
    });
  }

  if (isPivotCurrency(quote)) {
    Array.from(ratesByDates.entries()).forEach(([date]) => {
      ratesByDates.set(date, {
        ...(ratesByDates.get(date) || empty()),
        quote: 1,
      });
    });
  }

  const body: DateRate[] = [];

  Array.from(ratesByDates.entries()).forEach(
    ([date, { base, quote }]) => {
      if (!base || !quote) {
        body.push([date, null]);
      } else {
        body.push([date, quote / base]);
      }
    }
  );

  for (let i = 1; i < body.length; i++) {
    const [, prevRate] = body[i - 1];
    const [date, nextRate] = body[i];

    if (nextRate === null) {
      body[i] = [date, prevRate];
    }
  }

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

export const getSeriesColor = (seriesIndex: number): string => {
  return SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
};
