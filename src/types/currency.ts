import type { CODES } from '../constants/currency';
import type { Branded } from './common';

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;

export type DateNumber = Branded<number, 'DateNumber'>;

export type RateNumber = Branded<number, 'RateNumber'> | null;

export type DateRate = [DateNumber, RateNumber];

export type Currency = Readonly<{
  head: ['date', SymbolString];
  body: DateRate[];
}>;
