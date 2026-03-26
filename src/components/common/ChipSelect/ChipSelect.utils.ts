import type {
  ChipSelectOption,
  ChipSelectOptionsFilter,
} from './ChipSelect.types';

export const defaultOptionsFilter: ChipSelectOptionsFilter = (
  inputValue,
  options,
  selectedOptions
): ChipSelectOption[] => {
  const pattern = inputValue.trim().toLowerCase();

  return options
    .filter((option) => {
      return option.pattern.startsWith(pattern);
    })
    .filter((option) => {
      return selectedOptions.every(
        (selectedOption) => selectedOption.key !== option.key
      );
    });
};
