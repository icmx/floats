import type {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
} from 'react';
import type { SymbolCardProps } from './SymbolCard.types';
import styles from './SymbolCard.module.css';

export const SymbolCard: FunctionComponent<SymbolCardProps> = ({
  data,
  onCheck,
  onRemove,
}) => {
  const id = `symbol-card-${data.value.toLowerCase()}-checkbox`;
  const href = `/chart?by=${data.value}`;

  const handleCheck: ChangeEventHandler<HTMLInputElement> = (event) => {
    onCheck?.(event.target.checked);
  };

  const handleRemove: MouseEventHandler<HTMLButtonElement> = () => {
    onRemove?.();
  };

  return (
    <div className={styles.SymbolCard}>
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
