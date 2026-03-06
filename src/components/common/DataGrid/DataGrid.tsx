import type { ColDef, DataGridProps } from './DataGrid.types';

export const DataGrid = <TRow extends { [c: string]: unknown }>({
  colDefs,
  rowDef,
  rows,
}: DataGridProps<TRow>) => {
  const cols = Object.entries(colDefs) satisfies [
    string,
    ColDef<unknown>
  ][];

  return (
    <>
      <table>
        <thead>
          <tr>
            {cols.map(([key, colDef]) => {
              return <th key={key}>{colDef.title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = rowDef.key(row);
            const cells = Object.entries(row) satisfies [
              keyof TRow,
              TRow[keyof TRow]
            ][];

            return (
              <tr key={rowKey}>
                {cells.map(([colKey, rowValue]) => {
                  const cell = colDefs[colKey].format(rowValue);

                  return <td key={colKey}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
