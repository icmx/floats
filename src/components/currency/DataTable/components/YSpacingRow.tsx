import type { FunctionComponent } from 'react';
import styles from '../DataTable.module.css';

export const YSpacingRow: FunctionComponent<{
  colSpan: number;
  height: number;
}> = ({ colSpan, height }) => {
  return (
    <tr style={{ height }}>
      <td colSpan={colSpan} className={styles.YSpacingCol}></td>
    </tr>
  );
};
