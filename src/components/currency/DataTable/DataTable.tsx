import { useRef, type FunctionComponent } from 'react';
import { classNames } from '../../../utils/common';
import { XSizingRow } from './components/XSizingRow';
import { YSpacingRow } from './components/YSpacingRow';
import { useScrollToBottom } from './hooks/useScrollToBottom';
import { useSelection } from './hooks/useSelection';
import { useVirtualRowScroll } from './hooks/useVirtualRowScroll';
import type { DataTableProps } from './DataTable.types';
import styles from './DataTable.module.css';

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
