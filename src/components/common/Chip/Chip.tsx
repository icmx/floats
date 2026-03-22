import { type FunctionComponent } from 'react';
import { classNames } from '../../../utils/common';
import type { ChipProps } from './Chip.types';
import styles from './Chip.module.css';

export const Chip: FunctionComponent<ChipProps> = ({
  children,
  onRemove,
}) => {
  return (
    <div className={styles.Chip}>
      <span
        className={classNames([styles.ChipSurface, styles.ChipLabel])}
      >
        {children}
      </span>
      <button
        className={classNames([styles.ChipSurface, styles.ChipButton])}
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
