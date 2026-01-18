import type { ChipSelectOption } from './ChipSelect.types';

export const defaultOptionsFilter = <T extends string = string>(
  options: ChipSelectOption<T>[],
  inputValue: string
): ChipSelectOption<T>[] => {
  const OPTIONS_HARD_LIMIT = 150;
  const pattern = inputValue.toLowerCase();

  if (!pattern) {
    return options.slice(0, OPTIONS_HARD_LIMIT);
  }

  return options.filter((option) => {
    return option.pattern.includes(pattern);
  });
};
