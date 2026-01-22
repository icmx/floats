import type { FunctionComponent } from 'react';
import { classNames } from '../../../utils/common';
import type { CalloutProps } from './Callout.types';
import styles from './Callout.module.css';

export const Callout: FunctionComponent<CalloutProps> = ({
  appearance,
  children,
}) => {
  return (
    <div
      className={classNames([
        styles.Callout,
        appearance === 'failure' && styles.isFailure,
      ])}
    >
      {children}
    </div>
  );
};
