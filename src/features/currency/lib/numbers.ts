import { type DateNumber, type RateNumber } from '../types';

/**
 * Casts a plain number value into a branded DateNumber.
 *
 * Internally does nothing, used only to cast a type.
 */
export const toDateNumber = (value: number): DateNumber => {
  return value as DateNumber;
};

/**
 * Parses a DateNumber from ISO 8601 date text (`YYYY-MM-DD` form).
 *
 * **Note:** this function does not validate the date value and assumes a parsable text. It is intended to be used only while Ticks parsing internally.
 *
 * @todo Maybe use just `Date.parse` internally
 */
export const parseDateNumber = (text: string): DateNumber => {
  const year = Number.parseInt(text.slice(0, 4));
  const month = Number.parseInt(text.slice(5, 7));
  const day = Number.parseInt(text.slice(8, 10));

  const date = Date.UTC(year, month - 1, day);

  return date as DateNumber;
};

/**
 * Casts a plain number/null value into a branded RateNumber.
 *
 * Internally does nothing, used only to cast a type.
 */
export const toRateNumber = (value: number | null): RateNumber => {
  return value as RateNumber;
};

/**
 * Parses a RateNumber from a text representing numeric value.
 *
 * **Note:** this function does not validate the rate value and assumes a parsable text. It is intended to be used only while Ticks parsing internally.
 */
export const parseRateNumber = (text: string): RateNumber => {
  const rate = Number.parseFloat(text);

  return rate as RateNumber;
};
