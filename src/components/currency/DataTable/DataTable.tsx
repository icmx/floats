import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type FunctionComponent,
  type RefObject,
  type MouseEvent as SyntheticMouseEvent,
  type DependencyList,
} from 'react';
import { classNames } from '../../../utils/common';
import type {
  ColDef,
  DataRow,
  DataTableProps,
} from './DataTable.types';
import styles from './DataTable.module.css';

const INITIAL_ROW_HEIGHT = 32;
const OVERSCAN = 16;

type UseScrollToBottomOptions = {
  containerRef: RefObject<HTMLElement | null>;
};

const useScrollToBottom = (
  { containerRef }: UseScrollToBottomOptions,
  deps: DependencyList
) => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
    });
  }, deps);
};

type Position = { rowIndex: number; colIndex: number };

type Selection = {
  from: Position;
  to: Position;
};

const normalize = (selection: Selection): Selection => {
  return {
    from: {
      rowIndex: Math.min(
        selection.from.rowIndex,
        selection.to.rowIndex
      ),
      colIndex: Math.min(
        selection.from.colIndex,
        selection.to.colIndex
      ),
    },
    to: {
      rowIndex: Math.max(
        selection.from.rowIndex,
        selection.to.rowIndex
      ),
      colIndex: Math.max(
        selection.from.colIndex,
        selection.to.colIndex
      ),
    },
  };
};

const isPositionInSelection = (
  position: Position,
  selection: Selection | null
): boolean => {
  if (!selection) {
    return false;
  }

  return (
    position.rowIndex >= selection.from.rowIndex &&
    position.rowIndex <= selection.to.rowIndex &&
    position.colIndex >= selection.from.colIndex &&
    position.colIndex <= selection.to.colIndex
  );
};

type UseSelectionOptions = {
  containerRef: RefObject<HTMLElement | null>;
  colDefs: ColDef[];
  rows: DataRow[];
};

type UseSelectionResult = {
  selection: Selection | null;
  isSelected: (position: Position) => boolean;
  handleCellMouseDown: (
    event: SyntheticMouseEvent,
    position: Position
  ) => void;
  handleCellMouseEnter: (position: Position) => void;
};

const useSelection = ({
  containerRef,
  colDefs,
  rows,
}: UseSelectionOptions): UseSelectionResult => {
  const anchorRef = useRef<Position | null>(null);

  const [selection, setNormalizedSelection] =
    useState<Selection | null>(null);

  const handleCellMouseDown = useCallback(
    (event: SyntheticMouseEvent, position: Position) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();

      anchorRef.current = position;

      setNormalizedSelection({ from: position, to: position });
    },
    []
  );

  const handleCellMouseEnter = useCallback((position: Position) => {
    if (!anchorRef.current) {
      return;
    }

    setNormalizedSelection(
      normalize({ from: anchorRef.current, to: position })
    );
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      anchorRef.current = null;
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (!container.contains(event.target as Node)) {
        setNormalizedSelection(null);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [containerRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selection) {
        return;
      }

      event.preventDefault();

      const hasModifiers = event.ctrlKey || event.metaKey;
      const hasCKey = event.key === 'c';
      const shouldCopy = hasModifiers && hasCKey;

      if (!shouldCopy) {
        return;
      }

      const lines: string[][] = [];

      for (
        let ri = selection.from.rowIndex;
        ri <= selection.to.rowIndex;
        ri++
      ) {
        const row = rows[ri];

        const line: string[] = [];

        for (
          let ci = selection.from.colIndex;
          ci <= selection.to.colIndex;
          ci++
        ) {
          const cell = row[ci];

          line.push(cell.displayValue);
        }

        lines.push(line);
      }

      const text: string = lines
        .map((line) => line.join('\t'))
        .join('\n');

      navigator.clipboard.writeText(text);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selection, rows, colDefs]);

  const isSelected = useCallback(
    (position: Position) => {
      return isPositionInSelection(position, selection);
    },
    [selection]
  );

  return {
    selection,
    isSelected,
    handleCellMouseDown,
    handleCellMouseEnter,
  };
};

type UseVirtualRowScrollOptions = {
  containerRef: RefObject<HTMLDivElement | null>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  rowsCount: number;
};

type UseVirtualRowScrollResult = {
  handleScroll: () => void;
  indexes: number[];
  topSpace: number;
  bottomSpace: number;
};

