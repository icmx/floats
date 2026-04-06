import { MS_1_DAY } from '../constants';
import { type Tick } from '../types';
import {
  parseDateNumber,
  parseRateNumber,
  toDateNumber,
} from './numbers';

/**
 * RegExp pattern of line that is:
 *
 * 1. Can be found in Well-formed CSV, and
 * 2. Can be parsed into a single Tick
 *
 * **Note:** This pattern can't guarantee a valid Tick result, so please do not use it by itself
 */
export const PARSABLE_LINE_PATTERN =
  /^\d{4}-\d{2}-\d{2},\d{1,16}(\.\d{1,16})?$/;

/**
 * Parses an array of Ticks from CSV text.
 *
 * @param text Well-formed CSV text (see docs for Well-formed CSV format definition)
 * @returns Array of Ticks in original order (i.e. correct chronological order not guaranteed)
 *
 * @throws When empty text is passed
 * @throws When any line of text is not parsable to a Tick
 *
 * @todo Describe Well-formed CSV in docs
 */
export const parseTicks = (text: string): Tick[] => {
  const lines = text.trim().split('\n');
  const ticks: Tick[] = [];

  if (lines.length === 0) {
    throw new Error(`Empty CSV text passed: "${text}"`);
  }

  for (const line of lines) {
    if (!PARSABLE_LINE_PATTERN.test(line)) {
      throw new Error(`Invalid line: "${line}"`);
    }

    const [dateText, rateText] = line.split(',');

    ticks.push([parseDateNumber(dateText), parseRateNumber(rateText)]);
  }

  return ticks;
};

/**
 * Aligns an array of Ticks:
 *
 * 1. Ensures their chronological order with only unique dates
 * 2. Adds extra Ticks for missing days (in between existing Ticks)
 * 3. Fills missing rates by using nearest previous existing rate available
 *
 * **Note:** result array length may be greater than source due to (2).
 *
 * @param ticks Array of Ticks, possibly misaligned
 * @returns new aligned array of Ticks
 *
 * @throws When any Tick is not in chronological order (i.e. past date goes after future)
 * @throws When any Tick has the same date as previous (i.e. equal dates are forbidden)
 */
export const alignTicks = (ticks: Tick[]): Tick[] => {
  if (ticks.length < 2) {
    return ticks;
  }

  const result: Tick[] = [];

  let expectedDate = ticks[0][0];
  let lastRate = ticks[0][1];

  for (const [date, rate] of ticks) {
    if (expectedDate > date) {
      throw new Error(`Invalid order at: ${date}:${rate}`);
    }

    while (expectedDate < date) {
      result.push([expectedDate, lastRate]);

      expectedDate = toDateNumber(expectedDate + MS_1_DAY);
    }

    result.push([date, rate]);

    expectedDate = toDateNumber(expectedDate + MS_1_DAY);
    lastRate = rate;
  }

  return result;
};
