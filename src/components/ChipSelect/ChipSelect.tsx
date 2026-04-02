import {
  useRef,
  type FunctionComponent,
  type KeyboardEvent,
} from 'react';
import { classNames } from '@/lib/classNames';
import { Chip } from '../Chip';
import { useChipSelect } from './hooks/useChipSelect';
import { useClickOutside } from './hooks/useClickOutside';
import { useScrollToFocused } from './hooks/useScrollToFocused';
import { useViewportResize } from './hooks/useViewportResize';
import type { ChipSelectProps } from './ChipSelect.types';
import styles from './ChipSelect.module.css';

export const ChipSelect: FunctionComponent<ChipSelectProps> = ({
  options,
  selectedOptions,
  optionsFilter,
  autoComplete,
  autoCapitalize,
  placeholder,
  spellCheck,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const {
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
  } = useChipSelect({
    inputRef,
    options,
    selectedOptions,
    optionsFilter,
    onChange,
  });

  const restOptionsLength = options.length - filteredOptions.length;
  const shouldShowRestOptions =
    restOptionsLength > 0 && restOptionsLength !== options.length;

  const shouldShowNoOptionsAvailable = filteredOptions.length === 0;

  useViewportResize({
    skip: !isOpen,
    onViewportResize: () => {
      close();
    },
  });

  useClickOutside({
    containerRef,
    skip: !isOpen,
    onClickOutside: () => {
      close();
    },
  });

  useScrollToFocused({
    listRef,
    focusedIndex,
  });

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusNext();

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusPrev();

      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      selectFocused();

      return;
    }

    if (event.key === 'Escape') {
      close();

      return;
    }

    if (event.key === 'Backspace') {
      unselectLatest();

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
                unselect(selectedOption);
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
            writeValue(event.target.value);
          }}
          onFocus={() => {
            open();
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
                    select(filteredOption);
                  }}
                  onMouseEnter={() => {
                    focusAt(index);
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
