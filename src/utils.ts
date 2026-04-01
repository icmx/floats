import {
  EXPLORE_FRACTION_DIGITS,
  CONVERT_FRACTION_DIGITS,
} from './features/currency/constants';

// @todo: This file must be split into separate shared libs

const exploreFormatter = new Intl.NumberFormat(
  navigator?.languages || ['en'],
  {
    maximumFractionDigits: EXPLORE_FRACTION_DIGITS,
    minimumFractionDigits: EXPLORE_FRACTION_DIGITS,
    roundingMode: 'halfEven',
  }
);

const convertFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: CONVERT_FRACTION_DIGITS,
  minimumFractionDigits: CONVERT_FRACTION_DIGITS,
  roundingMode: 'halfEven',
  useGrouping: false,
});

export const formatToIsodate = (dateInit: string | number): string => {
  return new Date(dateInit).toISOString().slice(0, 10);
};

export const formatToIsodatetime = (
  dateInit: string | number
): string => {
  return new Date(dateInit).toJSON().slice(0, 16).replace('T', ' ');
};

export const formatToExploreNumber = (numberInit: number): string => {
  return exploreFormatter.format(numberInit);
};

export const formatToConvertNumber = (numberInit: number): string => {
  const parts = convertFormatter.formatToParts(numberInit);

  return parts.reduce((result, { type, value }) => {
    if (type === 'integer') {
      return `${result}${value}`;
    }

    if (type === 'decimal') {
      return `${result}.`;
    }

    if (type === 'fraction') {
      return `${result}${value}`;
    }

    return result;
  }, '');
};
