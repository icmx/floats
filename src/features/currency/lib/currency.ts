import { PIVOT_CODE } from '../config/codes';
import type { CodeString, Currency, Tick } from '../types';
import { toRateNumber } from './numbers';
import { splitSymbolToCodes } from './symbols';
import { alignTicks } from './ticks';

/**
 * @todo Maybe remove alignment (I'm not sure)
 * @todo Document this entry
 * @todo Test this entry
 */
export const createCurrency = (
  baseCode: CodeString,
  quoteCode: CodeString,
  body: Tick[]
): Currency => {
  return {
    head: ['date', `${baseCode}${quoteCode}`],
    body: alignTicks(body),
  };
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const createPivotCurrency = (): Currency => {
  return createCurrency(PIVOT_CODE, PIVOT_CODE, []);
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
 * @todo Document this entry
 * @todo Test this entry
 */
export const isPivotCurrency = (currency: Currency): boolean => {
  return currency.head[1] === `${PIVOT_CODE}${PIVOT_CODE}`;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const getCurrencyCodes = (
  currency: Currency
): [CodeString, CodeString] => {
  return splitSymbolToCodes(currency.head[1]);
};
