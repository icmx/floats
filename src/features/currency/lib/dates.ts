import { MS_1_DAY } from '../constants';
import type { DateNumber } from '../types';

/**
 * Exact length of date value in text.
 *
 * Currently `10` characters since it's ISO 8601 date.
 */
export const DATE_TEXT_LENGTH = 'YYYY-MM-DD'.length;

/**
 * Creates a new DateNumber that is one day later than source.
 */
export const addDayToDateNumber = (
  dateNumber: DateNumber
): DateNumber => {
  return (dateNumber + MS_1_DAY) as DateNumber;
};

/**
 * Parses a DateNumber from ISO date text.
 *
 * @param text ISO 8601 date in strict YYYY-MM-DD format
 * @returns number of milliseconds in the start of date (00:00:00 UTC)
 *
 * @throws When text length does not match format length
 * @throws When text is not suitable to extract year-month-date and produce a date number
 *
 * @todo Maybe use just `Date.parse` internally
 */
export const parseDateNumber = (text: string): DateNumber => {
  if (text.length !== DATE_TEXT_LENGTH) {
    throw new Error(`Invalid date value: "${text}"`);
  }

  const year = Number.parseInt(text.slice(0, 4));
  const month = Number.parseInt(text.slice(5, 7));
  const day = Number.parseInt(text.slice(8, 10));

  const date = Date.UTC(year, month - 1, day);

  if (Number.isNaN(date)) {
    throw new Error(`Invalid date value: "${text}"`);
  }

  return date as DateNumber;
};
