import type { FunctionComponent } from 'react';
import type { CardRowProps } from './CardRow.types';
import styles from './CardRow.module.css';

export const CardRow: FunctionComponent<CardRowProps> = ({
  children,
}) => {
  return <div className={styles.CardRow}>{children}</div>;
};
