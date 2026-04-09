import { describe, expect, it } from 'vitest';
import type { DateNumber, RateNumber, Tick } from '../types';
import { DATE_TEXT_LENGTH } from './dates';
import { RATE_TEXT_MIN_LENGTH } from './rates';
import {
  alignTicks,
  parseTick,
  parseTicks,
  TICK_LINE_MIN_LENGTH,
  TICK_SEPARATOR_LENGTH,
} from './ticks';

const createDateNumber = (
  year: number,
  month: number,
  day: number
): DateNumber => {
  return Date.UTC(year, month - 1, day) as DateNumber;
};

const createTick = (
  date: [number, number, number],
  rate: number | null
): Tick => {
  const [year, month, day] = date;

  return [
    Date.UTC(year, month - 1, day) as DateNumber,
    rate as RateNumber,
  ];
};

describe('TICK_SEPARATOR_LENGTH', () => {
  it('should be equal to CSV separator length, i.e. comma', () => {
    const separator = ',';

    expect(TICK_SEPARATOR_LENGTH).toBe(separator.length);
  });
});

describe('TICK_LINE_MIN_LENGTH', () => {
  // i know, i know...
  it('should be equal to the sum of date and rate pattern lengths and separator length', () => {
    expect(TICK_LINE_MIN_LENGTH).toBe(
      DATE_TEXT_LENGTH + TICK_SEPARATOR_LENGTH + RATE_TEXT_MIN_LENGTH
    );
  });
});

describe('parseTick', () => {
  it('should return a tuple of 2', () => {
    const source = parseTick('2020-05-18,12.345678');

    expect(source).toHaveLength(2);
  });

  it('should parse a valid CSV text line with float rate', () => {
    const [date, rate] = parseTick('2020-05-18,12.345678');

    expect(date).toBe(createDateNumber(2020, 5, 18));
    expect(rate).toBe(12.345678);
  });

  it('should parse a valid CSV text line with integer rate', () => {
    const [date, rate] = parseTick('2020-10-09,123');

    expect(date).toBe(createDateNumber(2020, 10, 9));
    expect(rate).toBe(123);
  });

  it('should parse a CSV text line with zero rate', () => {
    const [, rate] = parseTick('2021-03-14,0');

    expect(rate).toBe(0);
  });

  it('should parse a CSV text surrounded by whitespaces', () => {
    const [date, rate] = parseTick('   2022-08-01,12.34   ');

    expect(date).toBe(createDateNumber(2022, 8, 1));
    expect(rate).toBe(12.34);
  });

  it('should throw for empty string', () => {
    expect(() => parseTick('')).toThrow();
  });

  it('should throw for too short text', () => {
    expect(() => parseTick('2020-01-15')).toThrow();
  });

  it('should throw for text with only date and comma', () => {
    expect(() => parseTick('2020-01-15,')).toThrow();
  });

  it('should throw when date value is invalid', () => {
    expect(() => parseTick('not-a-date,1.5')).toThrow();
  });

  it('should throw when rate value is invalid', () => {
    expect(() => parseTick('2020-01-15,not-a-rate')).toThrow();
  });
});

describe('parseTicks', () => {
  it('should parse a single CSV text line', () => {
    const csv = '2020-01-01,1.0\n';
    const ticks = parseTicks(csv);

    expect(ticks).toHaveLength(1);

    const [date, rate] = ticks[0];

    expect(date).toBe(createDateNumber(2020, 1, 1));
    expect(rate).toBe(1.0);
  });

  it('should parse multiple CSV lines', () => {
    const csv = '2020-01-01,1.0\n2020-01-02,1.2\n2020-01-03,1.6\n';
    const ticks = parseTicks(csv);

    expect(ticks).toHaveLength(3);
  });

  it('should maintain original order', () => {
    const csv = '2020-01-03,3.0\n2020-01-01,1.0\n2020-01-02,2.0\n';
    const ticks = parseTicks(csv);

    expect(ticks[0][0]).toBe(createDateNumber(2020, 1, 3));
    expect(ticks[1][0]).toBe(createDateNumber(2020, 1, 1));
    expect(ticks[2][0]).toBe(createDateNumber(2020, 1, 2));
  });

  it('should throw for invalid line between valid lines', () => {
    const csv = '2024-01-01,1.0\nINVALID\n2024-01-03,1.2\n';

    expect(() => parseTicks(csv)).toThrow();
  });
});

