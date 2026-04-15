import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from 'react';

export const VIRTUAL_ROW_SCROLL_OVERSCAN_ROWS = 16;
export const VIRTUAL_ROW_SCROLL_INITIAL_ROW_HEIGHT = 32;

export type UseVirtualRowScrollOptions = {
  containerRef: RefObject<HTMLElement | null>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  rowsCount: number;
};

export type UseVirtualRowScrollResult = {
  handleScroll: () => void;
  indexes: number[];
  topSpace: number;
  bottomSpace: number;
};

export const useVirtualRowScroll = ({
  containerRef,
  rowRef,
  rowsCount,
}: UseVirtualRowScrollOptions): UseVirtualRowScrollResult => {
  const overscan = VIRTUAL_ROW_SCROLL_OVERSCAN_ROWS;

  const [rowHeight, setRowHeight] = useState(
    VIRTUAL_ROW_SCROLL_INITIAL_ROW_HEIGHT
  );

  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    setViewportHeight(container.clientHeight);

    const observer = new ResizeObserver(() => {
      setViewportHeight(container.clientHeight);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  useEffect(() => {
    const row = rowRef.current;

    if (!row) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const height = row.getBoundingClientRect().height || 0;

      if (height > 0) {
        setRowHeight(height);
      }
    });

    observer.observe(row);

    return () => {
      observer.disconnect();
    };
  }, [rowRef]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    setScrollTop(container.scrollTop);
  }, [containerRef]);

  const visualCount =
    Math.ceil(viewportHeight / rowHeight) + 2 * overscan;

  const startIndexFrom = 0;
  const startIndexTo = Math.floor(scrollTop / rowHeight) - overscan;
  const startIndex = Math.max(startIndexFrom, startIndexTo);

  const endIndexFrom = startIndex + visualCount;
  const endIndexTo = rowsCount;
  const endIndex = Math.min(endIndexFrom, endIndexTo);

  const topSpace = startIndex * rowHeight;
  const bottomSpace = Math.max(0, (rowsCount - endIndex) * rowHeight);

  const indexes: number[] = [];

  for (let i = startIndex; i < endIndex; i++) {
    indexes.push(i);
  }

  return {
    handleScroll,
    indexes,
    topSpace,
    bottomSpace,
  };
};
