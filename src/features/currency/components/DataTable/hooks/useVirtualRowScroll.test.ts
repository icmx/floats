import { type RefObject } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  type UseVirtualRowScrollOptions,
  useVirtualRowScroll,
  VIRTUAL_ROW_SCROLL_INITIAL_ROW_HEIGHT,
  VIRTUAL_ROW_SCROLL_OVERSCAN_ROWS,
} from './useVirtualRowScroll';

const rowHeight = VIRTUAL_ROW_SCROLL_INITIAL_ROW_HEIGHT;
const overscan = VIRTUAL_ROW_SCROLL_OVERSCAN_ROWS;

const createContainerRef = (options: {
  clientHeight: number;
  scrollTop: number;
}): RefObject<HTMLElement> => {
  const current = document.createElement('div');

  Object.defineProperties(current, {
    clientHeight: {
      configurable: true,
      get: () => {
        return options.clientHeight;
      },
    },
  });

  current.scrollTop = options.scrollTop;

  return {
    current,
  } satisfies UseVirtualRowScrollOptions['containerRef'];
};

const createRowRef = (options: {
  height: number;
}): RefObject<HTMLTableRowElement> => {
  const current = document.createElement('tr');

  current.getBoundingClientRect = vi.fn(() => {
    return {
      height: options.height,
      width: 0,
      x: 0,
      y: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: () => null,
    };
  });

  return { current } satisfies UseVirtualRowScrollOptions['rowRef'];
};

const renderVirtualScrollHook = (
  options: Partial<UseVirtualRowScrollOptions> = {}
) => {
  const containerRef =
    options.containerRef ??
    createContainerRef({ clientHeight: 500, scrollTop: 0 });

  const rowRef = options.rowRef ?? createRowRef({ height: rowHeight });

  const rowsCount = options.rowsCount ?? 1000;

  return renderHook(
    (props) => {
      return useVirtualRowScroll(props);
    },
    {
      initialProps: {
        containerRef,
        rowRef,
        rowsCount,
      } satisfies UseVirtualRowScrollOptions,
    }
  );
};

beforeAll(() => {
  // @todo: Observer must be implemented as a separate hook and thus tested separately (or use a package)
  const ResizeObserverMock = vi.fn(
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    }
  );

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  document.body.replaceChildren(); // cleanup for containers
});