describe('alignTicks', () => {
  it('should return empty array for empty input', () => {
    const source: Tick[] = alignTicks([]);
    const result: Tick[] = [];

    expect(source).toEqual(result); // same structure
    expect(source).not.toBe(result); // different ref
  });

  it('should return single tick as is', () => {
    const source: Tick[] = [createTick([2020, 1, 15], 1.5)];
    const result = alignTicks(source);

    expect(result[0][1]).toBe(1.5);

    expect(source).toEqual(result); // sate structure
    expect(source).not.toBe(result); // different ref
  });

  it('should keep consecutive days unchanged', () => {
    const source: Tick[] = [
      createTick([2020, 1, 1], 1.01),
      createTick([2020, 1, 2], 1.02),
      createTick([2020, 1, 3], 1.03),
    ];

    const result = alignTicks(source);

    expect(result[0][1]).toBe(1.01);
    expect(result[1][1]).toBe(1.02);
    expect(result[2][1]).toBe(1.03);

    expect(source).toEqual(result); // sate structure
    expect(source).not.toBe(result); // different ref
  });

  it('should fill missing days gaps by last known rate', () => {
    const source: Tick[] = [
      createTick([2020, 1, 1], 1.0),
      createTick([2020, 1, 4], 2.0), // gap for 2 days
    ];

    const result = alignTicks(source);

    expect(result).toHaveLength(4); // 2 days + 2 gaps = 4

    // 2020-01-01 (original)
    expect(result[0][0]).toBe(createDateNumber(2020, 1, 1));
    expect(result[0][1]).toBe(1.0);

    // 2020-01-02 (filled gap)
    expect(result[1][0]).toBe(createDateNumber(2020, 1, 2));
    expect(result[1][1]).toBe(1.0);

    // 2020-01-03 (filled gap)
    expect(result[2][0]).toBe(createDateNumber(2020, 1, 3));
    expect(result[2][1]).toBe(1.0);

    // 2020-01-04 (original)
    expect(result[3][0]).toBe(createDateNumber(2020, 1, 4));
    expect(result[3][1]).toBe(2.0);
  });

  it('should fill gap after rate change', () => {
    const source: Tick[] = [
      createTick([2020, 1, 1], 1.0),
      createTick([2020, 1, 2], 8.0),
      createTick([2020, 1, 5], 3.0), // ^- gap for 2 days
    ];

    const result = alignTicks(source);

    expect(result).toHaveLength(5);

    // gaps are filled by using 8.0
    expect(result[2][1]).toBe(8.0);
    expect(result[3][1]).toBe(8.0);
    expect(result[4][1]).toBe(3.0);
  });

  it('should handle month gap correctly', () => {
    const source: Tick[] = [
      createTick([2020, 1, 30], 1.0),
      createTick([2020, 2, 2], 2.0),
    ];

    const result = alignTicks(source);

    expect(result).toHaveLength(4); // -01-30, -01-31, -02-01, -02-02
    expect(result[1][0]).toBe(createDateNumber(2020, 1, 31));
    expect(result[2][0]).toBe(createDateNumber(2020, 2, 1));
  });

  it('should throw for ticks not in chronological order', () => {
    const source: Tick[] = [
      createTick([2020, 1, 5], 1.0),
      createTick([2020, 1, 1], 2.0), // past date after future
    ];

    expect(() => alignTicks(source)).toThrow();
  });

  it('should throw for ticks with same dates', () => {
    const source: Tick[] = [
      createTick([2024, 1, 1], 1.0),
      createTick([2024, 1, 1], 2.0),
    ];

    expect(() => alignTicks(source)).toThrow();
  });
});
