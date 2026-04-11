import { describe, it, expect } from 'vitest';
import { MS_1_DAY } from '../constants';
import { type DateNumber } from '../types';
import {
  addDayToDateNumber,
  DATE_TEXT_LENGTH,
  parseDateNumber,
} from './dates';

const createDateNumber = (
  year: number,
  month: number,
  day: number
): DateNumber => {
  return Date.UTC(year, month - 1, day) as DateNumber;
};

describe('DATE_TEXT_LENGTH', () => {
  it('should have an ISO 8601 YYYY-MM-DD format length value', () => {
    const format = 'YYYY-MM-DD';

    expect(DATE_TEXT_LENGTH).toBe(format.length);
  });
});

describe('addDayToDateNumber', () => {
  it('should add exactly one day', () => {
    const prev = createDateNumber(2020, 1, 1);
    const next = addDayToDateNumber(prev);

    expect(next).toBe(prev + MS_1_DAY);
  });

  it('should handle cross month', () => {
    const prev = createDateNumber(2020, 1, 31);
    const next = createDateNumber(2020, 2, 1);

    expect(addDayToDateNumber(prev)).toBe(next);
  });

  it('should handle cross year', () => {
    const prev = createDateNumber(2020, 12, 31);
    const next = createDateNumber(2021, 1, 1);

    expect(addDayToDateNumber(prev)).toBe(next);
  });

  it('should handle non-leap year: -02-28 .. -03-01', () => {
    const prev = createDateNumber(2023, 2, 28);
    const next = createDateNumber(2023, 3, 1);

    expect(addDayToDateNumber(prev)).toBe(next);
  });

  it('should handle leap year: -02-28 .. -02-29', () => {
    const prev = createDateNumber(2024, 2, 28);
    const next = createDateNumber(2024, 2, 29);

    expect(addDayToDateNumber(prev)).toBe(next);
  });
});

describe('parseDateNumber', () => {
  it('should parse a valid ISO 8601 date string', () => {
    const source = parseDateNumber('2020-02-18');
    const target = createDateNumber(2020, 2, 18);

    expect(source).toBe(target);
  });

  it('should return the same date units', () => {
    const [year, month, day] = [2021, 2, 28];

    const source = createDateNumber(year, month, day);
    const target = new Date(source);

    expect(target.getUTCFullYear()).toBe(year);
    expect(target.getUTCMonth()).toBe(month - 1); // that's an index!
    expect(target.getUTCDate()).toBe(day);
  });

  it('should return start of day (00:00:00 UTC)', () => {
    const numberValue = parseDateNumber('2022-03-02');
    const dateValue = new Date(numberValue);

    expect(dateValue.getUTCHours()).toBe(0);
    expect(dateValue.getUTCMinutes()).toBe(0);
    expect(dateValue.getUTCSeconds()).toBe(0);
    expect(dateValue.getUTCMilliseconds()).toBe(0);
  });

  it('should throw for text shorter than DATE_TEXT_LENGTH', () => {
    expect(() => parseDateNumber('2024-5-6')).toThrow();
  });

  it('should throw for text longer than DATE_TEXT_LENGTH', () => {
    expect(() => parseDateNumber('2024-06-07T')).toThrow();
  });

  it('should throw for empty text', () => {
    expect(() => parseDateNumber('')).toThrow();
  });

  it('should throw for invalid text of valid length', () => {
    expect(() =>
      parseDateNumber('A'.repeat(DATE_TEXT_LENGTH))
    ).toThrow();
  });
});