describe('useVirtualRowScroll', () => {
  describe('initial state', () => {
    it('should return indexes starting from 0', () => {
      const { result } = renderVirtualScrollHook();

      expect(result.current.indexes[0]).toBe(0);
    });

    it('should return topSpace as 0', () => {
      const { result } = renderVirtualScrollHook();

      expect(result.current.topSpace).toBe(0);
    });

    it('should calculate correct visible count with overscan', () => {
      const viewportHeight = 500;

      const containerRef = createContainerRef({
        clientHeight: viewportHeight,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({
        containerRef,
      });

      const visualCount =
        Math.ceil(viewportHeight / rowHeight) + 2 * overscan;

      expect(result.current.indexes.length).toBe(visualCount);
    });

    it('should return bottomSpace according to remaining rows', () => {
      const viewportHeight = 500;
      const rowsCount = 1000;

      const containerRef = createContainerRef({
        clientHeight: viewportHeight,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({
        containerRef,
        rowsCount,
      });

      const visualCount =
        Math.ceil(viewportHeight / rowHeight) + 2 * overscan;

      const expectedBottom = (rowsCount - visualCount) * rowHeight;

      expect(result.current.bottomSpace).toBe(expectedBottom);
    });
  });

  describe('scroll handling', () => {
    it('should update indexes based on scrollTop', () => {
      const scrollTop = 2000;

      const containerRef = createContainerRef({
        clientHeight: 500,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({ containerRef });

      containerRef.current.scrollTop = scrollTop; // simulate scroll

      act(() => {
        result.current.handleScroll();
      });

      const expectedStart =
        Math.floor(scrollTop / rowHeight) - overscan;

      expect(result.current.indexes[0]).toBe(expectedStart);
      expect(result.current.topSpace).toBe(expectedStart * rowHeight);
    });

    it('should clamp startIndex to 0 when scroll is near top', () => {
      const containerRef = createContainerRef({
        clientHeight: 500,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({ containerRef });

      containerRef.current.scrollTop = 100; // simulate small scroll: overscan would push startIndex negative

      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.indexes[0]).toBe(0);
      expect(result.current.topSpace).toBe(0);
    });

    it('should clamp endIndex to rowsCount when scrolled near bottom', () => {
      const rowsCount = 50;

      const containerRef = createContainerRef({
        clientHeight: 500,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({
        containerRef,
        rowsCount,
      });

      containerRef.current.scrollTop = 1200; // simulate scroll

      act(() => {
        result.current.handleScroll();
      });

      const lastIndex =
        result.current.indexes[result.current.indexes.length - 1];

      expect(lastIndex).toBe(rowsCount - 1);
      expect(result.current.bottomSpace).toBe(0);
    });
  });

  describe('containerRef null handling', () => {
    it('should reutrn initial indexes and zero spacing', () => {
      const containerRef = {
        current: null,
      } satisfies RefObject<HTMLElement | null>;

      const { result } = renderVirtualScrollHook({ containerRef });

      expect(result.current.indexes).toHaveLength(32); // it's better to be 0, but okay
      expect(result.current.topSpace).toBe(0);
    });

    it('should do nothing while handleScroll', () => {
      const containerRef = {
        current: null,
      } satisfies RefObject<HTMLElement | null>;

      const { result } = renderVirtualScrollHook({ containerRef });

      act(() => {
        result.current.handleScroll(); // works, i.e. does nothing as intended
      });

      expect(result.current.topSpace).toBe(0);
    });
  });

  describe('rowRef null handling', () => {
    it('should return initial indexes + overscan extra', () => {
      const rowsCount = 500;

      const rowRef = {
        current: null,
      } satisfies RefObject<HTMLTableRowElement | null>;

      const { result } = renderVirtualScrollHook({ rowRef });

      // visualCount = (500 / 32) + 2 * 16 = 47.625
      const visualCount =
        Math.ceil(rowsCount / rowHeight) + 2 * overscan;

      expect(result.current.indexes).toHaveLength(visualCount);
    });
  });

  describe('edge cases', () => {
    it('should handle rowsCount = 0', () => {
      const { result } = renderVirtualScrollHook({ rowsCount: 0 });

      expect(result.current.indexes).toEqual([]);
      expect(result.current.topSpace).toBe(0);
      expect(result.current.bottomSpace).toBe(0);
    });

    it('should handle rowsCount = 1', () => {
      const { result } = renderVirtualScrollHook({ rowsCount: 1 });

      expect(result.current.indexes).toEqual([0]);
    });

    it('should handle rowsCount < visual window', () => {
      const { result } = renderVirtualScrollHook({ rowsCount: 5 });

      expect(result.current.indexes).toEqual([0, 1, 2, 3, 4]);
      expect(result.current.bottomSpace).toBe(0);
    });
  });

  describe('calculation correctness', () => {
    it('topSpace + visible rows + bottomSpace should be equal to total content height', () => {
      const rowsCount = 1000;

      const containerRef = createContainerRef({
        clientHeight: 500,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({
        containerRef,
        rowsCount,
      });

      const { topSpace, bottomSpace, indexes } = result.current;

      const visibleHeight = indexes.length * rowHeight;
      const totalHeight = rowsCount * rowHeight;

      expect(topSpace + visibleHeight + bottomSpace).toBe(totalHeight);
    });

    it('total height must be constant after any scroll', () => {
      const rowsCount = 1000;

      const containerRef = createContainerRef({
        clientHeight: 500,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({
        containerRef,
        rowsCount,
      });

      const scrollPositions = [0, 500, 2000, 15000, 30000];

      for (const scrollPosision of scrollPositions) {
        containerRef.current.scrollTop = scrollPosision;

        act(() => {
          result.current.handleScroll();
        });

        const { topSpace, bottomSpace, indexes } = result.current;

        const visibleHeight = indexes.length * rowHeight;
        const totalHeight = rowsCount * rowHeight;

        expect(topSpace + visibleHeight + bottomSpace).toBe(
          totalHeight
        );
      }
    });

    it('matches expected values for a known scroll position', () => {
      const viewportHeight = 10 * rowHeight;
      const rowsCount = 200;

      const containerRef = createContainerRef({
        clientHeight: viewportHeight,
        scrollTop: 0,
      });

      const { result } = renderVirtualScrollHook({
        containerRef,
        rowsCount,
      });

      containerRef.current.scrollTop = 1600; // row 50

      act(() => {
        result.current.handleScroll();
      });

      const { indexes, topSpace, bottomSpace } = result.current;

      // startIndex = max(0, floor(1600/32) - 16) = max(0, 50 - 16) = 34
      // visualCount = ceil(320/32) + 2*16 = 10 + 32 = 42
      // endIndex = min(34 + 42, 200) = min(76, 200) = 76

      expect(indexes[0]).toBe(34);
      expect(indexes[indexes.length - 1]).toBe(75);
      expect(indexes.length).toBe(42);
      expect(topSpace).toBe(34 * 32);
      expect(bottomSpace).toBe((200 - 76) * 32);
    });
  });
});
