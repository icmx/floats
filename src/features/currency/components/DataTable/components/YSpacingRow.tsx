import type { FunctionComponent } from 'react';
import { classNames } from '@/lib/classNames';
import styles from '../DataTable.module.css';

export const YSpacingRow: FunctionComponent<{
  colSpan: number;
  height: number;
}> = ({ colSpan, height }) => {
  return (
    <tr style={{ height }}>
      <td
        colSpan={colSpan}
        className={classNames([styles.DataTableDataCell, styles.YSpacingCol])}
      ></td>
    </tr>
  );
};
