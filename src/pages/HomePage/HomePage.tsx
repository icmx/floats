import { useMemo, useRef, type FunctionComponent } from 'react';
import {
  Autocomplete,
  type AutocompleteHandle,
  type AutocompleteOption,
} from '../../components/Autocomplete';
import { Card } from '../../components/Card';
import { CardRow } from '../../components/CardRow';
import { SYMBOLS } from '../../constants/currency';
import {
  useSymbolCards,
  useSymbolCardsActions,
} from '../../hooks/useSymbolCardsStore';
import type { SymbolString } from '../../types/currency';

export const HomePage: FunctionComponent = () => {
  const symbolCards = useSymbolCards();
  const symbolCardsActions = useSymbolCardsActions();

  const symbolsOptions: AutocompleteOption<SymbolString>[] =
    useMemo(() => {
      const symbolCardsValues = symbolCards.map(
        (symbolCard) => symbolCard.symbol
      );

      return SYMBOLS.filter(
        (symbol) => !symbolCardsValues.includes(symbol)
      ).map((symbol) => {
        const pattern = symbol.toLowerCase();

        return {
          id: `option-${pattern}`,
          value: symbol,
          pattern,
          text: symbol,
        };
      });
    }, [symbolCards]);

  const ref = useRef<AutocompleteHandle>(null);

  const dataSymbols = symbolCards
    .filter((symbolCard) => symbolCard.checked)
    .map((symbolCard) => symbolCard.symbol)
    .join(',');

  const dataHref = dataSymbols ? `/data?by=${dataSymbols}` : null;

  return (
    <>
      <title>floats</title>

      <Autocomplete<SymbolString>
        ref={ref}
        options={symbolsOptions}
        placeholder="Search symbols like USDEUR"
        onOptionChange={(option) => {
          if (option) {
            symbolCardsActions.add(option?.value);
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
        {symbolCards.map((symbolCard) => {
          const id = `symbol-card-${symbolCard.symbol.toLowerCase()}-checkbox`;
          const chartHref = `/chart?by=${symbolCard.symbol}`;
          const convertHref = `/convert?by=${symbolCard.symbol}`;

          return (
            <Card key={symbolCard.symbol}>
              <CardRow>
                <input
                  id={id}
                  type="checkbox"
                  checked={symbolCard.checked}
                  onChange={(event) => {
                    symbolCardsActions.check(
                      event.target.checked,
                      symbolCard.symbol
                    );
                  }}
                />
                <label htmlFor={id}>{symbolCard.symbol}</label>
                <button
                  type="button"
                  onClick={() => {
                    symbolCardsActions.remove(symbolCard.symbol);
                  }}
                >
                  x
                </button>
              </CardRow>
              <CardRow>
                <a href={chartHref}>Chart</a>
                <a href={convertHref}>Convert</a>
              </CardRow>
            </Card>
          );
        })}
      </div>

      {dataHref && <a href={dataHref}>Explore data</a>}
    </>
  );
};
