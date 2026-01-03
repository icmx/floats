import type {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
} from 'react';
import type { PairCardProps } from './PairCard.types';
import styles from './PairCard.module.css';

export const PairCard: FunctionComponent<PairCardProps> = ({
  data,
  onCheck,
  onRemove,
}) => {
  const id = `pair-card-${data.value}-checkbox`.toLowerCase();

  const handleCheck: ChangeEventHandler<HTMLInputElement> = (event) => {
    onCheck?.(event.target.checked);
  };

  const handleRemove: MouseEventHandler<HTMLButtonElement> = () => {
    onRemove?.();
  };

  return (
    <div className={styles.PairCard}>
      <input
        id={id}
        type="checkbox"
        checked={data.checked}
        onChange={handleCheck}
      />
      <label htmlFor={id}>{data.value}</label>
      <button onClick={handleRemove}>remove</button>
    </div>
  );
};
