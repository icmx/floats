import { describe, expect, it } from 'vitest';
import { type RateNumber } from '../types';
import {
  createDivisionRateNumber,
  createUnknownRateNumber,
  parseRateNumber,
  RATE_TEXT_MIN_LENGTH,
} from './rates';

const createRateNumber = (value: number | null): RateNumber => {
  return value as RateNumber;
};

describe('RATE_TEXT_MIN_LENGTH', () => {
  it('should be equal to 1', () => {
    const minimalRateNumberText = '5';

    expect(RATE_TEXT_MIN_LENGTH).toBe(minimalRateNumberText.length);
  });
});

describe('createUnknownRateNumber', () => {
  it('should return null', () => {
    expect(createUnknownRateNumber()).toBeNull();
  });
});

describe('createDivisionRateNumber', () => {
  it('should divide two positive rate numbers', () => {
    const a = createRateNumber(8);
    const b = createRateNumber(2);

    const target = createDivisionRateNumber(a, b);

    expect(target).toBe(4);
  });

  it('should return fractional result', () => {
    const a = createRateNumber(1);
    const b = createRateNumber(3);

    const target = createDivisionRateNumber(a, b);

    expect(target).toBe(1 / 3);
  });

  it('should throw when `a` is 0', () => {
    const a = createRateNumber(0);
    const b = createRateNumber(1);

    expect(() => createDivisionRateNumber(a, b)).toThrow();
  });

  it('should throw when `a` is negative', () => {
    const a = createRateNumber(-2);
    const b = createRateNumber(1);

    expect(() => createDivisionRateNumber(a, b)).toThrow();
  });

  it('should throw when `a` is null', () => {
    const a = createRateNumber(null);
    const b = createRateNumber(1);

    expect(() => createDivisionRateNumber(a, b)).toThrow();
  });

  it('should throw when `b` is 0', () => {
    const a = createRateNumber(1);
    const b = createRateNumber(0);

    expect(() => createDivisionRateNumber(a, b)).toThrow();
  });

  it('should throw when `b` is negative', () => {
    const a = createRateNumber(1);
    const b = createRateNumber(-2);

    expect(() => createDivisionRateNumber(a, b)).toThrow();
  });

  it('should throw when `b` is null', () => {
    const a = createRateNumber(1);
    const b = createRateNumber(null);

    expect(() => createDivisionRateNumber(a, b)).toThrow();
  });
});

describe('parseRateNumber', () => {
  it('should parse positive integer', () => {
    expect(parseRateNumber('42')).toBe(42);
  });

  it('should parse positive float', () => {
    expect(parseRateNumber('1.234567')).toBe(1.234567);
  });

  it('should parse 0', () => {
    expect(parseRateNumber('0')).toBe(0);
  });

  it('should parse 0.0', () => {
    expect(parseRateNumber('0.0')).toBe(0);
  });

  it('should parse a small positive number', () => {
    expect(parseRateNumber('0.000001')).toBe(0.000001);
  });

  it('should parse a large positive number', () => {
    expect(parseRateNumber('999999.999999')).toBe(999999.999999);
  });

  it('should throw for empty text', () => {
    expect(() => parseRateNumber('')).toThrow();
  });

  it('should throw for non-numeric text', () => {
    expect(() => parseRateNumber('abc')).toThrow();
  });

  it('should throw for negative value', () => {
    expect(() => parseRateNumber('-1.5')).toThrow();
  });
});
