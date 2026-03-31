import type {
  DateNumber,
  RateNumber,
} from '../../../../types/currency';
import {
  formatToIsodate,
  formatToExploreNumber,
} from '../../../../utils';
import type { ColDef, DataCell } from './DataTable.types';

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
    displayValue: formatToIsodate(value),
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
