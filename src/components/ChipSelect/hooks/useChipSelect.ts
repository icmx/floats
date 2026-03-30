import { useCallback, useMemo, useState, type RefObject } from 'react';
import type {
  ChipSelectOption,
  ChipSelectOptionsFilter,
} from '../ChipSelect.types';
import { defaultOptionsFilter } from '../ChipSelect.utils';

export type UseChipSelectOptions = {
  inputRef: RefObject<HTMLElement | null>;
  options: ChipSelectOption[];
  selectedOptions: ChipSelectOption[];
  optionsFilter?: ChipSelectOptionsFilter;
  onChange?: (values: string[]) => void;
};

export type UseChipSelectResult = {
  inputValue: string;
  isOpen: boolean;
  focusedIndex: number;
  filteredOptions: ChipSelectOption[];
  open: () => void;
  close: () => void;
  writeValue: (inputValue: string) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusAt: (index: number) => void;
  select: (option: ChipSelectOption) => void;
  selectFocused: () => void;
  unselect: (option: ChipSelectOption) => void;
  unselectLatest: () => void;
};

export const useChipSelect = ({
  inputRef,
  options,
  selectedOptions,
  optionsFilter = defaultOptionsFilter,
  onChange = () => {},
}: UseChipSelectOptions): UseChipSelectResult => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    return optionsFilter(inputValue, options, selectedOptions);
  }, [optionsFilter, inputValue, options, selectedOptions]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const writeValue = useCallback((nextInputValue: string) => {
    setInputValue(nextInputValue);
    setIsOpen(true);
    setFocusedIndex(-1);
  }, []);

  const focusNext = useCallback(() => {
    setIsOpen(true);
    setFocusedIndex((prev) => {
      const max = filteredOptions.length - 1;
      return prev < max ? prev + 1 : 0;
    });
  }, [filteredOptions.length]);

  const focusPrev = useCallback(() => {
    setFocusedIndex((prev) => {
      const max = filteredOptions.length - 1;

      return prev > 0 ? prev - 1 : max;
    });
  }, [filteredOptions.length]);

  const focusAt = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const select = useCallback(
    (option: ChipSelectOption) => {
      onChange(
        [...selectedOptions, option].map((nextOption) => {
          return nextOption.value;
        })
      );

      setInputValue('');
      setIsOpen(false);
      setFocusedIndex(-1);

      inputRef.current?.focus();
    },
    [selectedOptions, onChange, inputRef]
  );

  const selectFocused = useCallback(() => {
    const focusedOption = filteredOptions[focusedIndex];

    if (isOpen && focusedOption) {
      select(focusedOption);
    }
  }, [filteredOptions, focusedIndex, isOpen, select]);

  const unselect = useCallback(
    (option: ChipSelectOption) => {
      onChange(
        selectedOptions
          .filter((nextOption) => {
            return nextOption.key !== option.key;
          })
          .map((nextOption) => {
            return nextOption.value;
          })
      );
    },
    [selectedOptions, onChange]
  );

  const unselectLatest = useCallback(() => {
    const latestOption = selectedOptions[selectedOptions.length - 1];

    if (!inputValue && latestOption) {
      unselect(latestOption);
    }
  }, [selectedOptions, inputValue, unselect]);

  return {
    inputValue,
    isOpen,
    focusedIndex,
    filteredOptions,
    open,
    close,
    writeValue,
    focusNext,
    focusPrev,
    focusAt,
    select,
    selectFocused,
    unselect,
    unselectLatest,
  };
};
