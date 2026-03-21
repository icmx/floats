import type { SymbolString } from '../../../types/currency';
import type { ChipSelectOptionsFilter } from '../../common/ChipSelect';

const WELL_KNOWN_SYMBOLS: SymbolString[] = [
  'EURUSD',
  'USDJPY',
  'GBPUSD',
  'USDCHF',
  'AUDUSD',
];

export const symbolChipsOptionsFilter: ChipSelectOptionsFilter<
  string
> = (options, inputValue) => {
  const pattern = inputValue.trim().toLowerCase();

  if (pattern.length === 0) {
    return options.filter((option) => {
      return WELL_KNOWN_SYMBOLS.includes(option.value as SymbolString);
    });
  }

  return options.filter((option) => {
    return option.pattern.startsWith(pattern);
  });
};
