export const EXCHANGE_CURRENCY_NUMBER_FRACTION_DIGITS = 6;

export const REAL_CURRENCY_NUMBER_FRACTION_DIGITS = 2;

const exchangeCurrencyNumberFormatter = new Intl.NumberFormat(
  navigator?.languages || ['en'],
  {
    maximumFractionDigits: EXCHANGE_CURRENCY_NUMBER_FRACTION_DIGITS,
    minimumFractionDigits: EXCHANGE_CURRENCY_NUMBER_FRACTION_DIGITS,
    roundingMode: 'halfEven',
  }
);

const realCurrencyNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: REAL_CURRENCY_NUMBER_FRACTION_DIGITS,
  minimumFractionDigits: REAL_CURRENCY_NUMBER_FRACTION_DIGITS,
  roundingMode: 'halfEven',
  useGrouping: false,
});

export const formatToIsoDate = (dateInit: string | number): string => {
  return new Date(dateInit).toISOString().slice(0, 10);
};

export const formatToIsoDateTime = (
  dateInit: string | number
): string => {
  return new Date(dateInit).toJSON().slice(0, 16).replace('T', ' ');
};

export const formatToExchangeCurrencyNumber = (
  numberInit: number
): string => {
  return exchangeCurrencyNumberFormatter.format(numberInit);
};

export const formatToRealCurrencyNumber = (
  numberInit: number
): string => {
  const parts = realCurrencyNumberFormatter.formatToParts(numberInit);

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
