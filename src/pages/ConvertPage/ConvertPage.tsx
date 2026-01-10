import { useEffect, useState, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { fetchCurrenciesByNotation } from '../../api/client';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import { type AsyncPayload } from '../../types/common';
import type { SymbolString } from '../../types/currency';

type Data = {
  symbol: SymbolString | '';
  rate: number;
};

const usePageStore = create<
  AsyncPayload<Data> & { load: (notation: string) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { symbol: '', rate: 0 },
    load: async (notation) => {
      set({ isLoading: true });

      try {
        const currencies = await fetchCurrenciesByNotation(notation);
        const currency = currencies.at(0);

        if (!currency) {
          throw new Error('No currencies');
        }

        const data: Data = {
          symbol: `${currency.baseCode}${currency.quoteCode}`,
          rate: currency.rates.at(-1)?.rate || 0,
        };

        set({ error: null, data });
      } catch (error) {
        set({ error });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

export const ConvertPage: FunctionComponent = () => {
  const [fractionDigits] = useFractionDigits();

  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const {
    error,
    data: { symbol, rate },
  } = usePageStore();
  const load = usePageStore((state) => state.load);

  useEffect(() => {
    load(notation);
  }, [notation, load]);

  const [baseValue, setBaseValue] = useState('1');
  const [quoteValue, setQuoteValue] = useState('0');

  return (
    <>
      <SymbolChips href={(id) => `/convert?by=${id}`} />

      {error && <ErrorCallout error={error} />}

      <p>
        {symbol}: {rate?.toFixed(fractionDigits)}
      </p>

      {rate && (
        <form>
          <input
            type="number"
            min={0}
            step={0.01}
            value={baseValue}
            onChange={(event) => {
              const { value } = event.target;

              const baseValue = Number.parseFloat(value);

              if (Number.isNaN(baseValue)) {
                return;
              }

              const quoteValue = baseValue * rate;

              setBaseValue(baseValue.toFixed(2));
              setQuoteValue(quoteValue.toFixed(2));
            }}
          />

          <input
            type="number"
            min={0}
            step={0.01}
            value={quoteValue}
            onChange={(event) => {
              const { value } = event.target;

              const quoteValue = Number.parseFloat(value);

              if (Number.isNaN(quoteValue)) {
                return;
              }

              const baseValue = quoteValue / rate;

              setBaseValue(baseValue.toFixed(2));
              setQuoteValue(quoteValue.toFixed(2));
            }}
          />
        </form>
      )}
    </>
  );
};
