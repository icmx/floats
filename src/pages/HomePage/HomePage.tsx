import { type FunctionComponent } from 'react';
import { Card } from '../../components/common/Card';
import { CardRow } from '../../components/common/CardRow';
import {
  useSymbolsStoreEntries,
  useSymbolsStoreActions,
} from '../../hooks/useSymbolsStore';

export const HomePage: FunctionComponent = () => {
  const symbolsEntries = useSymbolsStoreEntries();
  const symbolsActions = useSymbolsStoreActions();

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
