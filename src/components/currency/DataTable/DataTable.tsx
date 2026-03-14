import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
  type RefObject,
} from 'react';
import type { DataRow, DataTableProps } from './DataTable.types';
import styles from './DataTable.module.css';

const INITIAL_ROW_HEIGHT = 32;
const OVERSCAN = 16;

type UseVirtualRowScrollOptions = {
  rowsCount: number;
};

type UseVirtualRowScrollResult = {
  containerRef: RefObject<HTMLDivElement | null>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  handleScroll: () => void;
  indexes: number[];
  topSpace: number;
  bottomSpace: number;
};

const useVirtualRowScroll = (
  options: UseVirtualRowScrollOptions
): UseVirtualRowScrollResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const [rowHeight, setRowHeight] = useState(INITIAL_ROW_HEIGHT);
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
  }, []);

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
  }, [options.rowsCount]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }
    setScrollTop(container.scrollTop);
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
    containerRef,
    rowRef,
    handleScroll,
    indexes,
    topSpace,
    bottomSpace,
  };
};

const SpacingRow: FunctionComponent<{
  colSpan: number;
  height: number;
}> = ({ colSpan, height }) => {
  return (
    <tr style={{ height }}>
      <td colSpan={colSpan} style={{ padding: 0, border: 'none' }}></td>
    </tr>
  );
};

export const DataTable = <TRow extends DataRow = DataRow>({
  colDefs,
  rows,
}: DataTableProps<TRow>) => {
  const colSpan = colDefs.length;
  const rowsCount = rows.length;

  const {
    containerRef,
    handleScroll,
    topSpace,
    indexes,
    rowRef,
    bottomSpace,
  } = useVirtualRowScroll({
    rowsCount,
  });

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
                className={styles[`is-${colDef.type}`]}
              >
                {colDef.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topSpace > 0 && (
            <SpacingRow colSpan={colSpan} height={topSpace} />
          )}

          {indexes.map((index) => {
            const row = rows[index];

            return (
              <tr
                key={row[0].toString()}
                ref={index === 0 ? rowRef : undefined}
              >
                {row.map((value, index) => {
                  const colDef = colDefs[index];

                  return (
                    <td
                      key={colDef.key}
                      className={styles[`is-${colDef.type}`]}
                    >
                      {colDef.format(value as number)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {bottomSpace > 0 && (
            <SpacingRow colSpan={colSpan} height={bottomSpace} />
          )}
        </tbody>
      </table>
    </div>
  );
};
