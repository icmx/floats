import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { fetchCurrenciesByNotation } from '../../api/client';
import { Converter } from '../../components/currency/Converter';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { type AsyncPayload } from '../../types/common';
import type { CodeString, SymbolString } from '../../types/currency';

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

  return (
    <>
      <SymbolChips href={(id) => `/convert?by=${id}`} />

      {error && <ErrorCallout error={error} />}

      {rate && (
        <form>
          <Converter
            baseAmount={1}
            baseCode={symbol.substring(0, 3) as CodeString}
            quoteCode={symbol.substring(3, 6) as CodeString}
            rate={rate}
          />
        </form>
      )}
    </>
  );
};
