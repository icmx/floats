import { PIVOT_CODE } from '../config/codes';
import { type CodeString, type Currency, type Tick } from '../types';
import { toRateNumber } from './numbers';
import { splitSymbolToCodes } from './symbols';
import { alignTicks } from './ticks';

/**
 * Creates a Currency exchange rate structure from existing values.
 *
 * This function guarantees that created Currency's Ticks are well-aligned, i.e. goes chronologically, has no missing days or missing rates in between.
 */
export const createCurrency = (
  baseCode: CodeString,
  quoteCode: CodeString,
  ticks: Tick[]
): Currency => {
  return {
    head: ['date', `${baseCode}${quoteCode}`],
    body: alignTicks(ticks),
  };
};

/**
 * Creates an empty Currency that is intended to be a pivot structure.
 *
 * This structure have pivot for both base and quote codes, and is used for internal cross-rate calculations.
 *
 * Current pivot currency code is **EUR**.
 */
export const createPivotCurrency = (): Currency => {
  return createCurrency(PIVOT_CODE, PIVOT_CODE, []);
};

/**
 * Creates a derived Currency from base and quote Currencies by calculating a cross-rate (see docs for cross-rating).
 *
 * @throws When base and quote currencies have different base codes (e.g. EURCNY-USDCHF: EUR is not USD)
 * @throws When base and quote currencies have no intersections (i.e. their Ticks arrays has no items with the same DateNumbers)
 *
 * @todo Describe cross-rating in docs
 */
export const createCrossCurrency = (
  base: Currency,
  quote: Currency
): Currency => {
  const [
    [baseBaseCode, baseQuoteCode],
    [quoteBaseCode, quoteQuoteCode],
  ] = [getCurrencyCodes(base), getCurrencyCodes(quote)];

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
 * Returns `true` if Currency is a pivot one, and is suitable for internal cross-rate calculations.
 *
 * Current pivot currency code is **EUR**.
 */
export const isPivotCurrency = (currency: Currency): boolean => {
  const hasPivotCodes =
    currency.head[1] === `${PIVOT_CODE}${PIVOT_CODE}`;

  const isEmpty = currency.body.length === 0;

  return hasPivotCodes && isEmpty;
};

/**
 * Extracts both base and quote codes from a Currency structure.
 */
export const getCurrencyCodes = (
  currency: Currency
): [CodeString, CodeString] => {
  return splitSymbolToCodes(currency.head[1]);
};
