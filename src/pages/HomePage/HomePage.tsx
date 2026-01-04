import { useMemo, useRef, type FunctionComponent } from 'react';
import {
  Autocomplete,
  type AutocompleteHandle,
  type AutocompleteOption,
} from '../../components/Autocomplete';
import { PairCard } from '../../components/PairCard';
import { PAIRS } from '../../constants/pairs';
import { BASE_HREF } from '../../constants/baseHref';
import {
  usePairCards,
  usePairCardsActions,
} from '../../hooks/usePairCardsStore';

export const HomePage: FunctionComponent = () => {
  const pairCards = usePairCards();
  const pairCardsActions = usePairCardsActions();

  const currencyPairsOptions: AutocompleteOption[] = useMemo(() => {
    const pairCardsValues = pairCards.map((pairCard) => pairCard.value);

    return PAIRS.filter((pair) => !pairCardsValues.includes(pair)).map(
      (pair) => {
        return {
          id: `option-${pair}`.toLowerCase(),
          text: pair,
          value: pair,
        };
      }
    );
  }, [pairCards]);

  const ref = useRef<AutocompleteHandle>(null);

  const dataPairs = pairCards
    .filter((pairCard) => pairCard.checked)
    .map((pairCard) => pairCard.value)
    .join(',');

  const dataHref = dataPairs
    ? `${BASE_HREF}/data?by=${dataPairs}`
    : null;

  return (
    <>
      <title>floats</title>

      <Autocomplete
        ref={ref}
        options={currencyPairsOptions}
        placeholder="Type here to add a new pair"
        onOptionChange={(option) => {
          pairCardsActions.add(option?.value || '');
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
        {pairCards.map((pairCard) => {
          return (
            <PairCard
              key={pairCard.value}
              data={pairCard}
              onCheck={(checked) => {
                pairCardsActions.check(checked, pairCard.value);
              }}
              onRemove={() => {
                pairCardsActions.remove(pairCard.value);
              }}
            />
          );
        })}
      </div>

      {dataHref && <a href={dataHref}>Explore data</a>}

      <pre>data = {JSON.stringify(dataPairs)}</pre>
      <pre>cards = {JSON.stringify(pairCards, null, 2)}</pre>
    </>
  );
};
