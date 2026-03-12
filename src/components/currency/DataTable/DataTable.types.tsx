import type { DateNumber, RateNumber } from '../../../types/currency';

export type ColType = 'date' | 'rate';

export type DataRow = [DateNumber, ...RateNumber[]];

export type ColDef<TValue> = {
  key: string;
  type: ColType;
  title: string;
  format: (value: TValue) => string;
};

export type DataTableProps<TRow extends DataRow = DataRow> = {
  colDefs: [ColDef<DateNumber>, ...ColDef<RateNumber>[]];
  rows: TRow[];
};
