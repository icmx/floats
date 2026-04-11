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

/**
 * Formats a JS Date init string or number value into ISO 8601 string representing a specific date (`YYYY-MM-DD`, e.g. 2011-05-18)
 */
export const formatToIsoDate = (dateInit: string | number): string => {
  return new Date(dateInit).toISOString().slice(0, 10);
};

/**
 * Formats a JS Date init string or number value into ISO 8601 string representing a specific date and time, without separating letter `T` (`YYYY-MM-DD HH:MM`, e.g. 2011-05-18 12:45)
 */
export const formatToIsoDateTime = (
  dateInit: string | number
): string => {
  return new Date(dateInit)
    .toISOString()
    .slice(0, 16)
    .replace('T', ' ');
};

/**
 * Formats a numeric value into a currency number with fixed 6 fraction digits, like an exchange currency rate value.
 *
 * Uses bankers rounding internally (`halfEven` mode).
 *
 * Locale's style for delimiters and number groups may apply.
 */
export const formatToExchangeCurrencyNumber = (
  numberInit: number
): string => {
  return exchangeCurrencyNumberFormatter.format(numberInit);
};

/**
 * Formats a numeric value into a currency number with fixed 2 fraction digits, like a real money value.
 *
 * Uses bankers rounding internally (`halfEven` mode).
 *
 * Returns strictly in `0.00` format, i.e. uses only digits and period for decimal separator.
 *
 * @deprecated This actually a wrong use. This was made for Converter to format input to 0.00 form. While it works, this should be implemented as a function that returns a number (similar to toFixed)
 * @todo Avoid this function
 */
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
