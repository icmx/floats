import type { FunctionComponent } from 'react';
import type { LineFieldProps } from './LineField.types';
import styles from './LineField.module.css';

export const LineField: FunctionComponent<LineFieldProps> = ({
  id,
  label,
  ...inputProps
}) => {
  return (
    <div className={styles.LineField}>
      <label className={styles.LineFieldLabel} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.LineFieldInput}
        id={id}
        {...inputProps}
      />
    </div>
  );
};
