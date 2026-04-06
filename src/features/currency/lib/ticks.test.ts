import { describe, expect, it } from 'vitest';
import { PARSABLE_LINE_PATTERN } from './ticks';

describe('Ticks calculations', () => {
  describe('PARSABLE_LINE_PATTERN', () => {
    describe('invalid lines', () => {
      it.each([
        // empty
        ['empty string', ''],
        ['whitespace only', '    '],

        // invalid dates
        ['short year', '26-10-15,1.5'],
        ['missing date segment', '2026-10,1.5'],
        ['extra date segment', '2026-10-15-15,1.5'],
        ['date with time', '2026-10-15T12:45,1.5'],
        ['date with slashes', '2026/10/15,1.5'],
        ['no date', ',1.5'],

        // invalid rates
        ['no rate', '2026-10-15,'],
        ['rate with letters', '2026-10-15,abc'],
        ['rate with trailing dot', '2026-10-15,1.'],
        ['rate with leading dot', '2026-10-15,.5'],
        ['rate with two dots', '2026-10-15,1.2.3'],
        ['negative rate', '2026-10-15,-1.5'],
        ['rate with spaces', '2026-10-15, 1.5'],
        [
          'rate integer part too long (17 digits)',
          '2026-10-15,12345678901234567',
        ],
        [
          'rate decimal part too long (17 digits)',
          '2026-10-15,1.12345678901234567',
        ],

        // wrong separators
        ['semicolon delimiter', '2026-10-15;1.5'],
        ['tab delimiter', '2026-10-15\t1.5'],
        ['multiple commas', '2026-10-15,1,5'],

        // extra content
        ['leading space', ' 2026-10-15,1.5'],
        ['trailing space', '2026-10-15,1.5 '],
        ['trailing newline', '2026-10-15,1.5\n'],
        ['header line', 'date,rate'],

        // quoted values
        ['date quoted', '"2026-10-15",1.5'],
        ['rate quoted', '2026-10-15,"1.5"'],
        ['date and rate quoted', '"2026-10-15","1.5"'],
        ['date and rate quoted with space', '"2026-10-15", "1.5"'],
      ])('should not match: %s: %s', (_, line) => {
        expect(PARSABLE_LINE_PATTERN.test(line)).toBe(false);
      });
    });

    describe('valid lines', () => {
      it.each([
        '2026-10-15,1',
        '2026-10-15,1.5',
        '2024-12-31,1234567890123456',
        '2024-12-31,1234567890123456.1234567890123456',
        '2000-01-01,0.1',
        '9999-99-99,1.1',
      ])('should match: %s', (line) => {
        expect(PARSABLE_LINE_PATTERN.test(line)).toBe(true);
      });
    });
  });
});
