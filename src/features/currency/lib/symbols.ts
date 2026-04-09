import { SYMBOL_LENGTH, SYMBOLS, CODE_LENGTH } from '../constants';
import { type SymbolString, type CodeString } from '../types';

/**
 * Returns `true` if source is a valid currency Symbol string (like `USDEUR`).
 *
 * Otherwise returns `false`.
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
 * Split currency Symbol string into a tuple of currency pair Codes (like `USDEUR` become `USD` and `EUR`).
 *
 * **Note:** this function does not perform any validation since expects only valid input.
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
