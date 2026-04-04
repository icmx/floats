import { MS_1_DAY } from '../constants';
import type { Tick } from '../types';
import { parseDateNumber, parseRateNumber, toDateNumber } from './numbers';

/**
 * @todo Document this entry
 */
export const PARSABLE_CSV_LINE_PATTERN =
  /^\d{4}-\d{2}-\d{2},\d{1,16}(\.\d{1,16})?$/;

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const parseTicks = (csv: string): Tick[] => {
  if (!csv) {
    throw new Error(`Empty CSV text passed: "${csv}"`);
  }

  const lines = csv.trim().split('\n');
  const ticks: Tick[] = [];

  for (const line of lines) {
    if (!PARSABLE_CSV_LINE_PATTERN.test(line)) {
      throw new Error(`Invalid line: "${line}"`);
    }

    const [dateText, rateText] = line.split(',');

    ticks.push([parseDateNumber(dateText), parseRateNumber(rateText)]);
  }

  return ticks;
};

/**
 * @todo Document this entry
 * @todo Test this entry
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
