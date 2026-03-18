import type { DateNumber, RateNumber } from '../../../types/currency';

export type ColDisplayType = 'date' | 'rate';

export type DataCell<TValue> = {
  value: TValue;
  displayValue: string;
};

export type DataRow = [DataCell<DateNumber>, ...DataCell<RateNumber>[]];

export type ColDef = {
  key: string;
  displayType: ColDisplayType;
  label: string;
};

export type DataTableProps = {
  colDefs: ColDef[];
  rows: DataRow[];
};
