import { describe, expect, it } from 'vitest';
import {
  type CodeString,
  type DateNumber,
  type RateNumber,
  type Tick,
} from '../types';
import {
  createCurrency,
  createPivotCurrency,
  getCurrencyCodes,
  isPivotCurrency,
} from './currency';

const createCodeString = (value: CodeString): CodeString => {
  return value;
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
    const currency = createCurrency(
      createCodeString('USD'),
      createCodeString('EUR'),
      []
    );

    expect(currency.head).toEqual(['date', 'USDEUR']);
  });

  it('should align ticks in body', () => {
    const currency = createCurrency(
      'EUR' as CodeString,
      'USD' as CodeString,
      [
        createTick([2020, 1, 1], 1.0),
        createTick([2020, 1, 3], 2.0), // one day gap
      ]
    );

    expect(currency.body).toHaveLength(3); // 1 - filled 2 - 3
  });

  it('should create empty body from empty ticks', () => {
    const currency = createCurrency(
      createCodeString('EUR'),
      createCodeString('USD'),
      []
    );

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

// describe('createCrossCurrency', () => {
//   // @todo: not tested!
// });

describe('isPivotCurrency', () => {
  it('should return true for pivot currency', () => {
    const currency = createPivotCurrency();

    expect(isPivotCurrency(currency)).toBe(true);
  });

  it('should return false for non-pivot symbol', () => {
    const currency = createCurrency(
      createCodeString('EUR'),
      createCodeString('USD'),
      []
    );

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
    const currency = createCurrency(
      createCodeString('USD'),
      createCodeString('EUR'),
      []
    );

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
