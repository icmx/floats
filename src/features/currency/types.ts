import { type Branded } from '@/types/brands';
import { type CODES } from './config/codes';

/**
 * Unix epoch milliseconds timestamp (non-negative integer). Represents the start of day (00:00:00 UTC).
 */
export type DateNumber = Branded<number, 'DateNumber'>;

/**
 * Currency exchange rate (non-negative float) or null if unknown.
 */
export type RateNumber = Branded<number, 'RateNumber'> | null;

/**
 * Currency exchange rate for a single date (day).
 */
export type Tick = [DateNumber, RateNumber];

/**
 * Currency three-letter code like `USD` or `EUR`.
 */
export type CodeString = (typeof CODES)[number];

/**
 * Currency pair six-letter code like `EURUSD` or `USDJPY`.
 *
 * - **Base code** is from the left
 * - **Quote code** is from the right
 *
 * Base/Quote means "how much of Quote will I get for 1 Base?"
 */
export type SymbolString = `${CodeString}${CodeString}`;

/**
 * Tabular structure of Currency exchange rates for a series of days.
 */
export type Currency = Readonly<{
  /** Head row: date and symbol string columns */
  head: ['date', SymbolString];

  /** Data rows: each item represents a single day */
  body: Tick[];
}>;

/**
 * @todo: make more common and move
 */
export type QueryParams = {
  by: string[];
};
