import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
} from 'react';
import type { DataRow, DataTableProps } from './DataTable.types';
import styles from './DataTable.module.css';

const OVERSCAN = 5;
const DEFAULT_ROW_HEIGHT = 32;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const [rowHeight, setRowHeight] = useState(DEFAULT_ROW_HEIGHT);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (!rowRef.current) {
      return;
    }

    const height = rowRef.current.getBoundingClientRect().height || 0;

    if (height > 0) {
      setRowHeight(height);
    }
  }, [colDefs, rows]);

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

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    setScrollTop(container.scrollTop);
  }, []);

  const colCount = colDefs.length;
  const rowCount = rows.length;

  const visualCount =
    Math.ceil(viewportHeight / rowHeight) + 2 * OVERSCAN;

  const startIndexFrom = 0;
  const startindexTo = Math.floor(scrollTop / rowHeight) - OVERSCAN;
  const startIndex = Math.max(startIndexFrom, startindexTo);

  const endIndexFrom = startIndex + visualCount;
  const endIndexTo = rowCount;
  const endIndex = Math.min(endIndexFrom, endIndexTo);

  const topSpace = startIndex * rowHeight;
  const bottomSpace = Math.max(0, (rowCount - endIndex) * rowHeight);

  const visibleRows = rows.slice(startIndex, endIndex);

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
            <SpacingRow colSpan={colCount} height={topSpace} />
          )}

          {visibleRows.map((row, i) => (
            <tr
              key={row[0].toString()}
              ref={startIndex + i === 0 ? rowRef : undefined}
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
          ))}

          {bottomSpace > 0 && (
            <SpacingRow colSpan={colCount} height={bottomSpace} />
          )}
        </tbody>
      </table>
    </div>
  );
};
