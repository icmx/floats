import { describe, expect, it } from 'vitest';
import { type DateNumber, type RateNumber, type Tick } from '../types';
import {
  createCrossCurrency,
  createCurrency,
  createPivotCurrency,
  getCurrencyCodes,
  isPivotCurrency,
} from './currency';

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

describe('createCurrency', () => {
  it('should create a Currency with correct head', () => {
    const currency = createCurrency('USD', 'EUR', []);

    expect(currency.head).toEqual(['date', 'USDEUR']);
  });

  it('should align ticks in body', () => {
    const currency = createCurrency('EUR', 'USD', [
      createTick([2020, 1, 1], 1.0),
      createTick([2020, 1, 3], 2.0), // one day gap
    ]);

    expect(currency.body).toHaveLength(3); // 1 - filled 2 - 3
  });

  it('should create empty body from empty ticks', () => {
    const currency = createCurrency('EUR', 'USD', []);

    expect(currency.body).toEqual([]);
  });
});

describe('createPivotCurrency', () => {
  it('should create pivot currency with pivot symbols in head', () => {
    const currency = createPivotCurrency();

    expect(currency.head[1]).toBe('EUREUR');
  });

  it('should have empty body', () => {
    const currency = createPivotCurrency();

    expect(currency.body).toHaveLength(0);
  });

  it('should be identified as pivot currency by isPivotCurrency', () => {
    const currency = createPivotCurrency();

    expect(isPivotCurrency(currency)).toBe(true);
  });
});

describe('createCrossCurrency', () => {
  describe('with pivot as base', () => {
    it('should return quote body as is', () => {
      const base = createPivotCurrency();

      const quote = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.1),
        createTick([2020, 1, 2], 1.2),
      ]);

      const cross = createCrossCurrency(base, quote);

      expect(cross.head[1]).toBe('EURUSD');

      expect(cross.body).toHaveLength(2);
      expect(cross.body[0][1]).toBe(1.1);
      expect(cross.body[1][1]).toBe(1.2);
    });
  });

  describe('with pivot as quote', () => {
    it('should return inverted base rates (1/rate)', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 2),
        createTick([2020, 1, 2], 4),
      ]);

      const quote = createPivotCurrency();

      const cross = createCrossCurrency(base, quote);

      expect(cross.head[1]).toBe('USDEUR');

      expect(cross.body).toHaveLength(2);
      expect(cross.body[0][1]).toBeCloseTo(0.5);
      expect(cross.body[1][1]).toBeCloseTo(0.25);
    });

    it('should handle null rates in base and return null', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 2.0),
        createTick([2020, 1, 2], null),
      ]);

      const quote = createPivotCurrency();

      const cross = createCrossCurrency(base, quote);

      expect(cross.body[0][1]).toBeCloseTo(0.5);
      expect(cross.body[1][1]).toBeNull();
    });
  });

  describe('with two regular currencies', () => {
    it('should compute cross-rate (quoteRate / baseRate)', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.1),
        createTick([2020, 1, 2], 1.2),
      ]);

      const quote = createCurrency('EUR', 'GBP', [
        createTick([2020, 1, 1], 0.85),
        createTick([2020, 1, 2], 0.86),
      ]);

      const cross = createCrossCurrency(base, quote);

      expect(cross.head[1]).toBe('USDGBP');

      expect(cross.body).toHaveLength(2);
      expect(cross.body[0][1]).toBeCloseTo(0.85 / 1.1);
      expect(cross.body[1][1]).toBeCloseTo(0.86 / 1.2);
    });

    it('should intersect overlapping date ranges', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.1),
        createTick([2020, 1, 2], 1.2),
        createTick([2020, 1, 3], 1.3),
      ]);

      const quote = createCurrency('EUR', 'GBP', [
        createTick([2020, 1, 2], 0.85),
        createTick([2020, 1, 3], 0.86),
      ]);

      const cross = createCrossCurrency(base, quote);

      expect(cross.body).toHaveLength(2); // -01-02, -01-03
      expect(cross.body[0][0]).toBe(createDateNumber(2020, 1, 2));
      expect(cross.body[1][0]).toBe(createDateNumber(2020, 1, 3));
    });

    it('should handle null rates in either currency → null result', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.1),
        createTick([2020, 1, 2], null),
      ]);

      const quote = createCurrency('EUR', 'GBP', [
        createTick([2020, 1, 1], 0),
        createTick([2020, 1, 2], 0.86),
      ]);

      const cross = createCrossCurrency(base, quote);

      expect(cross.body[0][1]).toBeNull();
      expect(cross.body[1][1]).toBeNull();
    });

    it('should throw for unequal base codes', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.0),
      ]);

      const quote = createCurrency('USD', 'GBP', [
        createTick([2020, 1, 1], 0.8),
      ]);

      expect(() => createCrossCurrency(base, quote)).toThrow();
    });

    it('should throw for non-intersecting date ranges', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.0),
        createTick([2020, 1, 2], 1.1),
      ]);

      const quote = createCurrency('EUR', 'GBP', [
        createTick([2020, 6, 1], 0.85),
        createTick([2020, 6, 2], 0.86),
      ]);

      expect(() => createCrossCurrency(base, quote)).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle single overlapping day', () => {
      const base = createCurrency('EUR', 'USD', [
        createTick([2020, 1, 1], 1.1),
      ]);

      const quote = createCurrency('EUR', 'GBP', [
        createTick([2020, 1, 1], 0.85),
      ]);

      const cross = createCrossCurrency(base, quote);

      expect(cross.body).toHaveLength(1);
      expect(cross.body[0][1]).toBeCloseTo(0.85 / 1.1);
    });

    it('should produce correct symbol from base quote and quote quote', () => {
      const base = createCurrency('EUR', 'CNY', [
        createTick([2020, 1, 1], 7.8),
      ]);

      const quote = createCurrency('EUR', 'CHF', [
        createTick([2020, 1, 1], 0.95),
      ]);

      const cross = createCrossCurrency(base, quote);
      expect(cross.head[1]).toBe('CNYCHF');
    });

    it('should handle both empty currencies (pivot vs pivot is not cross)', () => {
      const pivot1 = createPivotCurrency();
      const pivot2 = createPivotCurrency();

      const cross = createCrossCurrency(pivot1, pivot2);

      expect(cross.body).toHaveLength(0);
      expect(cross.head[1]).toBe('EUREUR');
    });
  });
});

describe('isPivotCurrency', () => {
  it('should return true for pivot currency', () => {
    const currency = createPivotCurrency();

    expect(isPivotCurrency(currency)).toBe(true);
  });

  it('should return false for non-pivot symbol', () => {
    const currency = createCurrency('EUR', 'USD', []);

    expect(isPivotCurrency(currency)).toBe(false);
  });

  it('should return false for currency code with pivot codes but non-empty body', () => {
    const currency = createCurrency('EUR', 'EUR', [
      createTick([2020, 1, 1], 1),
    ]);

    expect(isPivotCurrency(currency)).toBe(false);
  });
});

describe('getCurrencyCodes', () => {
  it('should get base and quote codes', () => {
    const currency = createCurrency('USD', 'EUR', []);

    const [base, quote] = getCurrencyCodes(currency);

    expect(base).toBe('USD');
    expect(quote).toBe('EUR');
  });

  it('should accept pivot currency', () => {
    const currency = createPivotCurrency();
    const [base, quote] = getCurrencyCodes(currency);

    expect(base).toBe('EUR');
    expect(quote).toBe('EUR');
  });
});
