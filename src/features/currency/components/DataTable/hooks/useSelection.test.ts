import { type RefObject } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  createEvent,
  fireEvent,
  renderHook,
} from '@testing-library/react';
import { type DateNumber, type RateNumber } from '../../../types';
import { type DataRow } from '../DataTable.types';
import {
  type Selection,
  isPositionInSelection,
  normalize,
  useSelection,
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

describe('useSelection hook itself', () => {
  afterEach(() => {
    document.body.replaceChildren(); // cleanup for containers
  });

  const createContainerRef = (): RefObject<HTMLElement | null> => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    return {
      current: div,
    };
  };

  const createDateNumber = (
    year: number,
    month: number,
    day: number
  ): DateNumber => {
    return Date.UTC(year, month - 1, day) as DateNumber;
  };

  const createRateNumber = (value: number | null): RateNumber => {
    return value as RateNumber;
  };

  // displayValue format here is custom (this hook must be isolated from app prefs)
  const createDataRows = (): DataRow[] => {
    return [
      [
        {
          value: createDateNumber(2020, 1, 1),
          displayValue: '2020-01-01',
        },
        { value: createRateNumber(1.1), displayValue: '1.100' },
        { value: createRateNumber(1.2), displayValue: '1.200' },
      ],
      [
        {
          value: createDateNumber(2020, 1, 2),
          displayValue: '2020-01-02',
        },
        { value: createRateNumber(3.4321), displayValue: '3.432' },
        { value: createRateNumber(null), displayValue: '' },
      ],
    ];
  };

  describe('selection behaviour', () => {
    it('should start without selection', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      expect(result.current.selection).toBeNull();

      expect(
        result.current.isSelected({ rowIndex: 0, colIndex: 0 })
      ).toBe(false);
    });

    it('should select a single cell on touch', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      act(() => {
        result.current.handleCellTouch({
          rowIndex: 0,
          colIndex: 1,
        });
      });

      expect(result.current.selection).toEqual({
        from: { rowIndex: 0, colIndex: 1 },
        to: { rowIndex: 0, colIndex: 1 },
      });

      expect(
        result.current.isSelected({ rowIndex: 0, colIndex: 1 })
      ).toBe(true);

      expect(
        result.current.isSelected({ rowIndex: 0, colIndex: 0 })
      ).toBe(false);
    });

    it('should expand selection on enter while dragging', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      act(() => {
        result.current.handleCellTouch({
          rowIndex: 0,
          colIndex: 0,
        });
      });

      act(() => {
        result.current.handleCellEnter({ rowIndex: 1, colIndex: 2 });
      });

      expect(result.current.selection).toEqual({
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 1, colIndex: 2 },
      });

      expect(
        result.current.isSelected({ rowIndex: 0, colIndex: 0 })
      ).toBe(true);

      expect(
        result.current.isSelected({ rowIndex: 1, colIndex: 1 })
      ).toBe(true);

      expect(
        result.current.isSelected({ rowIndex: 1, colIndex: 2 })
      ).toBe(true);
    });

    it('should not expand selection on enter when not dragging', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      act(() => {
        result.current.handleCellEnter({ rowIndex: 1, colIndex: 2 });
      });

      expect(result.current.selection).toBeNull();
    });

    // @todo: (maybe) Direct mouse event must be avoided due to hook isolation reasons
    it('should stop expanding after release', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      act(() => {
        result.current.handleCellTouch({
          rowIndex: 0,
          colIndex: 0,
        });
      });

      act(() => {
        fireEvent.mouseUp(document); // avoid this direct mouse event
      });

      act(() => {
        result.current.handleCellEnter({ rowIndex: 1, colIndex: 2 });
      });

      // selection should remain the single cell from touch
      expect(result.current.selection).toEqual({
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 0, colIndex: 0 },
      });
    });

    // @todo: (maybe) Direct mouse event must be avoided due to hook isolation reasons
    it('should clear selection on event outside the container', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      act(() => {
        result.current.handleCellTouch({
          rowIndex: 0,
          colIndex: 1,
        });
      });

      expect(result.current.selection).not.toBeNull();

      act(() => {
        // avoid this direct mouse event -v

        const outsideDivElement = document.createElement('div');

        document.body.appendChild(outsideDivElement);

        fireEvent.mouseDown(outsideDivElement);
      });

      expect(result.current.selection).toBeNull();
    });
  });

  // @todo: (maybe) Use user-event (npm install --save-dev @testing-library/user-event)
  // It allows to write more declarative and clear cases here and not to mock clipboard in this way
  describe('copying behaviour', () => {
    it('should copy selected data to clipboard ', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      // select from (0, 0) to (1, 2)
      act(() => {
        result.current.handleCellTouch({
          rowIndex: 0,
          colIndex: 0,
        });
      });

      act(() => {
        result.current.handleCellEnter({
          rowIndex: 1,
          colIndex: 2,
        });
      });

      let copiedText = '';

      const copyEvent = createEvent.copy(document, {
        clipboardData: {
          setData: (_: string, data: string) => {
            copiedText = data;
          },
        },
      });

      act(() => {
        fireEvent(document, copyEvent);
      });

      const expectedText = [
        '2020-01-01\t1.1\t1.2',
        '2020-01-02\t3.4321\t',
      ].join('\n');

      expect(copiedText).toBe(expectedText);
    });

    it('should not interfere with copy when nothing is selected', () => {
      const containerRef = createContainerRef();
      const rows = createDataRows();

      const { result } = renderHook(() =>
        useSelection({ containerRef, rows })
      );

      expect(result.current.selection).toBeNull();

      const copyEvent = createEvent.copy(document);

      copyEvent.preventDefault = vi.fn();

      act(() => {
        fireEvent(document, copyEvent);
      });

      expect(copyEvent.preventDefault).toHaveBeenCalled();
    });
  });
});
