import type { CODES } from '../constants/currency';

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;

export type DateRate = [number, number | null];

export type DateRates = [number, ...(number | null)[]];

export type Currency = Readonly<{
  head: ['date', SymbolString];
  body: DateRate[];
}>;

export type Currencies = Readonly<{
  head: ['date', ...SymbolString[]];
  body: DateRates[];
}>;
