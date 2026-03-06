export type ColDef<TValue> = {
  title: string;
  format: (value: TValue) => string;
};

export type RowDef<TRow extends { [c: string]: unknown }> = {
  key: (row: TRow) => string;
};

export type DataTableProps<TRow extends { [c: string]: unknown }> = {
  colDefs: { [C in keyof TRow]: ColDef<TRow[C]> };
  rowDef: RowDef<TRow>;
  rows: { [C in keyof TRow]: TRow[C] }[];
};
