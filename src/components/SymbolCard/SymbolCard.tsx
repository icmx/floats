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
  const id = `symbol-card-${data.symbol.toLowerCase()}-checkbox`;
  const chartHref = `/chart?by=${data.symbol}`;
  const convertHref = `/convert?by=${data.symbol}`;

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
        <label htmlFor={id}>{data.symbol}</label>
        <button onClick={handleRemove}>remove</button>
      </div>
      <div className={styles.CardRow}>
        <a href={chartHref}>Chart</a>
        <a href={convertHref}>Convert</a>
      </div>
    </div>
  );
};
