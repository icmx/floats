import { CODES, PIVOT_CURRENCY_CODE } from './config/codes';
import type { SymbolString } from './types';

export const CODE_LENGTH = PIVOT_CURRENCY_CODE.length;

export const SYMBOL_LENGTH = CODE_LENGTH * 2;

// @todo: try to avoid, this is too heavy
export const SYMBOLS = CODES.map((baseCode) => {
  return CODES.filter((code) => {
    return code !== baseCode;
  }).map((quoteCode) => {
    return `${baseCode}${quoteCode}` satisfies SymbolString;
  });
}).flat();

// order matters
export const WELL_KNOWN_SYMBOLS: SymbolString[] = [
  'EURUSD',
  'USDJPY',
  'GBPUSD',
  'USDCHF',
  'AUDUSD',
];

export const EXPLORE_FRACTION_DIGITS = 6;

export const CONVERT_FRACTION_DIGITS = 2;

export const SERIES_COLORS = [
  'var(--color-series-indigo)',
  'var(--color-series-green)',
  'var(--color-series-amber)',
  'var(--color-series-pink)',
  'var(--color-series-cyan)',
  'var(--color-series-orange)',
];
