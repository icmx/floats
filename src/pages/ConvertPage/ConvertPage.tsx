import { useEffect, useState, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { fetchCurrenciesByNotation } from '../../api/client';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import type { SymbolString } from '../../types/currency';

type Data = {
  symbol: SymbolString;
  rate: number;
};

const fetchConvertPageData = async (
  notation: string
): Promise<Data> => {
  const currencies = await fetchCurrenciesByNotation(notation);
  const currency = currencies.at(0);

  if (!currency) {
    throw new Error('No currency available');
  }

  const symbol =
    `${currency.baseCode}${currency.quoteCode}` satisfies SymbolString;

  const { rate } = currency.rates.at(-1) || {
    date: 0,
    rate: 0,
  };

  return { symbol, rate };
};

type ConvertPageState = {
  isLoading: boolean;
  error: Error | null;
  data: Data;
  load: (notation: string) => Promise<void>;
};

const useConvertPageStore = create<ConvertPageState>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { symbol: 'USDUSD', date: 0, rate: 0 },
    load: async (notation) => {
      set({ isLoading: true, error: null });

      try {
        const data = await fetchConvertPageData(notation);

        set({ isLoading: false, error: null, data });
      } catch (cause) {
        set({ error: cause instanceof Error ? cause : new Error() });
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
  } = useConvertPageStore();
  const load = useConvertPageStore((state) => state.load);

  useEffect(() => {
    load(notation);
  }, [notation, load]);

  const [baseValue, setBaseValue] = useState('1');
  const [quoteValue, setQuoteValue] = useState('0');

  return (
    <>
      <title>floats - Convert</title>

      <SymbolChips href={(id) => `/convert?by=${id}`} />

      {error && (
        <p>
          Error: <code>{JSON.stringify(error.message, null, 2)}</code>
        </p>
      )}

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
