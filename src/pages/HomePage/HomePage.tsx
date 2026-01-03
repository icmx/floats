import {
  useMemo,
  useReducer,
  useRef,
  type FunctionComponent,
} from 'react';
import { PAIRS } from '../../constants/pairs';
import {
  Autocomplete,
  type AutocompleteHandle,
  type AutocompleteOption,
} from '../../components/Autocomplete';
import { PairCard, type PairCardData } from '../../components/PairCard';
import { BASE_URL } from '../../constants/baseUrl';

export const HomePage: FunctionComponent = () => {
  const [pairCards, setPairCards] = useReducer<
    PairCardData[],
    [
      | { type: 'add'; value: string }
      | { type: 'check'; checked: boolean; value: string }
      | { type: 'remove'; value: string }
    ]
  >(
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, { checked: false, value: action.value }];

        case 'check':
          return state.map((item) => {
            return item.value === action.value
              ? { checked: action.checked, value: action.value }
              : item;
          });

        case 'remove':
          return state.filter((item) => {
            return item.value !== action.value;
          });
      }
    },
    [
      { checked: false, value: 'USDRUB' },
      { checked: true, value: 'KGSAMD' },
    ]
  );

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
    ? `${BASE_URL}/data?by=${dataPairs}`
    : null;

  return (
    <>
      <title>floats</title>
      <Autocomplete
        ref={ref}
        options={currencyPairsOptions}
        placeholder="Type here to add a new pair"
        onOptionChange={(option) => {
          setPairCards({
            type: 'add',
            value: option?.value || '',
          });
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
                setPairCards({
                  type: 'check',
                  checked,
                  value: pairCard.value,
                });
              }}
              onRemove={() => {
                setPairCards({ type: 'remove', value: pairCard.value });
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
