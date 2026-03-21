import type { InputHTMLAttributes, ReactNode } from 'react';

export type ChipSelectOption<T> = {
  id: string;
  value: T;
  pattern: string;
  children: ReactNode;
};

export type ChipSelectOptionsFilter<T> = (
  options: ChipSelectOption<T>[],
  inputValue: string
) => ChipSelectOption<T>[];

export type ChipSelectProps<T> = {
  options: ChipSelectOption<T>[];
  selectedOptions: ChipSelectOption<T>[];
  optionsFilter?: ChipSelectOptionsFilter<T>;
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  autoCapitalize?: InputHTMLAttributes<HTMLInputElement>['autoCapitalize'];
  placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder'];
  spellCheck?: InputHTMLAttributes<HTMLInputElement>['spellCheck'];
  onChange?: (options: ChipSelectOption<T>[]) => void;
};
