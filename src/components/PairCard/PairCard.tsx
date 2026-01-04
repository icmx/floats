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
  const href = `/chart?by=${data.value}`;

  const handleCheck: ChangeEventHandler<HTMLInputElement> = (event) => {
    onCheck?.(event.target.checked);
  };

  const handleRemove: MouseEventHandler<HTMLButtonElement> = () => {
    onRemove?.();
  };

  return (
    <div className={styles.PairCard}>
      <div className={styles.CardRow}>
        <input
          id={id}
          type="checkbox"
          checked={data.checked}
          onChange={handleCheck}
        />
        <label htmlFor={id}>{data.value}</label>
        <button onClick={handleRemove}>remove</button>
      </div>
      <div className={styles.CardRow}>
        <a href={href}>Explore chart</a>
      </div>
    </div>
  );
};
