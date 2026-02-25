import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { classNames } from '../../../utils/common';
import { Chip } from '../Chip';
import type {
  ChipSelectOption,
  ChipSelectProps,
} from './ChipSelect.types';
import { defaultOptionsFilter } from './ChipSelect.utils';
import styles from './ChipSelect.module.css';

export const ChipSelect = <T,>({
  options,
  selectedOptions,
  autoCapitalize,
  placeholder,
  onChange = () => {},
  optionsFilter = defaultOptionsFilter,
}: ChipSelectProps<T>) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = useMemo<ChipSelectOption<T>[]>(() => {
    return optionsFilter(options, inputValue).filter(
      (filteredOption) => {
        return selectedOptions.every(
          (selectedOption) => selectedOption.id !== filteredOption.id
        );
      }
    );
  }, [options, optionsFilter, inputValue, selectedOptions]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[
        focusedIndex
      ] as HTMLElement;

      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleSelect = (option: ChipSelectOption<T>): void => {
    onChange([...selectedOptions, option]);

    setInputValue('');
    setIsOpen(false);
    setFocusedIndex(-1);

    inputRef.current?.focus();
  };

  const handleRemove = (option: ChipSelectOption<T>): void => {
    onChange(
      selectedOptions.filter(
        (selectedOption) => selectedOption.id !== option.id
      )
    );
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      setIsOpen(true);
      setFocusedIndex((prev) => {
        return prev < filteredOptions.length - 1 ? prev + 1 : prev;
      });

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      setFocusedIndex((prev) => {
        return prev > 0 ? prev - 1 : 0;
      });

      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (isOpen === true && filteredOptions[focusedIndex]) {
        handleSelect(filteredOptions[focusedIndex]);
      }

      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);

      return;
    }

    if (
      event.key === 'Backspace' &&
      !inputValue &&
      selectedOptions.length > 0
    ) {
      handleRemove(selectedOptions[selectedOptions.length - 1]);

      return;
    }
  };

  return (
    <div className={styles.ChipSelect} ref={containerRef}>
      <div
        className={styles.SelectedValues}
        onClick={() => {
          inputRef?.current?.focus();
        }}
      >
        {selectedOptions.map((selectedOption) => {
          return (
            <Chip
              key={selectedOption.id}
              onRemove={() => {
                handleRemove(selectedOption);
              }}
            >
              {selectedOption.children}
            </Chip>
          );
        })}
        <input
          className={styles.Input}
          ref={inputRef}
          type="text"
          value={inputValue}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          onChange={(event) => {
            setInputValue(event.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isOpen && (
        <ul className={styles.AvailableValues} ref={listRef}>
          {filteredOptions.map((filteredOption, index) => {
            const isFocused = index === focusedIndex;

            return (
              <li
                key={filteredOption.id}
                className={classNames([
                  styles.Option,
                  isFocused && styles.isFocused,
                ])}
                onClick={() => {
                  handleSelect(filteredOption);
                }}
                onMouseEnter={() => {
                  setFocusedIndex(index);
                }}
              >
                {filteredOption.children}
              </li>
            );
          })}
          {filteredOptions.length === 0 && (
            <li className={styles.Option}>No options available.</li>
          )}
        </ul>
      )}
    </div>
  );
};
