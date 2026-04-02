import type { DateNumber, RateNumber } from '../types';

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const toDateNumber = (value: number): DateNumber => {
  return value as DateNumber;
};

/**
 * @todo Maybe use just `Date.parse`
 * @todo Document this entry
 * @todo Test this entry
 */
export const parseDateNumber = (text: string): DateNumber => {
  const year = Number.parseInt(text.slice(0, 4));
  const month = Number.parseInt(text.slice(5, 7));
  const day = Number.parseInt(text.slice(8, 10));

  const time = Date.UTC(year, month - 1, day);

  if (Number.isNaN(time)) {
    throw new Error(`Invalid date value: "${text}"`);
  }

  return time as DateNumber;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const toRateNumber = (value: number | null): RateNumber => {
  return value as RateNumber;
};

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const parseRateNumber = (text: string): RateNumber => {
  const rate = Number.parseFloat(text);

  if (Number.isNaN(rate)) {
    throw new Error(`Invalid rate value: "${text}"`);
  }

  return rate as RateNumber;
};
