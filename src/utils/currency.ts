import { SYMBOLS } from '../constants/currency';
import type { CodeString, SymbolString } from '../types/currency';

export const validateSymbolString = (source: unknown): SymbolString => {
  if (!source || typeof source !== 'string') {
    throw new Error('Invalid symbol.');
  }

  const symbol = source as SymbolString;

  if (symbol.length !== 6 || !SYMBOLS.includes(symbol)) {
    throw new Error(`No such symbol: "${symbol}".`);
  }

  return symbol;
};

export const splitSymbolToCodeStrings = (
  symbolString: SymbolString
): [CodeString, CodeString] => {
  const baseCode = symbolString.substring(0, 3) as CodeString;
  const quoteCode = symbolString.substring(3, 6) as CodeString;

  return [baseCode, quoteCode];
};

export const parseSymbolStringsToTuples = (
  rawSymbolStrings: string[]
): [CodeString, CodeString][] => {
  return rawSymbolStrings.map((rawSymbolString) => {
    if (!rawSymbolString) {
      throw new Error();
    }

    if (rawSymbolString.length !== 6) {
      throw new Error();
    }

    const symbolString = validateSymbolString(rawSymbolString);
    const [baseCodeString, quoteCodeString] =
      splitSymbolToCodeStrings(symbolString);

    return [baseCodeString, quoteCodeString];
  });
};
