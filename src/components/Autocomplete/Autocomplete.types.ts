import type { Ref } from 'react';

export type AutocompleteOption<T extends string> = {
  id: string;
  value: T;
  text: string;
};

export type AutocompleteOptionsFilter<T extends string> = (
  options: AutocompleteOption<T>[],
  inputValue: string
) => AutocompleteOption<T>[];

export type AutocompleteHandle = {
  reset: () => void;
};

export type AutocompleteProps<T extends string> = {
  options: AutocompleteOption<T>[];
  value?: AutocompleteOption<T> | null;
  placeholder?: string;
  ref?: Ref<AutocompleteHandle>;
  onTextChange?: (text: string) => void;
  onOptionChange?: (option: AutocompleteOption<T> | null) => void;
  optionsFilter?: AutocompleteOptionsFilter<T>;
};
