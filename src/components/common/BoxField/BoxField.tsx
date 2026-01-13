import type { FunctionComponent } from 'react';
import type { BoxFieldProps } from './BoxField.types';
import styles from './BoxField.module.css';

export const BoxField: FunctionComponent<BoxFieldProps> = ({
  id,
  label,
  ...inputPtops
}) => {
  return (
    <div className={styles.BoxField}>
      <input className={styles.BoxFieldInput} id={id} {...inputPtops} />
      <label className={styles.BoxFieldLabel} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
