import { createElement, type FunctionComponent } from 'react';
import type { ChipProps } from './Chip.types';
import styles from './Chip.module.css';

export const Chip: FunctionComponent<ChipProps> = ({
  children,
  type = 'div',
  href,
  onClick,
}) => {
  const className = styles.Chip;

  const element = createElement(type, {
    className,
    href,
    onClick,
    children,
  });

  return element;
};
