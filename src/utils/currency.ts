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
  DateNumber,
  DateRate,
  RateNumber,
  SymbolString,
} from '../types/currency';

// @todo: this file is too large and must be splitted later by separators

/**
 * @todo: Move this text
 *
 * Well-formed CSV text for currency rate per date is a specifically
 * restricted form of CSV text format.
 *
 * Files of this format are compiled on server but by architectural
 * reasons must be validated here on client.
 *
 * Format limitations:
 *
 * - Includes only two columns
 * - First column is valid calendar date in ISO 8601 string (YYYY-MM-DD)
 * - Second column is decimal real number (int or float, mostly float)
 * - Always uses commas to separate columns
 * - Always uses periods in numeric values (if necessary)
 * - Never have heading rows (all rows are for data only)
 * - Never have quoted values (never uses quotation characters)
 * - Never have whitespace characters within fields or separators
 */

////////////////////////////////////////////////////////////////////////
// DateRate utils:
//

/**
 * @todo Document this entry
 */
export const PARSABLE_CSV_LINE_PATTERN =
  /^\d{4}-\d{2}-\d{2},\d{1,16}(\.\d{1,16})?$/;

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const parseCsv = (csv: string): DateRate[] => {
  if (!csv) {
    throw new Error(`Empty CSV text passed: "${csv}"`);
  }

  const lines = csv.trim().split('\n');
  const dateRates: DateRate[] = [];

  for (const line of lines) {
    if (!PARSABLE_CSV_LINE_PATTERN.test(line)) {
      throw new Error(`Invalid line: "${line}"`);
    }

    const [dateText, rateText] = line.split(',');

    dateRates.push([
      parseDateNumber(dateText),
      parseRateNumber(rateText),
    ]);
  }

  return dateRates;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const toDateNumber = (value: number): DateNumber => {
  return value as DateNumber;
};

/**
 * @todo Maybe use just `Date.parse`
 * @todo Document this entry
 * @todo Test this entry
 */
export const parseDateNumber = (text: string): DateNumber => {
  const year = Number.parseInt(text.slice(0, 4));
  const month = Number.parseInt(text.slice(5, 7));
  const day = Number.parseInt(text.slice(8, 10));

  const time = Date.UTC(year, month - 1, day);

  if (Number.isNaN(time)) {
    throw new Error(`Invalid date value: "${text}"`);
  }

  return time as DateNumber;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const toRateNumber = (value: number | null): RateNumber => {
  return value as RateNumber;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const parseRateNumber = (text: string): RateNumber => {
  const rate = Number.parseFloat(text);

  if (Number.isNaN(rate)) {
    throw new Error(`Invalid rate value: "${text}"`);
  }

  return rate as RateNumber;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const alignDateRates = (dateRates: DateRate[]): DateRate[] => {
  if (dateRates.length < 2) {
    return dateRates;
  }

  const MS_1_DAY = 86_400_000;
  const result: DateRate[] = [];

  let expectedDate = dateRates[0][0];
  let lastRate = dateRates[0][1];

  for (const [date, rate] of dateRates) {
    if (expectedDate > date) {
      throw new Error(`Invalid order at: ${date}:${rate}`);
    }

    while (expectedDate < date) {
      result.push([expectedDate, lastRate]);

      expectedDate = toDateNumber(expectedDate + MS_1_DAY);
    }

    result.push([date, rate]);

    expectedDate = toDateNumber(expectedDate + MS_1_DAY);
    lastRate = rate;
  }

  return result;
};

////////////////////////////////////////////////////////////////////////
// Currency utils:
//

/**
 * @todo Maybe remove alignment (I'm not sure)
 * @todo Document this entry
 * @todo Test this entry
 */
export const createCurrency = (
  baseCode: CodeString,
  quoteCode: CodeString,
  body: DateRate[]
): Currency => {
  return {
    head: ['date', `${baseCode}${quoteCode}`],
    body: alignDateRates(body),
  };
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const createPivotCurrency = (): Currency => {
  return createCurrency(PIVOT_CURRENCY_CODE, PIVOT_CURRENCY_CODE, []);
};

/**
 * @todo Maybe split for utility ffunctions
 * @todo Document this entry
 * @todo Test this entry
 */
export const createCrossCurrency = (
  base: Currency,
  quote: Currency
): Currency => {
  const [
    [baseBaseCode, baseQuoteCode],
    [quoteBaseCode, quoteQuoteCode],
  ] = [extractCurrencyCodes(base), extractCurrencyCodes(quote)];

  if (baseBaseCode !== quoteBaseCode) {
    const baseSymbol = base.head[1];
    const quoteSymbol = quote.head[1];

    throw new Error(`Unequal bases: "${baseSymbol}:${quoteSymbol}"`);
  }

  const head: Currency['head'] = [
    'date',
    `${baseQuoteCode}${quoteQuoteCode}`,
  ];

  const body: Currency['body'] = [];

  if (isPivotCurrency(base)) {
    return {
      head,
      body: quote.body.map(([date, rate]) => {
        return [date, rate];
      }),
    };
  }

  if (isPivotCurrency(quote)) {
    return {
      head,
      body: base.body.map(([date, rate]) => {
        if (rate) {
          return [date, toRateNumber(1 / rate)];
        } else {
          return [date, toRateNumber(null)];
        }
      }),
    };
  }

  const minDate = Math.max(
    base.body[0]?.[0] ?? -Infinity,
    quote.body[0]?.[0] ?? -Infinity
  );

  const maxDate = Math.min(
    base.body[base.body.length - 1]?.[0] ?? Infinity,
    quote.body[quote.body.length - 1]?.[0] ?? Infinity
  );

  if (minDate > maxDate) {
    const baseSymbol = base.head[1];
    const quoteSymbol = quote.head[1];

    throw new Error(`Not intersected: ${baseSymbol}/${quoteSymbol}`);
  }

  let i = 0;

  while (i < base.body.length && base.body[i][0] < minDate) {
    i++;
  }

  let j = 0;

  while (j < quote.body.length && quote.body[j][0] < minDate) {
    j++;
  }

  while (
    i < base.body.length &&
    j < quote.body.length &&
    base.body[i][0] <= maxDate
  ) {
    const [baseDate, baseRate] = base.body[i];
    const quoteRate = quote.body[j][1];

    if (!baseRate || !quoteRate) {
      body.push([baseDate, toRateNumber(null)]);
    } else {
      body.push([baseDate, toRateNumber(quoteRate / baseRate)]);
    }

    i++;
    j++;
  }

  return { head, body };
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const isPivotCurrency = (currency: Currency): boolean => {
  return (
    currency.head[1] === `${PIVOT_CURRENCY_CODE}${PIVOT_CURRENCY_CODE}`
  );
};

////////////////////////////////////////////////////////////////////////
// Symbol utils:
//

/**
 * @todo Document this entry
 * @todo Test this entry
 */
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

/**
 * @todo Document this entry
 * @todo Test this entry
 */
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

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const extractCurrencyCodes = (
  currency: Currency
): [CodeString, CodeString] => {
  return splitSymbolToCodes(currency.head[1]);
};

////////////////////////////////////////////////////////////////////////
// Musc utils:
//

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const getSeriesColor = (seriesIndex: number): string => {
  return SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
};
