import { CURRENCIES } from './currencies';

export const PAIRS = CURRENCIES.map((base) => {
  return CURRENCIES.filter((currency) => {
    return currency !== base;
  }).map((quote) => {
    return `${base}${quote}`;
  });
}).flat();
