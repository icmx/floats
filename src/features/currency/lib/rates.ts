import { type RateNumber } from '../types';

/**
 * Minimum length of rate value in text.
 *
 * Currently `1` since at least one digit is required to parse valid rate.
 */
export const RATE_TEXT_MIN_LENGTH = 1;

/**
 * Creates unknown (not available) RateNumber which is `null`.
 */
export const createUnknownRateNumber = (): RateNumber => {
  return null as RateNumber;
};

/**
 * Creates RateNumber from division of two RateNumbers (`a / b`).
 *
 * **Note:** both `a` and `b` must be positive numbers.
 *
 * @param a Dividend
 * @param b Divisor
 * @returns Quotient
 *
 * @throws When `a` is not a positive number
 * @throws When `b` is not a positive number
 */
export const createDivisionRateNumber = (
  a: RateNumber,
  b: RateNumber
): RateNumber => {
  if (!a || a < 0) {
    throw new Error(`Unable to divide: a is ${a}`);
  }

  if (!b || b < 0) {
    throw new Error(`Unable to divide: b is ${b}`);
  }

  return (a / b) as RateNumber;
};

/**
 * Parses a RateNumber from a text representing numeric value.
 *
 * **Note:** does not produce `null` values.
 *
 * @param text Numeric text to parse
 * @returns zero or positive float number
 *
 * @throws When value is unparsable (considered as `NaN`)
 * @throws When parsed value is negative
 */
export const parseRateNumber = (text: string): RateNumber => {
  const rate = Number.parseFloat(text);

  if (Number.isNaN(rate)) {
    throw new Error(`Invalid rate value: "${text}"`);
  }

  if (rate < 0) {
    throw new Error(`Negative rate value: "${text}"`);
  }

  return rate as RateNumber;
};