const useVirtualRowScroll = (
  options: UseVirtualRowScrollOptions
): UseVirtualRowScrollResult => {
  const [rowHeight, setRowHeight] = useState(INITIAL_ROW_HEIGHT);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const container = options.containerRef.current;

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
  }, []);

  useEffect(() => {
    const row = options.rowRef.current;

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
  }, []);

  const handleScroll = useCallback(() => {
    const container = options.containerRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      setScrollTop(container.scrollTop);
    });
  }, []);

  const visualCount =
    Math.ceil(viewportHeight / rowHeight) + 2 * OVERSCAN;

  const startIndexFrom = 0;
  const startIndexTo = Math.floor(scrollTop / rowHeight) - OVERSCAN;
  const startIndex = Math.max(startIndexFrom, startIndexTo);

  const endIndexFrom = startIndex + visualCount;
  const endIndexTo = options.rowsCount;
  const endIndex = Math.min(endIndexFrom, endIndexTo);

  const topSpace = startIndex * rowHeight;
  const bottomSpace = Math.max(
    0,
    (options.rowsCount - endIndex) * rowHeight
  );

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

const XSizingRow: FunctionComponent<{
  colDefs: ColDef[];
  rows: DataRow[];
}> = ({ colDefs, rows }) => {
  const cols: string[] = useMemo(() => {
    return colDefs.map((_, index) => {
      // date (first value) is always in yyyy-mm-dd
      if (index === 0) {
        return '0000-00-00';
      }

      // any other value is a rate
      let maxValue = 0;
      let maxDisplayValue = '';

      rows.forEach((row) => {
        const cell = row[index];

        if (cell.value !== null && cell.value > maxValue) {
          maxValue = cell.value;
          maxDisplayValue = cell.displayValue;
        }
      });

      return maxDisplayValue;
    });
  }, [colDefs, rows]);

  return (
    <tr className={styles.XSizingRow}>
      {cols.map((col, index) => {
        const colDef = colDefs[index];

        return (
          <td
            key={`sizing-${colDef.key}`}
            className={classNames([
              styles[`is-${colDef.displayType}`],
              styles.XSizingCol,
            ])}
          >
            {col}
          </td>
        );
      })}
    </tr>
  );
};

const YSpacingRow: FunctionComponent<{
  colSpan: number;
  height: number;
}> = ({ colSpan, height }) => {
  return (
    <tr style={{ height }}>
      <td colSpan={colSpan} className={styles.YSpacingCol}></td>
    </tr>
  );
};

export const DataTable: FunctionComponent<DataTableProps> = ({
  colDefs,
  rows,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const colSpan = colDefs.length;
  const rowsCount = rows.length;

  const { handleScroll, topSpace, indexes, bottomSpace } =
    useVirtualRowScroll({
      containerRef,
      rowRef,
      rowsCount,
    });

  const { isSelected, handleCellMouseDown, handleCellMouseEnter } =
    useSelection({
      containerRef,
      colDefs,
      rows,
    });

  useScrollToBottom({ containerRef }, [rows]);

  return (
    <div
      className={styles.DataTableContainer}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <table>
        <thead>
          <tr>
            {colDefs.map((colDef) => (
              <th
                key={colDef.key}
                className={styles[`is-${colDef.displayType}`]}
              >
                {colDef.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <XSizingRow colDefs={colDefs} rows={rows} />

          {topSpace > 0 && (
            <YSpacingRow colSpan={colSpan} height={topSpace} />
          )}

          {indexes.map((rowIndex) => {
            const row = rows[rowIndex];

            return (
              <tr
                key={row[0].value.toString()}
                ref={rowIndex === 0 ? rowRef : undefined}
              >
                {row.map((cell, colIndex) => {
                  const colDef = colDefs[colIndex];
                  const selected = isSelected({
                    rowIndex,
                    colIndex,
                  });

                  return (
                    <td
                      key={`cell-${colDef.key}`}
                      className={classNames({
                        [styles[`is-${colDef.displayType}`]]: true,
                        [styles['is-selected']]: selected,
                      })}
                      onMouseDown={(event) =>
                        handleCellMouseDown(event, {
                          rowIndex,
                          colIndex,
                        })
                      }
                      onMouseEnter={() =>
                        handleCellMouseEnter({ rowIndex, colIndex })
                      }
                    >
                      {cell.displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {bottomSpace > 0 && (
            <YSpacingRow colSpan={colSpan} height={bottomSpace} />
          )}
        </tbody>
      </table>
    </div>
  );
};
