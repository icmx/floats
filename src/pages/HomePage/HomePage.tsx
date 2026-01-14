import { useMemo, useRef, type FunctionComponent } from 'react';
import {
  Autocomplete,
  type AutocompleteHandle,
  type AutocompleteOption,
} from '../../components/common/Autocomplete';
import { Card } from '../../components/common/Card';
import { CardRow } from '../../components/common/CardRow';
import { SYMBOLS } from '../../constants/currency';
import {
  useSymbolsStoreEntries,
  useSymbolsStoreActions,
} from '../../hooks/useSymbolsStore';
import type { SymbolString } from '../../types/currency';

export const HomePage: FunctionComponent = () => {
  const symbolsEntries = useSymbolsStoreEntries();
  const symbolsActions = useSymbolsStoreActions();

  const symbolsOptions: AutocompleteOption<SymbolString>[] =
    useMemo(() => {
      const symbols = symbolsEntries.map(
        (symbolEntry) => symbolEntry.id
      );

      return SYMBOLS.filter((symbol) => !symbols.includes(symbol)).map(
        (symbol) => {
          const pattern = symbol.toLowerCase();

          return {
            id: `option-${pattern}`,
            value: symbol,
            pattern,
            text: symbol,
          };
        }
      );
    }, [symbolsEntries]);

  const ref = useRef<AutocompleteHandle>(null);

  const notation = symbolsEntries
    .filter((symbolEntry) => symbolEntry.checked)
    .map((symbolEntry) => symbolEntry.id)
    .join(',');

  const chartHref = `/chart` + (notation ? `?by=${notation}` : '');
  const convertHref = `/convert` + (notation ? `?by=${notation}` : '');
  const dataHref = `/data` + (notation ? `?by=${notation}` : '');

  return (
    <>
      <title>floats</title>

      <Autocomplete<SymbolString>
        ref={ref}
        options={symbolsOptions}
        placeholder="Search symbols like USDEUR"
        onOptionChange={(option) => {
          if (option) {
            symbolsActions.add(option?.value);
          }

          ref.current?.reset();
        }}
      />

      <div
        style={{
          display: 'grid',
          margin: '1rem 0',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
      >
        {symbolsEntries.map((symbolEntry) => {
          const id = `symbol-card-${symbolEntry.id.toLowerCase()}-checkbox`;

          return (
            <Card key={symbolEntry.id}>
              <CardRow>
                <input
                  id={id}
                  type="checkbox"
                  checked={symbolEntry.checked}
                  onChange={(event) => {
                    symbolsActions.check(
                      symbolEntry.id,
                      event.target.checked
                    );
                  }}
                />
                <label htmlFor={id}>{symbolEntry.id}</label>
                <button
                  type="button"
                  onClick={() => {
                    symbolsActions.remove(symbolEntry.id);
                  }}
                >
                  x
                </button>
              </CardRow>
            </Card>
          );
        })}
      </div>

      <nav style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem' }}>
        <a href={chartHref}>Chart</a>
        <a href={convertHref}>Convert</a>
        <a href={dataHref}>Data</a>
      </nav>
    </>
  );
};
