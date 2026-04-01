import type { Branded } from '../../types/brands';
import { CODES } from './constants';

// @todo: make more common and move
export type QueryParams = {
  by: string[];
};

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;

export type DateNumber = Branded<number, 'DateNumber'>;

export type RateNumber = Branded<number, 'RateNumber'> | null;

export type DateRate = [DateNumber, RateNumber];

export type Currency = Readonly<{
  head: ['date', SymbolString];
  body: DateRate[];
}>;
