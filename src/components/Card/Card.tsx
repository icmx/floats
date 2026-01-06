import type { FunctionComponent } from 'react';
import type { CardProps } from './Card.types';
import styles from './Card.module.css';

export const Card: FunctionComponent<CardProps> = ({ children }) => {
  return <div className={styles.Card}>{children}</div>;
};
