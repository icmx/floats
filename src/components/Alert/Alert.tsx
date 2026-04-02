import type { FunctionComponent } from 'react';
import { classNames } from '@/lib/classNames';
import type { AlertProps } from './Alert.types';
import styles from './Alert.module.css';

export const Alert: FunctionComponent<AlertProps> = ({
  status,
  children,
}) => {
  const className = classNames([styles.Alert, styles[`is-${status}`]]);

  return <div className={className}>{children}</div>;
};
