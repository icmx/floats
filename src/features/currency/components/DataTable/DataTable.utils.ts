import { formatToIsoDate } from '@/lib/format';
import { formatToExploreNumber } from '../../lib/format';
import { type DateNumber, type RateNumber } from '../../types';
import { type ColDef, type DataCell } from './DataTable.types';

export const createDateColDef = (): ColDef => {
  return {
    key: 'date',
    displayType: 'date',
    label: 'Date',
  };
};

export const createRateColDef = (symbol: string): ColDef => {
  return {
    key: symbol.toLowerCase(),
    displayType: 'rate',
    label: symbol,
  };
};

export const createDateCell = (
  value: DateNumber
): DataCell<DateNumber> => {
  return {
    value,
    displayValue: formatToIsoDate(value),
  };
};

export const createRateCell = (
  value: RateNumber
): DataCell<RateNumber> => {
  return {
    value,
    displayValue: value === null ? '' : formatToExploreNumber(value),
  };
};
