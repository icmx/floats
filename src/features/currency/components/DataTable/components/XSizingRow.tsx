import { useMemo, type FunctionComponent } from 'react';
import { classNames } from '../../../../../lib/classNames';
import type { ColDef, DataRow } from '../DataTable.types';
import styles from '../DataTable.module.css';

export const XSizingRow: FunctionComponent<{
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
