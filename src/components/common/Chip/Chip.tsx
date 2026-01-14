import { createElement, type FunctionComponent } from 'react';
import type { ChipProps } from './Chip.types';
import styles from './Chip.module.css';
import { classNames } from '../../../utils/common';

export const Chip: FunctionComponent<ChipProps> = ({
  children,
  type = 'div',
  disabled = false,
  selected = false,
  href,
  onClick,
}) => {
  const className = classNames({
    [styles.Chip]: true,
    [styles.isDisabled]: disabled,
    [styles.isSelected]: selected,
  });

  const element = createElement(type, {
    className,
    href,
    disabled,
    onClick,
    children,
  });

  return element;
};
