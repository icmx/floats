import { type ChipSelectOptionsFilter } from '@/components/ChipSelect';
import { WELL_KNOWN_SYMBOLS } from '../../constants';
import { type SymbolString } from '../../types';

export const symbolChipsOptionsFilter: ChipSelectOptionsFilter = (
  inputValue,
  options,
  selectedOptions
) => {
  const pattern = inputValue.trim().toLowerCase();

  const wellKnownOptions = WELL_KNOWN_SYMBOLS.map((wellKnownSymbol) => {
    return options.find((option) => option.value === wellKnownSymbol);
  }).filter((option) => {
    return !!option;
  });

  const restOptions = options.filter((option) => {
    return !WELL_KNOWN_SYMBOLS.includes(option.value as SymbolString);
  });

  return [...wellKnownOptions, ...restOptions]
    .filter((option) => {
      return option.pattern.startsWith(pattern);
    })
    .filter((option) => {
      return selectedOptions.every(
        (selectedOption) => selectedOption.value !== option.value
      );
    })
    .slice(0, 5);
};
