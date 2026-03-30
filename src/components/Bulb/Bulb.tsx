import type { FunctionComponent } from 'react';
import type { BulbProps } from './Bulb.types';
import styles from './Bulb.module.css';

export const Bulb: FunctionComponent<BulbProps> = ({ color }) => {
  return (
    <span
      style={{ backgroundColor: color }}
      className={styles.Bulb}
    ></span>
  );
};
