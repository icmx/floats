import type { FunctionComponent } from 'react';
import { useSymbolsStoreEntries } from '../../../hooks/useSymbolsStore';
import { useSymbolsQueryParam } from '../../../hooks/useSymbolsQueryParam';
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

  const [selectedSymbols, setSelectedSymbols] = useSymbolsQueryParam();

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

    setSelectedSymbols(values);
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
