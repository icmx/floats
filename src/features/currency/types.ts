import { type Branded } from '@/types/brands';
import { type CODES } from './config/codes';

/**
 * A Unix epoch integer milliseconds timestamp. Represents the start of day (00:00:00 UTC).
 */
export type DateNumber = Branded<number, 'DateNumber'>;

/**
 * A currency exchange rate number (precision may vary) if available.
 */
export type RateNumber = Branded<number, 'RateNumber'> | null;

/**
 * A currency rate for a single date (day).
 */
export type Tick = [DateNumber, RateNumber];

export type CodeString = (typeof CODES)[number];

export type SymbolString = `${CodeString}${CodeString}`;

export type Currency = Readonly<{
  head: ['date', SymbolString];
  body: Tick[];
}>;

/**
 * @todo: make more common and move
 */
export type QueryParams = {
  by: string[];
};
