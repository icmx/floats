import { type Tick } from '../types';
import {
  addDayToDateNumber,
  DATE_TEXT_LENGTH,
  parseDateNumber,
} from './dates';
import { parseRateNumber, RATE_TEXT_MIN_LENGTH } from './rates';

/**
 * Exact length of separator in Tick CSV text line.
 *
 * Currently `1` since it's a single comma `,` character.
 */
export const TICK_SEPARATOR_LENGTH = 1;

/**
 * Minimum length of Tick CSV text line to be correctly parsed (potentially).
 */
export const TICK_LINE_MIN_LENGTH =
  DATE_TEXT_LENGTH + TICK_SEPARATOR_LENGTH + RATE_TEXT_MIN_LENGTH;

/**
 * Parses a single tick from CSV text line.
 *
 * @param text single line of Well-formed CSV text
 * @returns parsed Tick tuple
 *
 * @throws When invalid or too short text is passed
 * @throws When DateNumber value cannot be parsed
 * @throws When RateNumber value cannot be parsed
 */
export const parseTick = (text: string): Tick => {
  const line = text.trim();

  if (line.length < TICK_LINE_MIN_LENGTH) {
    throw new Error(`Invalid CSV line: "${line}"`);
  }

  const dateStart = 0;
  const dateEnd = DATE_TEXT_LENGTH;

  const dateText = line.slice(dateStart, dateEnd);
  const dateNumber = parseDateNumber(dateText);

  const rateStart = DATE_TEXT_LENGTH + TICK_SEPARATOR_LENGTH;
  const rateEnd = line.length;

  const rateText = line.slice(rateStart, rateEnd);
  const rateNumber = parseRateNumber(rateText);

  return [dateNumber, rateNumber];
};

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
    const tick = parseTick(line);

    ticks.push(tick);
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
    return [...ticks];
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

      expectedDate = addDayToDateNumber(expectedDate);
    }

    result.push([date, rate]);

    expectedDate = addDayToDateNumber(expectedDate);
    lastRate = rate;
  }

  return result;
};
