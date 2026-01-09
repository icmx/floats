import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type ReactElement,
} from 'react';
import { classNames } from '../../../utils/common';
import type {
  AutocompleteOption,
  AutocompleteProps,
} from './Autocomplete.types';
import styles from './Autocomplete.module.css';

export const Autocomplete = <T extends string>({
  options,
  value = null,
  placeholder,
  ref,
  onTextChange,
  onOptionChange,
  optionsFilter = (options, inputValue) => {
    const OPTIONS_HARD_LIMIT = 150;
    const pattern = inputValue.toLowerCase();

    if (!pattern) {
      return options.slice(0, OPTIONS_HARD_LIMIT);
    }

    return options.filter((option) => {
      return option.text.toLowerCase().includes(pattern);
    });
  },
}: AutocompleteProps<T>): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.text || '');
  const [hightlightedIndex, setHighlightedIndex] = useState(-1);
  const filteredOptions: AutocompleteOption<T>[] = useMemo(() => {
    return optionsFilter(options, inputValue);
  }, [options, optionsFilter, inputValue]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        setInputValue('');
      },
    };
  });

  useEffect(() => {
    onTextChange?.(inputValue);
  }, [inputValue, onTextChange]);

  useEffect(() => {
    const handleClickOutside: Parameters<
      typeof document.addEventListener
    >[1] = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);

        if (value) {
          setInputValue(value.text);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value]);

  useEffect(() => {
    if (hightlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        hightlightedIndex
      ] as HTMLElement;

      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [hightlightedIndex]);

  useEffect(() => {
    setInputValue(value?.text || '');
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      const { value } = event.target;

      setInputValue(value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    }, []);

  const handleSelect: (option: AutocompleteOption<T>) => void =
    useCallback(
      (option) => {
        setInputValue(option.text);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onOptionChange?.(option);
      },
      [onOptionChange]
    );

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();

            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) => {
                return prev < filteredOptions.length - 1 ? prev + 1 : 0;
              });
            }

            break;

          case 'ArrowUp':
            event.preventDefault();

            if (isOpen) {
              setHighlightedIndex((prev) => {
                return prev > 0 ? prev - 1 : filteredOptions.length - 1;
              });
            }

            break;

          case 'Enter':
            event.preventDefault();

            if (
              isOpen &&
              hightlightedIndex >= 0 &&
              filteredOptions[hightlightedIndex]
            ) {
              handleSelect(filteredOptions[hightlightedIndex]);
            }

            break;

          case 'Escape':
            event.preventDefault();

            setIsOpen(false);

            if (value) {
              setInputValue(value.text);
            }

            break;

          case 'Tab':
            setIsOpen(false);

            break;
        }
      },
      [isOpen, hightlightedIndex, filteredOptions, handleSelect, value]
    );

  const handleFocus: FocusEventHandler<HTMLInputElement> =
    useCallback(() => {
      setIsOpen(true);
    }, []);

  return (
    <div className={styles.Autocomplete} ref={containerRef}>
      <input
        className={styles.input}
        ref={inputRef}
        type="text"
        value={inputValue}
        autoComplete="off"
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />

      {isOpen && (
        <ul ref={listRef} className={styles.list}>
          {filteredOptions.map((option, index) => {
            const isHighlighted = index === hightlightedIndex;

            return (
              <li
                key={option.id}
                className={classNames([
                  styles.option,
                  isHighlighted && styles.isHighlighted,
                ])}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
