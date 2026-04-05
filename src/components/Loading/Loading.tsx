import { type FunctionComponent } from 'react';
import { type LoadingProps } from './Loading.types';
import styles from './Loading.module.css';

export const Loading: FunctionComponent<LoadingProps> = ({
  children = 'Loading...',
}) => {
  return (
    <div className={styles.Loading}>
      <p className={styles.Blinking}>{children}</p>
    </div>
  );
};
