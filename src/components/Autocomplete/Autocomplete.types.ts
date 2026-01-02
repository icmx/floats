export type AutocompleteOption = {
  id: string;
  value: string;
  text: string;
};

export type AutocompleteOptionsFilter = (
  options: AutocompleteOption[],
  inputValue: string
) => AutocompleteOption[];

export type AutocompleteHandle = {
  reset: () => void;
};

export type AutocompleteProps = {
  options: AutocompleteOption[];
  value?: AutocompleteOption | null;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  onOptionChange?: (option: AutocompleteOption | null) => void;
  optionsFilter?: AutocompleteOptionsFilter;
};
