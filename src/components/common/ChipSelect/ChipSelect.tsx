import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
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

export const ChipSelect: FunctionComponent<ChipSelectProps> = ({
  options,
  selectedOptions,
  optionsFilter = defaultOptionsFilter,
  autoComplete,
  autoCapitalize,
  placeholder,
  spellCheck,
  onChange = () => {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    return optionsFilter(inputValue, options, selectedOptions);
  }, [optionsFilter, inputValue, options, selectedOptions]);

  const restOptionsLength = options.length - filteredOptions.length;
  const shouldShowRestOptions =
    restOptionsLength > 0 && restOptionsLength !== options.length;

  const shouldShowNoOptionsAvailable = filteredOptions.length === 0;

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport || !isOpen) {
      return;
    }

    let prev = viewport.height;

    const handleResize = () => {
      const next = viewport.height;

      if (next > prev) {
        setIsOpen(false);
      }

      prev = next;
    };

    viewport.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!container.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const list = listRef.current;

    if (!list || focusedIndex === 0) {
      return;
    }

    const focusedElement = list.children[focusedIndex] as HTMLElement;

    if (focusedElement) {
      focusedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const handleSelect = (option: ChipSelectOption): void => {
    onChange(
      [...selectedOptions, option].map((nextOption) => nextOption.value)
    );

    setInputValue('');
    setIsOpen(false);
    setFocusedIndex(-1);

    inputRef.current?.focus();
  };

  const handleRemove = (option: ChipSelectOption): void => {
    onChange(
      selectedOptions
        .filter((nextOption) => nextOption.key !== option.key)
        .map((nextOption) => nextOption.value)
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
              key={selectedOption.key}
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
          autoComplete={autoComplete}
          placeholder={placeholder}
          spellCheck={spellCheck}
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
        <div className={styles.AvailableValues}>
          {shouldShowRestOptions && (
            <div className={styles.Stub}>
              {restOptionsLength} options available
            </div>
          )}

          {shouldShowNoOptionsAvailable && (
            <div className={styles.Stub}>No options available</div>
          )}

          <ul className={styles.List} ref={listRef}>
            {filteredOptions.map((filteredOption, index) => {
              const isFocused = index === focusedIndex;

              return (
                <li
                  key={filteredOption.key}
                  className={classNames([
                    styles.Item,
                    isFocused && styles['is-focused'],
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
          </ul>
        </div>
      )}
    </div>
  );
};
