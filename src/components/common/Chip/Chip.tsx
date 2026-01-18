import { type FunctionComponent } from 'react';
import { classNames } from '../../../utils/common';
import type { ChipProps } from './Chip.types';
import styles from './Chip.module.css';

export const Chip: FunctionComponent<ChipProps> = ({
  children,
  disabled = false,
  onClick,
  onRemove,
}) => {
  const className = classNames({
    [styles.Chip]: true,
    [styles.isDisabled]: disabled,
  });

  return (
    <div className={className}>
      <button
        className={classNames([styles.ChipClickable, styles.ChipLabel])}
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          onClick?.();
        }}
      >
        {children}
      </button>
      <button
        className={classNames([
          styles.ChipClickable,
          styles.ChipButton,
        ])}
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          onRemove?.();
        }}
      >
        ✖
      </button>
    </div>
  );
};
