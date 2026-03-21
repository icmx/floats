import type {
  ChipSelectOption,
  ChipSelectOptionsFilter,
} from './ChipSelect.types';

export const defaultOptionsFilter = (<T>(
  options: ChipSelectOption<T>[],
  inputValue: string
): ChipSelectOption<T>[] => {
  const pattern = inputValue.trim().toLowerCase();

  if (!pattern) {
    return [...options];
  }

  return options.filter((option) => {
    return option.pattern.includes(pattern);
  });
}) satisfies ChipSelectOptionsFilter<unknown>;
