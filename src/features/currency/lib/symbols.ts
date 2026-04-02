import { SYMBOL_LENGTH, SYMBOLS, CODE_LENGTH } from '../constants';
import type { SymbolString, CodeString } from '../types';

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
