import type { FunctionComponent } from 'react';
import { classNames } from '../../../utils/common';
import type { AlertProps } from './Alert.types';
import styles from './Alert.module.css';

export const Alert: FunctionComponent<AlertProps> = ({
  appearance,
  children,
}) => {
  return (
    <div
      className={classNames([
        styles.Alert,
        appearance === 'failure' && styles.isFailure,
      ])}
    >
      {children}
    </div>
  );
};
