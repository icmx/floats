import type { DateNumber, RateNumber } from '../../../types/currency';
import {
  exploreFormatter,
  isodateFormatter,
} from '../../../utils/common';
import type { ColDef } from './DataTable.types';

export const createDateColDef = (): ColDef<DateNumber> => {
  return {
    key: 'date',
    type: 'date',
    title: 'Date',
    format: (value) => {
      return isodateFormatter.format(value);
    },
  };
};

export const createRateColDef = (
  symbol: string
): ColDef<RateNumber> => {
  return {
    key: symbol.toLowerCase(),
    type: 'rate',
    title: symbol,
    format: (value) => {
      if (value === null) {
        return '';
      }

      return exploreFormatter.format(value);
    },
  };
};
