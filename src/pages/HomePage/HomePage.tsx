import { useMemo, useRef, type FunctionComponent } from 'react';
import {
  Autocomplete,
  type AutocompleteHandle,
  type AutocompleteOption,
} from '../../components/Autocomplete';
import { SymbolCard } from '../../components/SymbolCard';
import { SYMBOLS } from '../../constants/currency';
import {
  useSymbolCards,
  useSymbolCardsActions,
} from '../../hooks/useSymbolCardsStore';

export const HomePage: FunctionComponent = () => {
  const symbolCards = useSymbolCards();
  const symbolCardsActions = useSymbolCardsActions();

  const symbolsOptions: AutocompleteOption[] = useMemo(() => {
    const symbolCardsValues = symbolCards.map(
      (symbolCard) => symbolCard.value
    );

    return SYMBOLS.filter(
      (symbol) => !symbolCardsValues.includes(symbol)
    ).map((symbol) => {
      return {
        id: `option-${symbol}`.toLowerCase(),
        text: symbol,
        value: symbol,
      };
    });
  }, [symbolCards]);

  const ref = useRef<AutocompleteHandle>(null);

  const dataSymbols = symbolCards
    .filter((symbolCard) => symbolCard.checked)
    .map((symbolCard) => symbolCard.value)
    .join(',');

  const dataHref = dataSymbols ? `/data?by=${dataSymbols}` : null;

  return (
    <>
      <title>floats</title>

      <Autocomplete
        ref={ref}
        options={symbolsOptions}
        placeholder="Type here to add a new symbol"
        onOptionChange={(option) => {
          symbolCardsActions.add(option?.value || '');
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
          return (
            <SymbolCard
              key={symbolCard.value}
              data={symbolCard}
              onCheck={(checked) => {
                symbolCardsActions.check(checked, symbolCard.value);
              }}
              onRemove={() => {
                symbolCardsActions.remove(symbolCard.value);
              }}
            />
          );
        })}
      </div>

      {dataHref && <a href={dataHref}>Explore data</a>}

      <pre>data = {JSON.stringify(dataSymbols)}</pre>
      <pre>cards = {JSON.stringify(symbolCards, null, 2)}</pre>
    </>
  );
};
