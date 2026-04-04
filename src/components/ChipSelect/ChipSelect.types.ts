import { type InputHTMLAttributes, type ReactNode } from 'react';

export type ChipSelectOption = {
  key: string;
  value: string;
  pattern: string;
  children: ReactNode;
};

export type ChipSelectOptionsFilter = (
  inputValue: string,
  options: ChipSelectOption[],
  selectedOptions: ChipSelectOption[]
) => ChipSelectOption[];

export type ChipSelectProps = {
  options: ChipSelectOption[];
  selectedOptions: ChipSelectOption[];
  optionsFilter?: ChipSelectOptionsFilter;
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  autoCapitalize?: InputHTMLAttributes<HTMLInputElement>['autoCapitalize'];
  placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder'];
  spellCheck?: InputHTMLAttributes<HTMLInputElement>['spellCheck'];
  onChange?: (values: string[]) => void;
};
