import type { CODES } from '../constants/currency';

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;

export type RateTuple = [number, number];

export type Currency = Readonly<{
  baseCode: CodeString;
  quoteCode: CodeString;
  data: RateTuple[];
}>;
