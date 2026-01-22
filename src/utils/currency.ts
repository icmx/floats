import {
  CODE_LENGTH,
  CODES,
  SYMBOL_LENGTH,
  SYMBOLS,
} from '../constants/currency';
import type { CodeString, SymbolString } from '../types/currency';

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
