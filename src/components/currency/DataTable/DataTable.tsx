import type { RateNumber } from '../../../types/currency';
import type {
  ColDef,
  DataRow,
  DataTableProps,
} from './DataTable.types';
import styles from './DataTable.module.css';

export const DataTable = <TRow extends DataRow = DataRow>({
  colDefs,
  rows,
}: DataTableProps<TRow>) => {
  return (
    <>
      <div className={styles.DataTableContainer}>
        <table>
          <thead>
            <tr>
              {colDefs.map((colDef) => {
                return (
                  <th
                    key={colDef.key}
                    className={styles[colDef.className]}
                  >
                    {colDef.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowKey = row[0].toString();

              return (
                <tr key={rowKey}>
                  {row.map((value, index) => {
                    const colDef = colDefs[index] as ColDef<RateNumber>;
                    const children = colDef.format(value);

                    return (
                      <td
                        key={colDef.key}
                        className={styles[colDef.className]}
                      >
                        {children}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
