import type { FunctionComponent } from 'react';
import { useSymbolsStoreEntries } from '../../../hooks/useSymbolsStore';
import { useRawSearchParams } from '../../../hooks/useRawSearchParams';
import type { SymbolString } from '../../../types/currency';
import { Chip } from '../../common/Chip';
import styles from './SymbolChip.module.css';

type SymbolChipEntry = {
  id: SymbolString;
  selected: boolean;
  disabled: boolean;
};

const useSymbolChipsEntries = (): [
  SymbolChipEntry[],
  (id: SymbolString) => void
] => {
  const storeEntries = useSymbolsStoreEntries();

  const [searchParams, setSearchParams] = useRawSearchParams();
  const notation = searchParams.get('by') || '';
  const selectedSymbols = notation.split(',') || [];

  const onlyOneSelected = selectedSymbols.length === 1;
  const tooManySelected = selectedSymbols.length > 2;

  const chipEntries: SymbolChipEntry[] = storeEntries.map((entry) => {
    const id = entry.id;
    const thisOneSelected = selectedSymbols.includes(id);

    const disabled =
      (onlyOneSelected && thisOneSelected) ||
      (tooManySelected && !thisOneSelected);

    return {
      id,
      selected: thisOneSelected,
      disabled,
    };
  });

  const toggleChipEntry = (id: SymbolString) => {
    const target = chipEntries.find((chipEntry) => chipEntry.id === id);

    if (!target) {
      return;
    }

    const values = target.selected
      ? selectedSymbols.filter(
          (selectedSymbol) => selectedSymbol !== target.id
        )
      : [...selectedSymbols, target.id];

    const nextNotation = values.join(',');

    setSearchParams(
      (nextSearchParams) => {
        nextSearchParams.set('by', nextNotation);

        return nextSearchParams;
      },
      { replace: true }
    );
  };

  return [chipEntries, toggleChipEntry];
};

export const SymbolChips: FunctionComponent = () => {
  const [entries, toggleEntry] = useSymbolChipsEntries();

  return (
    <div className={styles.SymbolChips}>
      {entries.map((entry) => {
        return (
          <Chip
            key={entry.id}
            type="button"
            disabled={entry.disabled}
            selected={entry.selected}
            onClick={() => {
              toggleEntry(entry.id);
            }}
          >
            {entry.id}
          </Chip>
        );
      })}
    </div>
  );
};
