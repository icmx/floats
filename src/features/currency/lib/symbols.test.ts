import { describe, expect, it } from 'vitest';
import { type SymbolString } from '../types';
import { isSymbolString, splitSymbolToCodes } from './symbols';

describe('isSymbolString', () => {
  it('should return true for valid cyrrency symbol', () => {
    expect(isSymbolString('EURUSD')).toBe(true);
    expect(isSymbolString('USDJPY')).toBe(true);
  });

  it('should return false for too long string', () => {
    expect(isSymbolString('EURUSDX')).toBe(false);
  });

  it('should return false for too short string', () => {
    expect(isSymbolString('EUR')).toBe(false);
  });

  it('should return false for lowercase valid symbol', () => {
    expect(isSymbolString('eurusd')).toBe(false);
  });

  it('should return false for 6-char string with invalid codes', () => {
    expect(isSymbolString('ABCXYZ')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isSymbolString('')).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isSymbolString(42)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isSymbolString(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isSymbolString(undefined)).toBe(false);
  });
});

describe('splitSymbolToCodes', () => {
  it('should split EURUSD into EUR and USD', () => {
    const [base, quote] = splitSymbolToCodes(
      'EURUSD' satisfies SymbolString
    );

    expect(base).toBe('EUR');
    expect(quote).toBe('USD');
  });

  it('should split USDJPY into USD and JPY', () => {
    const [base, quote] = splitSymbolToCodes(
      'USDJPY' satisfies SymbolString
    );

    expect(base).toBe('USD');
    expect(quote).toBe('JPY');
  });

  it('should split GBPCHF into GBP and CHF', () => {
    const [base, quote] = splitSymbolToCodes(
      'GBPCHF' satisfies SymbolString
    );

    expect(base).toBe('GBP');
    expect(quote).toBe('CHF');
  });
});
