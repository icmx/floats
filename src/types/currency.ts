import type { CODES } from '../constants/currency';

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;

export type DateNumber = number;

export type RateNumber = number | null;

export type DateRate = [DateNumber, RateNumber];

export type DateRates = [DateNumber, ...RateNumber[]];

export type Currency = Readonly<{
  head: ['date', SymbolString];
  body: DateRate[];
}>;

export type Currencies = Readonly<{
  head: ['date', ...SymbolString[]];
  body: DateRates[];
}>;
