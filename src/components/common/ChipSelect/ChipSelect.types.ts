import type { ReactNode } from 'react';

export type ChipSelectOption<T> = {
  id: string;
  value: T;
  pattern: string;
  children: ReactNode;
};

export type ChipSelectProps<T> = {
  options: ChipSelectOption<T>[];
  selectedOptions: ChipSelectOption<T>[];
  placeholder?: string;
  onChange?: (options: ChipSelectOption<T>[]) => void;
  optionsFilter?: (
    options: ChipSelectOption<T>[],
    inputValue: string
  ) => ChipSelectOption<T>[];
};
