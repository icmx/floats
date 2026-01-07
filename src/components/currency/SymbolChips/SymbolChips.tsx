import type { FunctionComponent } from 'react';
import { useSymbolsStoreEntries } from '../../../hooks/useSymbolsStore';
import { Chip } from '../../common/Chip';
import type { SymbolChipsProps } from './SymbolChips.types';
import styles from './SymbolChip.module.css';

export const SymbolChips: FunctionComponent<SymbolChipsProps> = ({
  href,
}) => {
  const symbolEntries = useSymbolsStoreEntries();

  return (
    <div className={styles.SymbolChips}>
      {symbolEntries.map((symbolEntry) => {
        return (
          <Chip
            key={symbolEntry.id}
            type="a"
            href={href(symbolEntry.id)}
          >
            {symbolEntry.id}
          </Chip>
        );
      })}
    </div>
  );
};
