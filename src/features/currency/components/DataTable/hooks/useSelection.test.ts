import { describe, expect, it } from 'vitest';
import {
  type Selection,
  isPositionInSelection,
  normalize,
} from './useSelection';

describe('utility functions', () => {
  describe('normalize', () => {
    it('should return same selection when from is top-left and to is bottom-right', () => {
      const selection: Selection = {
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 2, colIndex: 3 },
      };

      expect(normalize(selection)).toEqual(selection);
    });

    it('should swap from/to so from is always the top-left corner', () => {
      const selection: Selection = {
        from: { rowIndex: 3, colIndex: 4 },
        to: { rowIndex: 1, colIndex: 2 },
      };

      expect(normalize(selection)).toEqual({
        from: { rowIndex: 1, colIndex: 2 },
        to: { rowIndex: 3, colIndex: 4 },
      });
    });

    it('should handle mixed directions (from.row < to.row but from.col > to.col)', () => {
      const selection: Selection = {
        from: { rowIndex: 1, colIndex: 5 },
        to: { rowIndex: 4, colIndex: 2 },
      };

      expect(normalize(selection)).toEqual({
        from: { rowIndex: 1, colIndex: 2 },
        to: { rowIndex: 4, colIndex: 5 },
      });
    });

    it('should handle single-cell selection', () => {
      const selection: Selection = {
        from: { rowIndex: 2, colIndex: 3 },
        to: { rowIndex: 2, colIndex: 3 },
      };

      expect(normalize(selection)).toEqual(selection);
    });
  });

  describe('isPositionInSelection', () => {
    const selection: Selection = {
      from: { rowIndex: 1, colIndex: 1 },
      to: { rowIndex: 3, colIndex: 3 },
    };

    it('should return false when selection is null', () => {
      expect(
        isPositionInSelection({ rowIndex: 0, colIndex: 0 }, null)
      ).toBe(false);
    });

    it('should return true for a position inside the selection', () => {
      expect(
        isPositionInSelection({ rowIndex: 2, colIndex: 2 }, selection)
      ).toBe(true);
    });

    it('should return true for a position on the from boundary', () => {
      expect(
        isPositionInSelection({ rowIndex: 1, colIndex: 1 }, selection)
      ).toBe(true);
    });

    it('returns true for a position on the to boundary', () => {
      expect(
        isPositionInSelection({ rowIndex: 3, colIndex: 3 }, selection)
      ).toBe(true);
    });

    it('returns false when rowIndex is out of range', () => {
      expect(
        isPositionInSelection({ rowIndex: 0, colIndex: 2 }, selection)
      ).toBe(false);

      expect(
        isPositionInSelection({ rowIndex: 4, colIndex: 2 }, selection)
      ).toBe(false);
    });

    it('returns false when colIndex is out of range', () => {
      expect(
        isPositionInSelection({ rowIndex: 2, colIndex: 0 }, selection)
      ).toBe(false);

      expect(
        isPositionInSelection({ rowIndex: 2, colIndex: 4 }, selection)
      ).toBe(false);
    });
  });
});
